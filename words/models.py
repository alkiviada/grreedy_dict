from django.db import models
from django.contrib.auth.models import User
from sortedm2m.fields import SortedManyToManyField
import uuid as uuid_lib
from django.db.models import Case, When, Value, IntegerField, CharField
from django.db.models import Q
from .api_call_helpers import try_fetch
import os
import re
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist 
from bs4 import BeautifulSoup
from .soup_helpers import (scrape_wordref_words, 
                           parse_synonyms,
                           parse_pronounce,
                           parse_straight_word, 
                           parse_reverse_word, 
                           parse_straight_translations, parse_reverse_translations,
                           parse_straight_collocations, parse_reverse_collocations)
from .words_helpers import prep_def_exmpl
from .constants import WORDREF_BASE, OXFORD_BASE

class Etymology(models.Model):
    etymology = models.CharField(max_length=800, null=True)
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='word_etymologies', null=True)
    def __str__(self):
        return self.etymology

    def __unicode__(self):
        return self.etymology

class Collocation(models.Model):
    expression = models.CharField(max_length=800, null=True)
    translation = models.CharField(max_length=800, null=True)
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='word_collocations')
    example = models.CharField(max_length=800, null=True)

    def __str__(self):
        return self.expression

class Definition(models.Model):
    definition = models.CharField(max_length=800, null=True)
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='word_definitions')
    etymology = models.ForeignKey(Etymology, on_delete=models.CASCADE, related_name='definitions', null=True)

    def __str__(self):
        return self.definition

class Example(models.Model):
    example = models.CharField(max_length=800)
    definition = models.ForeignKey(Definition, on_delete=models.CASCADE, related_name='examples', blank=True, null=True)
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='word_examples')

    def __str__(self):
        return self.example

class YandexWordMixin(models.Manager):

  def create_or_get_translations(self, orig_word, **args):
    translations = []

    lang = args['ya_lang']
    language = args['language']

    base_url = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup'
    params = {
              'key': os.environ.get('YANDEX_API_KEY'),
              'lang': lang,
              'text': orig_word.word,
             }
    
    r = try_fetch(base_url, params=params)
    t = [ d['tr'] for d in r.json()['def'] ]
    words = []
    collocations = {}
    synonyms = {}
    for t in t:
      for t in t:
        word, syn, ex = [ t.get(i) for i in [ 'text', 'syn', 'ex' ] ]
        words.append(word)
        coll_items = []
        word_syns = []
        if syn:
          for s in syn:
            word_syns.append(s['text'])
          synonyms[word] = word_syns
        if ex:
          for t in ex:
            text = t['text']
            trans = ' ,'.join([ i['text'] for i in t['tr'] ])
            coll_items.append({ text: trans })
          collocations[word] = coll_items

    for new_trans in words:
      w = Word.objects.filter(word=new_trans, language=language).first()
      if not w:
        w = Word.objects.create(word=new_trans, lookup_date=timezone.now(), language=language, from_translation=True) 
      w.translations.add(orig_word)
      translations.append(w)
      if synonyms and synonyms.get(new_trans):
        for new_syn in synonyms.get(new_trans):
          s = Word.objects.filter(word=new_syn, language=language).first()
          if not s:
            s = Word.objects.create(word=new_syn, lookup_date=timezone.now(), language=language, from_translation=True) 
          s.synonyms.add(w)

      if collocations and collocations.get(new_trans):
        for expr_trans in collocations.get(new_trans):
          expr_trans = list(*expr_trans.items())
          expr = expr_trans[1]
          trans = expr_trans[0]
          c = Collocation.objects.filter(expression=expr).first()
          if not c:
            print('I am creating some collocations')
            c = Collocation.objects.create(word=w, 
                                           expression=expr, 
                                           translation=trans, 
                                          ) 
    return translations

  def create_or_get_word(self, **args):
    orig_word = args['word']
    lang = args['ya_lang']
    language = args['language']
    
    base_url = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup'
    params = {
              'key': os.environ.get('YANDEX_API_KEY'),
              'lang': lang,
              'text': orig_word,
             }
    
    r = try_fetch(base_url, params=params)

    t = [ d['tr'] for d in r.json()['def'] ]
    words = []
    examples = {}
    for t in t:
      for t in t:
        word, syn, ex, mean = [ t.get(i) for i in ['text', 'syn', 'ex', 'mean'] ]
        words.append(word)
        ex_items = []
        if ex:
          for t in ex:
            text = t['text']
            trans = ' ,'.join([ i['text'] for i in t['tr'] ])
            ex_items.append(text + ' (' + trans + ')')
          examples[word] = ex_items
        else:
          examples[word] = []
    return self.create_word(language=language, words_map=examples, word=orig_word)

  def create_word(self, **args):
    word = args['word']
    language = args['language']
    words_map = args['words_map']
    if not words_map:
      return ()
    w = Word.objects.filter(word=word, language=language).first()
    if not w:
      w = Word.objects.create(word=word, lookup_date=timezone.now(), language=language)
    else:
      w.from_translation = False
      w.save(update_fields=['from_translation'])
    ety = Etymology.objects.create(word=w, etymology='');

    for definition, examples in words_map.items():
       
      d = Definition.objects.filter(definition=definition, word=w).first()
      if not d:
        d = Definition.objects.create(word=w, definition=definition, etymology=ety);
      if examples:
        [ Example.objects.create(definition=d, example=e, word=w) for e in examples ]
    return (w,)

