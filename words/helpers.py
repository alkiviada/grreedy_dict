import re
import requests

delchars = ''.join(c for c in map(chr, [8594, 8658]) if not c.isalnum())

def scrape_wordref_words(words_string):
  words_string = words_string.get_text()   
  words_string = re.sub(r'(?<!^)\b(nm|nf|vi|vtr|v rif|v pron|loc |v$|agg|adj|nnoun|npl|v expr).*', 
                   '', words_string)
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
