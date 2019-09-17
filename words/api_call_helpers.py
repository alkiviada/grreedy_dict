import requests
from words.soup_helpers import parse_straight_collocations, parse_reverse_collocations, parse_straight_word

def try_fetch(url, **args):
  headers = args.get('headers', {})
  params = args.get('params', {});
  headers['User-Agent'] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
  r = ''
  try:
    #print(url)
    #print(headers)
    r = requests.get(url, headers = headers, allow_redirects=False, params=params, verify=False)
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

def fetch_straight_word(word):
  base_url = "http://www.wordreference.com/fren/" + word.word
  r = try_fetch(base_url)
  if r:
    return parse_straight_word(r)

def fetch_reverse_collocations(word):
  base_url = "http://www.wordreference.com/fren/reverse/" + word.word
  r = try_fetch(base_url)
  if r:
    return parse_reverse_collocations(r)

def fetch_straight_collocations(word):
  base_url = "http://www.wordreference.com/fren/" + word.word
  r = try_fetch(base_url)
  if r:
    return parse_straight_collocations(r)

