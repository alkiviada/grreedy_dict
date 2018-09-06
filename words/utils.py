import json
from bs4 import BeautifulSoup
from words.models import Word, Definition, Etymology, Example
from django.utils import timezone
from datetime import datetime
import os
import re
from words.helpers import scrape_wordref_words, try_fetch, oxford_word, create_my_word, collect_examples
from words.constants import EXTENSIONS, LANG_MAP, TRANSL_MAP

def fetch_translations(word, orig_word):
  base_url = 'http://www.wordreference.com/' 

  for l in TRANSL_MAP:
    all_trans_for_lang = []
    for e in EXTENSIONS:
      url = base_url + l + e + word
      wclass = EXTENSIONS.get(e).get('definition');
      translations = fetch_wordref_translation(l, url, wclass)
      all_trans_for_lang.extend(translations)

    translated_words = list(set(all_trans_for_lang));
    for w in translated_words:
      w = Word.objects.create(word=w, lookup_date=timezone.now(), language=TRANSL_MAP.get(l).get('db_language')) 
      w.translations.add(orig_word)

def fetch_wordref_translation(language, url, wclass):
  r = try_fetch(url)
  if r: 
    return get_wordref_words(r, language, wclass);


def get_wordref_words(r, language, wclass):
    word_page = r.content
    word_soup = BeautifulSoup(word_page, features="html.parser")
    words = []
    word_table = word_soup.find('table', {'class': 'WRD'});
    if word_table:
      [ words.extend(scrape_wordref_words(e)) 
        for e in word_table.findAll("td", {"class" : wclass}) ]

    words = list(set(words));
    words = [ e for e in words if e not in TRANSL_MAP[language].get('wref_language') ];
    return words 

def get_wordref_word_specs(r, language, def_class, exmpl_class):
    word_page = r.content
    word_soup = BeautifulSoup(word_page, features="html.parser")

    defs_exmpls_map = {}
    defs = []
    fr_exmpls = []
    to_exmpls = []
    
    word_table = word_soup.find('table', {'class': 'WRD'});
    print ("NEW TABLE");
    if word_table:
      group_class = ''
      for tr_wd in word_table.findAll("tr", {"class": ["even", "odd"]}):
        new_class = tr_wd['class'][0];
        if not group_class:
          group_class = new_class
        if group_class != new_class:
          group_class = new_class          
          definition = ', '.join(defs)
          if definition:
            examples = collect_examples(fr_exmpls, to_exmpls)
            defs_exmpls_map[definition] = examples
          defs = []
          fr_exmpls = []
          to_exmpls = []
        new_def = scrape_wordref_words(tr_wd.find('td', {'class': def_class}), 0)
        new_fr_ex = scrape_wordref_words(tr_wd.find('td', {'class': exmpl_class[0]}), 0)
        new_to_ex = scrape_wordref_words(tr_wd.find('td', {'class': exmpl_class[1]}), 0)
        if new_def:
          defs.append(new_def)
        if new_fr_ex:
          fr_exmpls.append(new_fr_ex)
        if new_to_ex:
          to_exmpls.append(new_to_ex)
    if defs:
      definition = ', '.join(defs)
      if definition: 
        defs_exmpls_map[definition] = collect_examples(fr_exmpls, to_exmpls)

    if not defs_exmpls_map.keys():
      return

    return { 'language' : LANG_MAP.get(language).get('db_language'), 
             'specs': [{ 'etymology' : '', 
                        'definitions': [ {'definition': d, 'examples': [ { 'example': defs_exmpls_map.get(d) } ] } for d in defs_exmpls_map ] 
                      }],
           }



def fetch_word(word_id):
  apis = [
    { 'name': 'OXFORD',
      'api_specs': { 'url': 'https://od-api.oxforddictionaries.com:443/api/v1/entries/',
                    'app_key': os.environ.get('OXFORD_API_KEY'),
                    'app_id': os.environ.get('OXFORD_API_ID'),
                    'languages': ['en'], 
                    'create_function': oxford_word,
                    'create_url': oxford_url,
      },
    },
    { 'name': 'WORDREF',
      'api_specs': { 'url': 'http://www.wordreference.com/',
                     'languages': ['fren', 'iten', ],
                     'create_function': wordref_word,
                     'create_url': wordref_url,
      },
    },
  ] 
  word_specs = []
  for api in apis: 
    loc = api.get('api_specs')
    urls = loc.get('create_url')(loc, word_id);
    r = ''
    for u in urls:
      specs = {}
      r = try_fetch(u.get('url'), u.get('headers'))
      if r:
        specs = loc.get('create_function')(r, word_id, u.get('lang'), u.get('definition_class'), u.get('example_class'))
        if specs:
          word_specs.append(specs)
  if word_specs:
    word_specs = compose_specs(word_specs)
    [ create_my_word({'word': word_id, 'specs': w.get('specs'), 'language': w.get('language')}) for w in word_specs ]

def compose_specs(all_specs):
  specs_to_lang_map = {}
  new_specs = []

  for s in all_specs:
    language = s.get('language');
    if specs_to_lang_map.get(language):
      specs_to_lang_map[language].append(*s.get('specs'))
    else:
      specs_to_lang_map[language] = s.get('specs')
  return [ {'language': l, 'specs': specs_to_lang_map.get(l) } for l in specs_to_lang_map ]  

  for l in specs_to_lang_map:
    all_defs_for_lang = []
    uniq_defs_for_lang = []
    defs_to_exmpls_map = {}
    specs = specs_to_lang_map.get(l)
    if len(specs) == 1:
      new_specs.append({ 'language': l, 'specs': specs[0] })  
    else:
      for s in specs:
        for d in s.get('definitions'): 
          definition = d.get('definition')
          all_defs_for_lang.append(definition)
          defs_to_exmpls_map[definition] = d.get('examples')
        for d in all_defs_for_lang: 
          match = ''
          matched_d = ''
          for d_to_match in all_defs_for_lang:
            print(d_to_match)
            match = re(d, d_to_match)
            if match:
              matched_d = d_to_match;
              next
          if match:
            examples = def_to_examples_map[d];
            defs_to_examples_map[matched_d].append(examples);
            matched_d = match = ''
            next
          else:
            uniq_defs.append(d) 
      
  return new_specs

def oxford_url(api, word_id): 
   url = api.get('url')
   url += api.get('languages')[0] + '/' + word_id.lower()
   headers = { e: api.get(e) for e in ['app_id', 'app_key'] }
   return [ { 'url': url, 'headers': headers } ]


def wordref_url(api, word_id): 
   urls = []
   url = api.get('url')
   for l in api.get('languages'):
     for e in EXTENSIONS:
       lang_url = url + l + e + word_id.lower()
       extra_param =  { p + '_class': EXTENSIONS.get(e).get(p)  for p in ['definition', 'example'] }
       urls.append({ 'url': lang_url, 'lang': l, **extra_param })
   return urls

def wordref_word(r, word_id, language, def_class, exmpl_class):
  word_page = r.content
  word_soup = BeautifulSoup(word_page, features="html.parser")
  return get_wordref_word_specs(r, language, def_class, exmpl_class)  
  