class WordRefWordMixin(models.Manager):
  
  def create_collocations(self, **args):
    collocs_map = args['collocations']
    word = args['word']
    collocs = []
    for expr, specs in collocs_map.items():
      expl = specs['expl']
      to_exmpl = specs.get('to_exmpl')
      fr_exmpl = specs.get('fr_exmpl')
      example = specs.get('exmpl', '')
      if expl:
        if not re.match('\(', expl):
          expl = ' (' + expl + ')'
        else:
          expl = ' ' + expl
        expr = expr + expl
      if fr_exmpl:
         example = ', '.join(fr_exmpl)
      if to_exmpl:
         example += ' (' + ' '.join(to_exmpl) + ')' if example else ' '.join(to_exmpl)

      c = Collocation.objects.filter(expression=expr).first()
      if not c:
        c = Collocation.objects.create(word=word, 
                                       expression=expr, 
                                       translation=', '.join(specs['trans']), 
                                       example=example) 
      collocs.append(c)
    return collocs

  def fetch_and_parse_collocations(self, orig_word, **args):
    ext = args['ext']

    r = try_fetch(WORDREF_BASE + ext + "/" + orig_word.word)
    straight_collocations = parse_straight_collocations(r)

    r = try_fetch(WORDREF_BASE + ext + "/reverse/" + orig_word.word)
    reverse_collocations = parse_reverse_collocations(r)

    return { **straight_collocations, **reverse_collocations }

  def fetch_and_parse_synonyms(self, orig_word, **args):
    ext = args['ext']
    print('in fetching')

    r = try_fetch(WORDREF_BASE + ext + "/" + orig_word.word)
    synonyms = parse_synonyms(r)

    return synonyms

  def fetch_and_parse_translations(self, orig_word, **args):
    ext = args['ext']
    print('translations')

    r = try_fetch(WORDREF_BASE + ext + "/" + orig_word.word)
    straight_translations = parse_straight_translations(r)
    #print(straight_translations)

    r = try_fetch(WORDREF_BASE + ext + "/reverse/" + orig_word.word)
    reverse_translations = parse_reverse_translations(r)
    #print(reverse_translations)
    #print({ **straight_translations, **reverse_translations })

    return { **straight_translations, **reverse_translations }

  def create_bare_word(self, **args):
    words, orig_word, language = [ args[i] for i in ['words', 'original', 'language'] ]
    #print(words)
    db_words = []
    for new_w in words:
      w = Word.objects.filter(word=new_w, language=language).first()
      print(w)
      if not w:
        new_notes = ''
        if isinstance(words, dict):
          #print(words[new_w])
          new_notes = ', '.join(words[new_w])
          #print(new_notes)
        w = Word.objects.create(word=new_w, lookup_date=timezone.now(), language=language, from_translation=True, notes=new_notes) 
      db_words.append(w)
    
    return db_words

  def fetch_and_parse_word(self, **args):
    print('in fetch')
    word = args['word']
    ext = args['ext']
    r = try_fetch(WORDREF_BASE + ext + "/" + word)
    parse_return = parse_straight_word(r)
    #print(parse_return)
    straight_words_map, pronounce, is_verb = [ parse_return.get(e) for e in ['words_map', 'pronounce', 'is_verb'] ]
    print(is_verb)
    print(pronounce)
    r = try_fetch(WORDREF_BASE + ext + "/reverse/" + word)
    reverse_words_map = parse_reverse_word(r)
    #print(1 if is_verb else 0)
    #print(straight_words_map)
    #print(reverse_words_map)
    return { 'words_map': [ *straight_words_map, *reverse_words_map ], 
             'pronounce': pronounce, 
             'is_verb': 1 if is_verb else 0 }

  def create_word(self, **args):
    word = args['word']
    language = args['language']
    words_map = args['words_map']
    pronounce = args['pronounce']
    is_verb = args['is_verb']
    #print(is_verb);
    if not words_map:
      return ()
    w = Word.objects.filter(word=word, language=language).first()
    if not w:
      w = Word.objects.create(word=word, lookup_date=timezone.now(), language=language, pronounce=pronounce, is_verb=is_verb)
    else:
      w.from_translation = False
      update_fields = ['from_translation']
      if pronounce:
        w.pronounce = pronounce
        update_fields.append('pronounce')
      if is_verb:
        w.is_verb = is_verb 
        update_fields.append('is_verb')
      w.save(update_fields=update_fields)
    ety = Etymology.objects.create(word=w, etymology='');

    for defs in words_map:
      definition, example = prep_def_exmpl(defs)
      if not definition:
        continue
       
      d = Definition.objects.filter(definition=definition, word=w).first()
      if not d:
        d = Definition.objects.create(word=w, definition=definition, etymology=ety);
      if example:
        Example.objects.create(definition=d, example=example, word=w)
    print('all is well')
    return (w,)

class FrontendOrderCollectionManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().exclude(words=None).order_by('-last_modified_date').annotate(frontend_order=Case(When(name__startswith='Words with Notes', then=Value(0)), default=Value(1), output_field=CharField())).order_by('frontend_order', '-last_modified_date')

class SingleWordManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language__in=['english', 'french', 'italian', 'swedish', 'russian', 'ukrainian']).annotate(order=Case(
      When(language='english', then=Value(0)),
      When(language='french', then=Value(1)),
      When(language='italian', then=Value(2)),
      When(language='swedish', then=Value(3)),
      When(language='russian', then=Value(4)),
      When(language='ukrainian', then=Value(5)),
      output_field=IntegerField())).order_by('order')

class EnglishWordManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language='english')

  def fetch_collocations(self, word):
    return []
    print('fetching')
    base_url = 'https://od-api.oxforddictionaries.com/api/v2/search/'
    url = base_url + 'en-us' + '?q=' + word.word + '&prefix=false'
    r = try_fetch(url, 
                  headers={ 'app_key': os.environ.get('OXFORD_API_KEY'), 
                            'app_id': os.environ.get('OXFORD_API_ID')})
    collocs = []
    if not r:
      print('no r')
    if r:
      oxford_word = r.json()
      word_entries = []
      for r in oxford_word["results"]:
        colloc = r['word']
        if colloc == word.word:
          continue
        c = Collocation.objects.filter(expression=colloc).first()
        if not c:
          c = Collocation.objects.create(word=word, 
                                         expression=colloc, 
                                         ) 
        collocs.append(c)
    return collocs
        
  def fetch_synonyms(self, word):
    print('fetching')
    base_url = 'https://od-api.oxforddictionaries.com/api/v2/entries/'
    url = base_url + 'en' + '/' + word.word + '/synonyms'
    r = try_fetch(url, 
                  headers={'app_key': os.environ.get('OXFORD_API_KEY'), 
                           'app_id': os.environ.get('OXFORD_API_ID')})
    synonyms = []
    word_synonyms = []
    if not r:
      print('no r')
    if r:
      oxford_word = r.json()
      word_entries = []
      for r in oxford_word["results"]:
        for l in r.get('lexicalEntries'):
          for e in l['entries']:
            for sens in e['senses']:
              for synonym in sens['synonyms']:
                word_synonyms.append(synonym['text'])

    for new_syn in word_synonyms:
      w = Word.objects.filter(word=new_syn, language='english').first()
      if not w:
        w = Word.objects.create(word=new_syn, lookup_date=timezone.now(), language='english', from_translation=True) 
      w.synonyms.add(word)
      synonyms.append(w)

    return synonyms 

  def fetch_pronounce(self, word):
    print('Fetching')
    base_url = 'https://od-api.oxforddictionaries.com/api/v2/entries/en/' + word.word
    r = try_fetch(base_url, 
                  headers={ 'app_key': os.environ.get('OXFORD_API_KEY'), 
                            'app_id': os.environ.get('OXFORD_API_ID')})
    if not r:
      print('no r')
    if r:
      pronounce = ''
      oxford_word = r.json()
      for r in oxford_word["results"]:
        for l in r["lexicalEntries"]:
          if l.get('pronunciations'):
            pronounce = l.get('pronunciations')[0].get('phoneticSpelling')
    if pronounce:
      word.pronounce = pronounce
      word.save(update_fields=['pronounce'])


  def fetch_word(self, word):
    print('Fetching')
    base_url = 'https://od-api.oxforddictionaries.com/api/v2/entries/en-us/' + word
    r = try_fetch(base_url, 
                  headers={ 'app_key': os.environ.get('OXFORD_API_KEY'), 
                            'app_id': os.environ.get('OXFORD_API_ID')})
    if not r:
      print('no r')
    if r:
      pronounce = ''
      oxford_word = r.json()
      word_entries = []
      for r in oxford_word["results"]:
        for l in r["lexicalEntries"]:
          if l.get('pronunciations'):
            pronounce = l.get('pronunciations')[0].get('phoneticSpelling')
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
                sense['definitions'].append(def_exmpls);
              for c in v.get("crossReferenceMarkers", []):
                sense['definitions'].append({'definition': c});
            word_entries.append(sense)

      try:
        w = Word.english_objects.get(word=word)
        w.from_translation = False
      except:
        w = Word.objects.create(word=word, lookup_date=timezone.now(), language='english', pronounce=pronounce)

      for e in word_entries:
        ety = Etymology.objects.create(word=w, etymology=e['etymology']);
        for d in e['definitions']:
          exmpls = []
          edef = Definition.objects.filter(word=w, definition=d['definition']).first()
          if not edef:
            edef = Definition.objects.create(word=w, definition=d['definition'], etymology=ety);
          exmpls = [ Example.objects.create(definition=edef, example=e['example'], word=w) for e in d.get('examples', []) ] 
      return (w, )

class FreeWordsManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(Q(word_etymologies__isnull=False)|
          Q(word_definitions__isnull=False)
          ).exclude(from_translation=True).filter(words=None).distinct().order_by('-lookup_date')

class UkrainianWordManager(YandexWordMixin, models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language='ukrainian')
 
  def fetch_translation(self, orig_word):
    return self.create_or_get_translations(orig_word, language='ukrainian', ya_lang='en-uk')

  def fetch_synonyms(self, word):
    return word.synonyms.all()

  def fetch_collocations(self, word):
    return word.word_collocations.all()

  def fetch_word(self, word):
    return self.create_or_get_word(ya_lang='uk-en', word=word, language='ukrainian')

class RussianWordManager(YandexWordMixin, models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language='russian')
 
  def fetch_translation(self, orig_word):
    return self.create_or_get_translations(orig_word, language='russian', ya_lang='en-ru')

  def fetch_synonyms(self, word):
    return word.synonyms.all()

  def fetch_collocations(self, word):
    return word.word_collocations.all()

  def fetch_word(self, word):
    return self.create_or_get_word(ya_lang='ru-en', word=word, language='russian')

class VerbManager(WordRefWordMixin, models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language__in=['english', 'french', 'italian', 'russian', 'ukrainian', 'swedish']).annotate(order=Case(
      When(language='english', then=Value(0)),
      When(language='french', then=Value(1)),
      When(language='italian', then=Value(2)),
      When(language='swedish', then=Value(3)),
      When(language='russian', then=Value(4)),
      When(language='ukrainian', then=Value(5)),
      output_field=IntegerField())).order_by('order').exclude(word='').filter(is_verb=True).exclude(conjugations=None)

