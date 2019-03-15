#!/usr/bin/env python
import os
import sys
import django
import re
from django.db.models import Q
import glob
import spacy

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_dict.settings")
django.setup()

from words import models
from words.models import *
from homework.models import *

from django.core.exceptions import ObjectDoesNotExist 

from django.utils import timezone
from bs4 import BeautifulSoup, NavigableString
from django.core.paginator import Paginator
from words.constants import WORDREF_BASE
from words.api_call_helpers import try_fetch
import time

from homework.api.helpers import pull_conjugations_arrays

def process_file(filename, vf_re):
  output = ''
  matched_examples = []
  with open(filename,'r') as f:
    output = f.read()
  examples_soup = BeautifulSoup(output, features="html.parser")
  examples = examples_soup.findAll('p')
  for e in examples:
    if re.search(vf_re, e.get_text(), re.IGNORECASE):
      matched_examples.append(e.get_text())
  return matched_examples

def search_books(vf_re):
  matched_examples = []
  for filename in glob.glob('grreedy_library/**/*.*ml', recursive=True):
    #print(filename)
    matched_examples.extend(process_file(filename, vf_re))
    
  return matched_examples

def search_db_examples(v):
  all_db_examples = []
  collocs = v.word_collocations.all()
  examples = v.word_examples.all()
  ow = Word.objects.filter(origin_verb=v).first()
  if not len(examples) and ow:
    examples = ow.word_examples.all()
    if not len(examples):
      print('still no examples ', ow)
  if not len(collocs) and ow:
    collocs = ow.word_collocations.all()
    if not len(collocs):
      print('still no collocs', ow)
      try:
        objects_manager = getattr(Word, ow.language + '_objects')
        print(objects_manager)
        try:
          collocs_method = getattr(objects_manager, 'fetch_collocations')
          collocs = collocs_method(ow)
        except Exception as e: 
          print(e)
          print('No method to get collocations')
      except Exception as e: 
        print(e)
        print('No method to get collocations')
  examples_pks = [ e.pk for e in examples ]
  collocs_pks = [ c.pk for c in collocs ]
  all_db_examples = [ *examples, *collocs ] 
  return { 'all_ex': all_db_examples, 'c_pks': collocs_pks, 'e_pks': examples_pks }

def more_db_examples(vf_db_re, examples_pks, collocs_pks, v):
  more_examples = []
  other_examples = Example.objects.filter(example__iregex=vf_db_re).exclude(pk__in=examples_pks); 
  other_collocs = Collocation.objects.filter(example__iregex=vf_db_re).exclude(pk__in=collocs_pks); 
  for e in [*other_examples, *other_collocs]:
    print(e.example)
    if e.word.language != v.language:
      continue
    more_examples.append(e)
  return more_examples

def mark_did_examples():
  verbs = Word.true_verb_objects.filter(language='french', did_book_examples=False).exclude(word='opter')
  for v in verbs:
    v.did_book_examples = 1
    v.save()

