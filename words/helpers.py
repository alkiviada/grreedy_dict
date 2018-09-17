import re
import requests
from words.models import Word, Definition, Etymology, Example
from datetime import datetime
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist

delchars = ''.join(c for c in map(chr, [8594, 8658]) if not c.isalnum())

def scrape_wordref_words(words_string, split=1):
  if not words_string:
    return ''
  words_string = words_string.get_text()   
  words_string = re.sub(
    r'(?<!^)\b(inter$|nm|nf|viintransitiv|vtr|v(i)? (rif|refl|past|aux|pron|expr|tr|pres)|loc |agg|adj|nnoun|npl|interj|adv|avv| contraction|expr|abbr|vi +|n as|prepp|conjc|cong|idiom$|pronpron|prep +|viverbe).*', 
    '', words_string)
  if not split:
    return words_string.strip().translate(str.maketrans(dict.fromkeys(delchars)))

  words = [ w.strip().translate(str.maketrans(dict.fromkeys(delchars))) 
    for w in words_string.split(',') ]
  return words

def try_fetch(url, headers={}, params={}):
  r = ''
  try:
    print(params)
    r = requests.get(url, timeout=3, headers = headers, allow_redirects=False, params=params)
    r.raise_for_status()
  except requests.exceptions.HTTPError as errh:
    print ("Http Error:", errh)
  except requests.exceptions.ConnectionError as errc:
    print ("Error Connecting:", errc)
  except requests.exceptions.Timeout as errt:
    print ("Timeout Error:", errt)
  except requests.exceptions.RequestException as err:
    print ("OOps: Something Else", err)

  return r;


def oxford_word(r, word_id, *args):
  etymologies = []
  definitions = []
  examples = []
  oxford_word = r.json()

  word_entries = []
  for i in oxford_word["results"]:
    for j in i["lexicalEntries"]:
      for k in j["entries"]: 
        sense = {}
        if 'etymologies' in k:
          sense['etymology'] = k["etymologies"][0]
        else:
          sense['etymology'] = '' 
        sense['definitions'] = []
        if 'senses' in k:
          for v in k["senses"]: 
            if 'definitions' in v:
              for d in v["definitions"]:
                def_exmpls = {}
                def_exmpls['definition'] = d 
                if "examples" in v:
                  def_exmpls['examples'] = [ {'example': e['text']} for e in v["examples"] ]
                sense['definitions'].append(def_exmpls);
        word_entries.append(sense)
   
  return {'language': 'english', 'specs': word_entries }


def create_my_word(word_specs):
  word_id = word_specs.get('word');
  language = word_specs.get('language');
  word_entries = word_specs.get('specs');
  
  w = ''
  try:
    w = Word.objects.get(word=word_id, language=language) 
  except ObjectDoesNotExist:
    w = Word.objects.create(word=word_id, lookup_date=timezone.now(), language=language)

  for e in word_entries:
    print(e['etymology'])
    ety = Etymology.objects.create(word=w, etymology=e['etymology']);
    for d in e['definitions']:
      exmpls = []
      edef = Definition.objects.create(word=w, definition=d['definition'], etymology=ety);
      if 'examples' in d:
        exmpls = [ Example.objects.create(definition=edef, example=e['example'], word=w) for e in d['examples'] ] 

def collect_examples(fr, to):
  fr_str = ' '.join(fr)
  to_str = ' '.join(to)
  if fr_str:
    if to_str:
      return fr_str + ' (' + to_str + ')'
    else: 
      return fr_str
  elif to_str:
     return to_str  
  else:
     return ''