class RomanceWordManager(WordRefWordMixin, models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language__in=['italian', 'french'])

  def fetch_and_parse_conjugations(self, word):
    print('ok, master, will ftech')

    lang_wref_map = { 'french': 'Fr', 'italian': 'It'} 
    r = try_fetch(WORDREF_BASE + "conj/" + lang_wref_map.get(word.language) + "Verbs.aspx?v=" + word.word)
    word_page = r.content
    word_soup = BeautifulSoup(word_page, features="html.parser")
    original = word_soup.find('h3')
    if not original:
      print('problems with wordref content')
      return ''
    original = original.get_text()
    orig_verb = ''
    if original == word.word:
      if word.conjugations:
        return word
      else:
        orig_verb = word
    else:
      try:
        orig_verb = Word.objects.get(language=word.language, word=original)
        print('i have original verb: ', orig_verb.word)
        if not orig_verb.is_verb:
          orig_verb.is_verb = 1
      except ObjectDoesNotExist:
        orig_verb = Word.objects.create(word=original, language=word.language, 
                                      from_translation=True, 
                                      lookup_date=timezone.now(), is_verb=True)
    if orig_verb.conjugations:
      word.origin_verb = orig_verb 
      word.save()
      print('returning here')
      return orig_verb
    else:
      conjs = word_soup.findAll('div', { 'class': 'aa' })
      for conj_idx, conj in enumerate(conjs):
       tense_tables = conj.findAll('table')
       for table_idx, table in enumerate(tense_tables):
         checkbox_id = word.word + '-' + word.language + '-' + "colls-toggle-" + str(conj_idx) + '-' + str(table_idx)
         attrs = {'class': "conj-toggle", 'id': checkbox_id, 'type':"checkbox"}
         if conj_idx == 0 and table_idx == 0:
           attrs['checked'] = 'checked'
           attrs['value'] = '1'
         new_checkbox = word_soup.new_tag('input',  attrs=attrs)
         table.insert(0, new_checkbox)
         arrows = table.findAll('span', class_="arrow")
         for arr_idx, arrow in enumerate(arrows): 
           class_suffix = 'right' if arr_idx == 0 else 'left'
           new_label = word_soup.new_tag('label', attrs={'for':checkbox_id, 'class': "conj-toggle-label-" + class_suffix})           
           arrow.wrap(new_label)

      conjs = ('').join([str(conj) for conj in conjs])
      #conjs = conjs.replace('checked="checked"', 'checked')
      orig_verb.conjugations = conjs 
      orig_verb.save(update_fields=['conjugations'])
      if not (orig_verb.word == word.word): 
        word.origin_verb = orig_verb 
        word.save()
      print(orig_verb.conjugations)
      orig_verb.save()
      return orig_verb

