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
from homework.api.helpers import pull_conjugations, search_db_examples, more_db_examples, search_books

from django.core.exceptions import ObjectDoesNotExist 

from django.utils import timezone
from bs4 import BeautifulSoup, NavigableString
from django.core.paginator import Paginator
from words.constants import WORDREF_BASE
from words.api_call_helpers import try_fetch
import time


def analyze_words():
  examples = {}
  lang_wref_map = { 'french': 'fren'} 
  p = Paginator(Word.romance_words.filter(language='french').exclude(from_translation=True).filter(inflections__isnull=True), 10)
  count = p.num_pages 
  print(count)
  while count:
    words = p.page(count).object_list
    print(words)
    for word in words:
      print(word)
      if word.did_conjugations:
        continue
      if len(word.word) < 2:
        continue
      print(word.word)
      time.sleep(3)
      base_url = "https://www.wordreference.com/fren/" + word.word
      
      r = try_fetch(base_url)
      word_page = r.content
      word_soup = BeautifulSoup(word_page, features="html.parser")
      head = word_soup.find(id='articleHead')
      to_find = []
      if re.search('flection', head.get_text()):
        ls = head.get_text().split('\n')
        for l in ls:
          if re.match('Inflections', l):
            print(l)
            ow = re.search("'(\w+(\-?\w+)+)'", l)
            print(ow)
            ow = ow.group(1)
            to_find.append(ow)
            match = re.findall('(\w+:\s{1}\w+,?)', l)
            for m in match:
              f = m.split(':')[1].split(',')[0].strip()
              if re.search('[A-Z]', f):
                s = re.search('([A-Z]?\w+(\-?\w+)+)[A-Z]\w', f)
                print(s)
                if s:
                  to_find.append(s.group(1))
              else:
                to_find.append(f)
      else:
        to_find.append(word.word)
          
      examples[word.word] = {}
      examples[word.word]['examples'] = []
      ifls = sorted(set(to_find))
      examples[word.word]['ifls'] = ','.join(ifls) 

      for to_f in set(to_find):
        w_re = r"\b" + to_f + r"\b"
        print(w_re)
        w_e = search_books(w_re)
        if len(w_e):
          print('i have examples')
          examples[word.word]['examples'].extend(w_e)
        else:
          print('i have NO examples')
      i = Inflections.objects.filter(inflections__contains=word.word).first()
      print(i)
      if i:
        word.inflections = i
        word.save()
      else: 
        try:
          i = Inflections.objects.get(inflections=examples[word.word]['ifls'])
        except ObjectDoesNotExist:
          i = Inflections.objects.create(inflections=examples[word.word]['ifls'])
          for ex in examples[word.word]['examples']:
            db_ex = WordExamples.objects.create(example=ex, inflections=i)
      
        word.inflections = i
        word.save()
  
    count -= 1
  return 1

e = analyze_words()

#import json
#with open('data.json', 'w') as fp:
#  json.dump(e, fp)
#with open('data.json', 'r') as fp:
#  e = json.load(fp)

#[ print(k, ' ', e[k]['ifls'], ' ', len(e[k]['examples']))  for k in e.keys() ] 
