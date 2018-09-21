from django.db import models
from django.contrib.auth.models import User
from sortedm2m.fields import SortedManyToManyField
import uuid as uuid_lib
from django.db.models import Case, When, Value, IntegerField
from django.db.models import Q
from words.api_call_helpers import try_fetch, fetch_straight_collocations, fetch_reverse_collocations
import os
from django.utils import timezone
from bs4 import BeautifulSoup
from words.soup_helpers import scrape_wordref_words, parse_straight_word, parse_reverse_word
from words.words_helpers import prep_def_exmpl

class Etymology(models.Model):
    etymology = models.CharField(max_length=200, null=True)
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='word_etymologies', null=True)
    def __str__(self):
        return self.etymology

    def __unicode__(self):
        return self.etymology

class Collocation(models.Model):
    expression = models.CharField(max_length=200, null=True)
    translation = models.CharField(max_length=200, null=True)
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='word_collocations')
    example = models.CharField(max_length=200, null=True)

    def __str__(self):
        return self.expression

class Definition(models.Model):
    definition = models.CharField(max_length=200, null=True)
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='word_definitions')
    etymology = models.ForeignKey(Etymology, on_delete=models.CASCADE, related_name='definitions', null=True)

    def __str__(self):
        return self.definition

class Example(models.Model):
    example = models.CharField(max_length=200)
    definition = models.ForeignKey(Definition, on_delete=models.CASCADE, related_name='examples', blank=True, null=True)
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='word_examples')

class SingleWordManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language__in=['english', 'french', 'italian', 'russian', 'ukrainian']).annotate(order=Case(
      When(language='english', then=Value(0)),
      When(language='french', then=Value(1)),
      When(language='italian', then=Value(2)),
      When(language='russian', then=Value(3)),
      When(language='ukrainian', then=Value(4)),
      output_field=IntegerField())).order_by('order')


class EnglishWordManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language='english')

  def fetch_word(self, word):
    print('Fetching')
    base_url = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/en/' + word
    r = try_fetch(base_url, 
                  headers={ 'app_key': os.environ.get('OXFORD_API_KEY'), 
                            'app_id': os.environ.get('OXFORD_API_ID')})
    if not r:
      print('no r')
    if r:
      oxford_word = r.json()
      word_entries = []
      for r in oxford_word["results"]:
        for l in r["lexicalEntries"]:
          if l.get('derivativeOf'):
            definition = 'Derivative of ' + l.get('derivativeOf')[0].get('text')
            entry = {'etymology': '', 'definitions': [{'definition': definition}]}
            word_entries.append(entry)

          for k in l["entries"]: 
            sense = { 'definitions': [], 'etymology': '' }
            sense['etymology'] = ' '.join(k.get("etymologies", []))
            for v in k.get("senses", []): 
              for d in v.get("definitions", []):
                def_exmpls = {'definition': '', 'examples': []}
                def_exmpls['definition'] = d 
                def_exmpls['examples'] = [ {'example': e['text']} for e in v.get("examples", []) ]
                print('examples')
                sense['definitions'].append(def_exmpls);
              for c in v.get("crossReferenceMarkers", []):
                sense['definitions'].append({'definition': c});
            word_entries.append(sense)
      print(word_entries)      
      w = Word.objects.create(word=word, lookup_date=timezone.now(), language='english')
      for e in word_entries:
        ety = Etymology.objects.create(word=w, etymology=e['etymology']);
        for d in e['definitions']:
          print(d)
          exmpls = []
          edef = Definition.objects.create(word=w, definition=d['definition'], etymology=ety);
          exmpls = [ Example.objects.create(definition=edef, example=e['example'], word=w) for e in d.get('examples', []) ] 
          print('all is well')
      return (w, )

class FreeWordsManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(Q(word_etymologies__isnull=False)|
          Q(word_definitions__isnull=False)
          ).exclude(from_translation=True).filter(words=None).distinct().order_by('-lookup_date')

class ItalianWordManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language='italian')
 
  def fetch_collocations(self, word):
    straight_collocs_map = fetch_straight_collocations(word)
    reverse_collocs_map = fetch_reverse_collocations(word)
    collocs_map = { **straight_collocs_map, **reverse_collocs_map }
    collocs = []
    for expr, specs in collocs_map.items():
      #print(specs)
      expl = specs['expl']
      to_exmpl = specs.get('to_exmpl')
      fr_exmpl = specs.get('fr_exmpl')
      example = specs.get('exmpl', '')
      if expl:
        expr = expr + ' ' + expl
      if fr_exmpl:
         example = ', '.join(fr_exmpl)
      if to_exmpl:
         example += ' (' + ' '.join(to_exmpl) + ')' if example else ' '.join(to_exmpl)

      c = Collocation.objects.create(word=word, 
                                     expression=expr, 
                                     translation=', '.join(specs['trans']), 
                                     example=example) 
      collocs.append(c)
    return collocs

  def fetch_word(self, word):
    r = try_fetch("http://www.wordreference.com/iten/" + word)
    straight_words_map = parse_straight_word(r)
    print(straight_words_map)
    r = try_fetch("http://www.wordreference.com/iten/reverse/" + word)
    reverse_words_map = parse_reverse_word(r)
    print(reverse_words_map)
    words_map = [ *straight_words_map, *reverse_words_map ]
    
    if not words_map:
      return ()
    w = Word.objects.create(word=word, lookup_date=timezone.now(), language='italian')
    ety = Etymology.objects.create(word=w, etymology='');

    for defs in words_map:
      definition, example = prep_def_exmpl(defs)
      if not definition:
        continue
      print(definition)
      print(example)
       
      d = Definition.objects.filter(definition=definition, word=w).first()
      if not d:
        d = Definition.objects.create(word=w, definition=definition, etymology=ety);
      if example:
        Example.objects.create(definition=d, example=example, word=w)
    return (w,)

class FrenchWordManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language='french')
 
  def fetch_collocations(self, word):
    straight_collocs_map = fetch_straight_collocations(word)
    reverse_collocs_map = fetch_reverse_collocations(word)
    collocs_map = { **straight_collocs_map, **reverse_collocs_map }
    collocs = []
    for expr, specs in collocs_map.items():
      #print(specs)
      expl = specs['expl']
      to_exmpl = specs.get('to_exmpl')
      fr_exmpl = specs.get('fr_exmpl')
      example = specs.get('exmpl', '')
      if expl:
        expr = expr + ' ' + expl
      if fr_exmpl:
         example = ', '.join(fr_exmpl)
      if to_exmpl:
         example += ' (' + ' '.join(to_exmpl) + ')' if example else ' '.join(to_exmpl)

      c = Collocation.objects.create(word=word, 
                                     expression=expr, 
                                     translation=', '.join(specs['trans']), 
                                     example=example) 
      collocs.append(c)
    return collocs

  def fetch_word(self, word):
    r = try_fetch("http://www.wordreference.com/fren/" + word)
    straight_words_map = parse_straight_word(r)
    r = try_fetch("http://www.wordreference.com/fren/reverse/" + word)
    reverse_words_map = parse_reverse_word(r)
    words_map = [ *straight_words_map, *reverse_words_map ]
    
    if not words_map:
      return ()
    
    w = Word.objects.create(word=word, lookup_date=timezone.now(), language='french')
    ety = Etymology.objects.create(word=w, etymology='');

    for defs in words_map:
      definition, example = prep_def_exmpl(defs)
      if not definition:
        continue
      print(definition)
      print(example)
       
      d = Definition.objects.filter(definition=definition, word=w).first()
      if not d:
        d = Definition.objects.create(word=w, definition=definition, etymology=ety);
      if example:
        Example.objects.create(definition=d, example=example, word=w)
    return (w,)

class Word(models.Model):
    word = models.CharField(max_length=30)
    language = models.CharField(max_length=33)
    lookup_date = models.DateTimeField('date looked up')
    notes = models.CharField(max_length=200)
    translations = models.ManyToManyField("self", blank=True, related_name='translations')
    from_translation = models.BooleanField(default=False)
    
    objects = models.Manager()
    single_object = SingleWordManager()
    english_objects = EnglishWordManager()
    french_objects = FrenchWordManager()
    italian_objects = ItalianWordManager()
    free_words = FreeWordsManager()
    
    def __str__(self):
        return self.word

    class Meta:
        ordering = ('-lookup_date',)

class Collection(models.Model):
    name = models.CharField(max_length=30, blank=True)
    words = SortedManyToManyField(Word, related_name='words')
    created_date = models.DateTimeField('date created')
    last_modified_date = models.DateTimeField('date modified')
    notes = models.CharField(max_length=200)
    uuid = models.UUIDField(db_index=True, default=uuid_lib.uuid4, editable=False)
    owner = models.ForeignKey(User, related_name="collections", on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('-last_modified_date',)