def generate_examples():
  exs = []
  nlp = spacy.load('fr')
  print('privet')
  tenses = Tense.objects.all()
  print(tenses)
  verbs = Word.true_verb_objects.filter(word_conjugations=None, language='french', did_book_examples=False)
  for v in verbs:
    if v.language != 'french':
      continue
    c = v.conjugations
    for t in tenses:
      conjugs = Conjugation.objects.filter(word=v, tense=t)
      seen_vf = {}
      for c in conjugs:
        print(c)
        vf = c.verb_form
        vf_re_sep = ''
        if seen_vf.get(vf):
          continue
        seen_vf[vf] = 1
        if re.search(r'\s+', vf):
          print(vf)
          vf_parts = vf.split(' ')
          for vf_part in vf_parts:
            if re.search(r'\(', vf_part):
              vf_part = re.sub(r'\(.+$', '', vf_part)
              vf_part = vf_part + r"\w*\W+"
            if re.search(r"\'", vf_part):
              vf_part = re.sub(r"\'", ".*", vf_part)
            vf_re_sep += r"\W" + vf_part + r"\W.*"
          vf_db_re = vf_re = vf_re_sep
          print(vf_db_re)
          print(vf_re)
          
        elif re.search(r'\(', vf):
          vf_stripped = re.sub(r'\(.+$', '', vf)
          vf_db_re = r"\W+" + vf_stripped + r"\w*\W+"
          vf_re = r"\b" + vf_stripped + r"\w*\b"
          #print(vf_db_re)
          #print(vf_re)
        elif re.search(r'\/', vf):
          vf_stripped = re.sub(r'.\/.', '', vf)
          vf_db_re = r"\W+" + vf_stripped + r"\w*\W+"
          vf_re = r"\b" + vf_stripped + r"\w*\b"
          print(vf_db_re)
          print(vf_re)
        else:
          vf_sub = ''
          if re.search(r"\'", vf):
            vf_sub = re.sub(r"\'", ".*", vf)
          vf_db_re = r"\W+?" + vf_sub if vf_sub else vf + r"\W+"
          vf_re = r"\b" + vf_sub if vf_sub else vf + r"\b"

        all_db_examples = []
        ret_map = search_db_examples(v)
        all_db_examples = ret_map.get('all_ex')
        all_db_examples.extend(more_db_examples(vf_db_re, ret_map.get('e_pks'), ret_map.get('c_pks'), v)) 
        
        all_db_examples.extend(search_books(vf_re))
        
        seen_ex = {}
        for e in all_db_examples:
          text = nlp(e.example if not type(e) == str else e)
          for s in text.sents:
            if not re.search(r'\b\s+\b', str(s.text)):
              continue
            if re.search(vf_re, str(s.text), re.IGNORECASE):
              ex = str(s.text)
              if ex.endswith(('.', '!', '?')):
                ex = ex.strip()
                if re.match(r"\(", ex):
                  ex = ex[1:]
                if re.search(r'[.|!|?] \([A-Z]', ex):
                  ex_parts = ex.split(' (')
                  for e_p in ex_parts:
                    if re.search(vf_re, e_p, re.IGNORECASE):
                      ex = e_p
                if not re.match('(- |« )?[A-ZÀÇ]', ex):
                  print('I will be discarding: ', ex)
                  continue    
                else:
                  if not seen_ex.get(ex):
                    print(v, ' ', vf, ' ', ex)
                    seen_ex[ex] = 1
                    exs.append({ 'verb': v, 'conjugation': c, 'example': ex })
  return exs

def update_verb_words():
  lang_wref_map = { 'french': 'fren', 'italian': 'iten'} 
  p = Paginator(Word.romance_words.exclude(is_verb=True).exclude(from_translation=True), 10)
  count = p.num_pages 
  while count:
    #print(count)
    words = p.page(count).object_list
    for word in words:
      print(word.word)
      r = try_fetch(WORDREF_BASE + lang_wref_map.get(word.language) + "/" + word.word)
      word_page = r.content
      word_soup = BeautifulSoup(word_page, features="html.parser")
      is_verb = word_soup.find('a', href=lambda x: x and re.search('conj.+(It|Fr)Verbs.+v=', x))
      print(is_verb)
      if is_verb:
        word.is_verb = 1;
        word.save(update_fields=['is_verb'])
      time.sleep(60)
    

    count -= 1
  