class SwedishWordManager(WordRefWordMixin, models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language='swedish')

  def fetch_conjugate(self, word):
    return self.fetch_and_parse_conjugations(word)
 
  def fetch_synonyms(self, orig_word):
    print('doing the fetch')
    synonyms = self.fetch_and_parse_synonyms(orig_word, ext='sven')
    synonyms = list(set(synonyms))
    return self.create_bare_word(language='swedish', words=synonyms, original=orig_word)

  def fetch_translation(self, orig_word):
    trans = self.fetch_and_parse_translations(orig_word, ext='ensv')
    return self.create_bare_word(language='swedish', words=trans, original=orig_word)

  def fetch_collocations(self, word):
    collocs_map = self.fetch_and_parse_collocations(word, ext='sven')
    return self.create_collocations(collocations=collocs_map, word=word)

  def fetch_word(self, word):
    fetch_return = self.fetch_and_parse_word(ext='sven', word=word)
    #print(fetch_return)
    words_map, pronounce, is_verb = [ fetch_return.get(e) for e in ('words_map', 'pronounce', 'is_verb') ]
    #print(pronounce)
    return self.create_word(word=word, words_map=words_map, language='swedish', pronounce=pronounce, is_verb=is_verb)
    
  def fetch_pronounce(self, word):
    r = try_fetch(WORDREF_BASE + "sven/" + word.word)
    if r:
      pronounce = parse_pronounce(r)
      #print(pronounce)
      if pronounce:
        word.pronounce = pronounce
        word.save(update_fields=['pronounce'])

class ItalianWordManager(RomanceWordManager, models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language='italian')

  def fetch_conjugate(self, word):
    return self.fetch_and_parse_conjugations(word)
 
  def fetch_synonyms(self, orig_word):
    print('doing the fetch')
    synonyms = self.fetch_and_parse_synonyms(orig_word, ext='iten')
    synonyms = list(set(synonyms))
    return self.create_bare_word(language='italian', words=synonyms, original=orig_word)

  def fetch_translation(self, orig_word):
    trans = self.fetch_and_parse_translations(orig_word, ext='enit')
    return self.create_bare_word(language='italian', words=trans, original=orig_word)

  def fetch_collocations(self, word):
    collocs_map = self.fetch_and_parse_collocations(word, ext='iten')
    return self.create_collocations(collocations=collocs_map, word=word)

  def fetch_word(self, word):
    fetch_return = self.fetch_and_parse_word(ext='iten', word=word)
    #print(fetch_return)
    words_map, pronounce, is_verb = [ fetch_return.get(e) for e in ('words_map', 'pronounce', 'is_verb') ]
    #print(pronounce)
    return self.create_word(word=word, words_map=words_map, language='italian', pronounce=pronounce, is_verb=is_verb)
    
  def fetch_pronounce(self, word):
    r = try_fetch(WORDREF_BASE + "iten/" + word.word)
    if r:
      pronounce = parse_pronounce(r)
      #print(pronounce)
      if pronounce:
        word.pronounce = pronounce
        word.save(update_fields=['pronounce'])

class FrenchWordManager(RomanceWordManager, models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language='french')
 
  def fetch_conjugate(self, word):
    return self.fetch_and_parse_conjugations(word)

  def fetch_collocations(self, word):
    collocs_map = self.fetch_and_parse_collocations(word, ext='fren')
    return self.create_collocations(collocations=collocs_map, word=word)

  def fetch_pronounce(self, word):
    r = try_fetch(WORDREF_BASE + "fren/" + word.word)
    if r:
      pronounce = parse_pronounce(r)
      #print(pronounce)
      if pronounce:
        word.pronounce = pronounce
        word.save(update_fields=['pronounce'])

  def fetch_synonyms(self, orig_word):
    r = try_fetch("https://www.cnrtl.fr/synonymie/" + orig_word.word)
    if not r:
      return []
    synonyms = []
    word_page = r.content
    print(word_page)
    word_soup = BeautifulSoup(word_page, features="html.parser")
    syns = word_soup.findAll('td', {'class': 'syno_format'})
    for s in syns:
      synonyms.append(s.get_text())
    return self.create_bare_word(language='french', words=synonyms, original=orig_word)
    
  def fetch_translation(self, orig_word):
    trans = self.fetch_and_parse_translations(orig_word, ext='enfr')
    #print(trans)
    #print(set(trans))
    return self.create_bare_word(language='french', words=trans, original=orig_word)
    
  def fetch_word(self, word):
    fetch_return = self.fetch_and_parse_word(ext='fren', word=word)
    words_map, pronounce, is_verb = [ fetch_return.get(e) for e in ('words_map', 'pronounce', 'is_verb') ]
    return self.create_word(word=word, words_map=words_map, language='french', pronounce=pronounce, is_verb=is_verb)

