#!/usr/bin/env python
import os
import sys
import django
import re
from django.db.models import Q

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_dict.settings")
django.setup()

from words import models
from words.models import *

from django.core.exceptions import ObjectDoesNotExist 

from django.utils import timezone
from bs4 import BeautifulSoup, NavigableString
from django.core.paginator import Paginator
from words.constants import WORDREF_BASE
from words.api_call_helpers import try_fetch
import time



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


update_verb_words()
#fetch_conjugations()
