import re
import requests

delchars = ''.join(c for c in map(chr, [8594, 8658]) if not c.isalnum())

def scrape_wordref_words(words_string, split=1):
  if not words_string:
    return ''
  words_string = words_string.get_text()   
  words_string = re.sub(r'(?<!^)\b(nm|nf|vi|vtr|v rif|v pron|loc |v$|agg|adj|nnoun|npl|v expr|interj|adv|avv|inter).*', 
                   '', words_string)
  if not split:
    return words_string.strip().translate(str.maketrans(dict.fromkeys(delchars)))

  words = [ w.strip().translate(str.maketrans(dict.fromkeys(delchars))) 
    for w in words_string.split(',') ]
  return words


def try_fetch(url, headers={}):
  r = ''
  try:
    r = requests.get(url,timeout=3, headers = headers)
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
