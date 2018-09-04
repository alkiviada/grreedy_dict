import json
from datetime import datetime
from django.utils import timezone
from bs4 import BeautifulSoup
import os
from words.models import Word, Definition, Etymology, Example
from words.helpers import scrape_wordref_words, try_fetch, oxford_word
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
    definition = examples = ''
    
    word_table = word_soup.find('table', {'class': 'WRD'});
    print ("NEW TABLE");
    if word_table:
      for tr_wd in word_table.findAll("tr", {"class": "even"}):
        new_def = scrape_wordref_words(tr_wd.find('td', {'class': def_class}), 0)
        if new_def:
          definition = new_def
        fr_exmpl = scrape_wordref_words(tr_wd.find('td', {'class': exmpl_class[0]}), 0)
        if fr_exmpl:
          examples = fr_exmpl
        to_exmpls = tr_wd.findAll('td', {'class': exmpl_class[1]})
        if to_exmpls:
          to_exmpls = [ s.get_text() for s in tr_wd.findAll('td', {'class': exmpl_class[1]}) ]
          examples += ' (' + ' '.join(to_exmpls) + ')'
        print(definition)
        print(examples)
        print(to_exmpls)
        if definition and examples and len(to_exmpls):
          defs_exmpls_map[definition] = examples
          definition = ''
          examples = '' 
    print(defs_exmpls_map)
    return defs_exmpls_map

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
                     'compose_specs': compose_wordref_specs,
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
        word_specs = loc.get('compose_specs')(specs, word_specs) if loc.get('compose_specs') else specs
        print(word_specs)
    if r:
      break
  if len(word_specs):
    create_my_word({ 'word': word_id, 'specs': word_specs}) 

def compose_wordref_specs(specs, all_specs):
  print('SPECS')
  print(specs)
  if not specs:
    return all_specs
  print(all_specs)

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
  specs = get_wordref_word_specs(r, language, def_class, exmpl_class)  
  


def create_my_word(word_specs):
  word_id = word_specs.get('word');
  word_entries = word_specs.get('specs');
  
  w = Word.objects.create(word=word_id, lookup_date=timezone.now(), language='english')
  for e in word_entries:
    ety = Etymology.objects.create(word=w, etymology=e['etymology']);
    for d in e['definitions']:
      exmpls = []
      edef = Definition.objects.create(word=w, definition=d['definition'], etymology=ety);
      if 'examples' in d:
        exmpls = [ Example.objects.create(definition=edef, example=e['example'], word=w) for e in d['examples'] ] 