class Word(models.Model):
    word = models.CharField(max_length=600)
    language = models.CharField(max_length=33)
    lookup_date = models.DateTimeField('date looked up')
    notes = models.CharField(max_length=700)

    pronounce = models.CharField(max_length=100)
    translations = models.ManyToManyField("self", blank=True, related_name='translations')
    synonyms = models.ManyToManyField("self", blank=True, related_name='synonyms')

    from_translation = models.BooleanField(default=False)

    is_verb = models.BooleanField(default=False)
    conjugations = models.TextField(blank=True, null=True)
    origin_verb = models.ForeignKey("self", blank=True, related_name='verb', null=True, on_delete=models.CASCADE)
    did_conjugations = models.BooleanField(default=False)
    did_book_examples = models.BooleanField(default=False)
    
    objects = models.Manager()
    single_object = SingleWordManager()
    english_objects = EnglishWordManager()
    russian_objects = RussianWordManager()
    ukrainian_objects = UkrainianWordManager()
    french_objects = FrenchWordManager()
    swedish_objects = SwedishWordManager()
    italian_objects = ItalianWordManager()
    free_words = FreeWordsManager()
    romance_words = RomanceWordManager()
    true_verb_objects = VerbManager()
    
    def __str__(self):
        return self.word

    class Meta:
        ordering = ('collectionofwords', '-lookup_date',)

class CollectionMixin(object):
  def update_last_modified(self):
    print('I am updating collection')
    self.last_modified_date = timezone.now() 
    self.save(update_fields=['last_modified_date'])
  
  def add_to_collection(self, word):
    cw = CollectionOfWords(word=word, collection=self, date_added=timezone.now())
    cw.save()

  def remove_from_collection(self, word):
    cw = CollectionOfWords.objects.filter(word=word, collection=self)
    cw.delete()

  def update_fields(self, new_fields):
    for k, v in new_fields.items():
      setattr(self, k, v)
    self.save(update_fields=[*new_fields.keys()])

class Collection(CollectionMixin, models.Model):
    name = models.CharField(max_length=100, blank=True)
    words = models.ManyToManyField(Word, related_name='words', through='CollectionOfWords')
    created_date = models.DateTimeField('date created')
    last_modified_date = models.DateTimeField('date modified')
    notes = models.CharField(max_length=200)
    uuid = models.UUIDField(db_index=True, default=uuid_lib.uuid4, editable=False)
    owner = models.ForeignKey(User, related_name="collections", on_delete=models.CASCADE, null=True)

    objects = models.Manager()
    frontend_objects = FrontendOrderCollectionManager()

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('-last_modified_date',)

class CollectionOfWords(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    date_added = models.DateTimeField()

    class Meta:
        ordering = ('-date_added',)

class WordNote(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name="word_notes")
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    note = models.TextField()

class Language(models.Model):
  language = models.CharField(max_length=33)
  num_id = models.IntegerField()

  def __str__(self):
    return self.language

  class Meta:
    ordering = ('num_id',)

class LookupMap(models.Model):
    word = models.CharField(max_length=60)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    lookup_date = models.DateTimeField('date looked up')

    class Meta:
        ordering = ('-lookup_date',)

class TranslationsMap(models.Model):
    word = models.CharField(max_length=60)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    lookup_date = models.DateTimeField('date looked up')

    class Meta:
        ordering = ('-lookup_date',)