def fetch_conjugations():
  lang_wref_map = { 'french': 'Fr', 'italian': 'It'} 
  p = Paginator(Word.objects.filter(language__in=['french', 'italian']).filter(is_verb=True).filter(origin_verb__isnull=True), 10)
  #p = Paginator(Word.objects.filter(language__in=['french', 'italian']).filter(is_verb=True), 10)
  count = p.num_pages 
  while count:
    #print(count)
    words = p.page(count).object_list
    #print(words.count())
    count -= 1
    for word in words:
     
      r = try_fetch(WORDREF_BASE + "conj/" + lang_wref_map.get(word.language) + "Verbs.aspx?v=" + word.word)
      word_page = r.content
      word_soup = BeautifulSoup(word_page, features="html.parser")
      original = word_soup.find('h3')
      if not original:
        print('i continue')
        print(word.word + ' ' + word.language)
        continue
      original = original.get_text()
      orig_verb = ''
      try:
        orig_verb = Word.objects.get(language=word.language, word=original)
        print('i have original verb: ', orig_verb.word)
        print(word.word)
      except ObjectDoesNotExist:
        orig_verb = Word.objects.create(language=word.language, word=original, from_translation=True, is_verb=True, lookup_date=timezone.now())
        print('new')
        print(orig_verb)
      #if orig_verb.conjugations:
      #  word.origin_verb = orig_verb 
      #  word.save()
      #  print('i already have conjs')
      #  print(word.origin_verb)
      #  continue
        
      conjs = word_soup.findAll('div', { 'class': 'aa' })
      for conj_idx, conj in enumerate(conjs):
       tense_tables = conj.findAll('table')
       for table_idx, table in enumerate(tense_tables):
         checkbox_id = word.word + '-' + word.language + '-' + "colls-toggle-" + str(conj_idx) + '-' + str(table_idx)
         attrs = {'class': "conj-toggle", 'id': checkbox_id, 'type':"checkbox"}
         if conj_idx == 0 and table_idx == 0:
           attrs['checked'] = 1 
         new_checkbox = word_soup.new_tag('input',  attrs=attrs)
         table.insert(0, new_checkbox)
         arrows = table.findAll('span', class_="arrow")
         for arr_idx, arrow in enumerate(arrows): 
           class_suffix = 'right' if arr_idx == 0 else 'left'
           new_label = word_soup.new_tag('label', attrs={'for':checkbox_id, 'class': "conj-toggle-label-" + class_suffix})           
           arrow.wrap(new_label)

      conjs = ('').join([str(conj) for conj in conjs])
      #print(conjs)
      orig_verb.conjugations = conjs 
      orig_verb.save(update_fields=['conjugations'])
      print('i am here')
      if not (orig_verb.word == word.word): 
        word.origin_verb = orig_verb 
        word.save()

  #w = Word.objects.filter(Q(origin_verb__isnull=True) & Q(is_verb=True)).filter(language__in=['french', 'italian'])
  #print(w.count())
  #[ print(w.word, w.language, w.origin_verb) for w in w ]

def pull_conjugations():

  verbs = Word.true_verb_objects.all()
  for v in verbs:
    c = v.conjugations
    c_soup = BeautifulSoup(c, features="html.parser")
    conjs = c_soup.findAll('table')[0].findAll('tr')
    for c in conjs:
      tds = c.findAll('td')
      if len(tds) and tds[0]:
        print(tds[0].get_text())

def fill_tense_table():
  tenses = [ 'present', 'past progressive', 'simple past', 'future', 'preterite past' ]
  for i, t in enumerate(tenses):
    Tense.objects.create(tense=t, num_id=i, language='french')

def fill_pronoun_table():
  pronouns = [ 'je', 'tu', 'il', 'nous', 'vous', 'ils' ]
  for i, p in enumerate(pronouns):
    Pronoun.objects.create(pronoun=p, num_id=i, language='french')

def fill_conjugations_table():

  verbs = Word.true_verb_objects.all()
  tenses = Tense.objects.all()
  pronouns = Pronoun.objects.all()
  for v in verbs:
    for t in tenses:
      c_arr = pull_conjugations_arrays(v.conjugations, t.num_id)
      for p in pronouns:
        c = Conjugation.objects.create(word=v, tense=t, pronoun=p, verb_form=c_arr[p.num_id])
        print(c)

def fill_empty_verbs():
  empty_verbs = Word.objects.filter(word='').exclude(is_verb=False)
  for e_v in empty_verbs:
    o_w = e_v.verb.first()
    print(o_w)
    if not o_w:
      continue
    print(o_w.language)
    ext = '/fren/' if o_w.language == 'french' else '/iten/'
    r = try_fetch(WORDREF_BASE + ext + o_w.word)
    word_page = r.content
    word_soup = BeautifulSoup(word_page, features="html.parser")
    original = word_soup.find('a', href=lambda x: x and re.search('conj.+(It|Fr)Verbs.+v=', x))
    r = try_fetch(WORDREF_BASE + original['href'])
    word_page = r.content
    word_soup = BeautifulSoup(word_page, features="html.parser")
    original = word_soup.find('h3').get_text()
    print(original)
    e_v.word = original
    e_v.save()

#fill_empty_verbs()
#fill_conjugations_table()
#fill_tense_table()
#fill_pronoun_table()

#update_verb_words()
#fetch_conjugations()

#pull_conjugations()

#exs = generate_examples()
#for e in exs:
#  ce = ConjugationExample.objects.filter(example=e['example'], conjugation=e['conjugation'])
#  if not len(ce):
#    ConjugationExample.objects.create(example=e['example'], conjugation=e['conjugation'])


#ces = ConjugationExample.objects.all()
#for ce in ces:
#  ce.tense = ce.conjugation.tense
#  ce.word = ce.conjugation.word
#  ce.save()

mark_did_examples()
