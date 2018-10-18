import re
from bs4 import BeautifulSoup

delchars = ''.join(c for c in map(chr, [8594, 8658]) if not c.isalnum())

def scrape_wordref_words(words_string, split=1):
  if not words_string:
    return ''
  words_string = words_string.get_text()   
  if re.match('Note', words_string):
    return words_string
    
  words_string = re.sub(
    r'(?<!^)\b(ab(b)?r|inter$|n(m|f|noun|pl)'
     '|suffix|viintransitiv|v(i|tr)?$|v(i)?( +|rif|refl|past|aux|pron|expr|tr|pres)|Note|'
     'loc |agg|adj|interj|adv|avv$| contraction|expr|n as|prepp|conjc|cong|idiom$|pronpron|prep +|viverbe).*', 
    '', words_string)
  if not split:
    return words_string.strip().translate(str.maketrans(dict.fromkeys(delchars)))

  words = [ w.strip().translate(str.maketrans(dict.fromkeys(delchars))) 
    for w in words_string.split(',') ]
  return words

def parse_reverse_collocations(r):
  word_page = r.content
  word_soup = BeautifulSoup(word_page, features="html.parser")
  collocs_tables = word_soup.findAll('table', attrs={'class': 'WRD', 'id': 'compound_forms'});
  expr_map = {}
  if collocs_tables:
    for collocs_table in collocs_tables:
      expr = ''
      for tr_c in collocs_table.findAll("tr", {"class": ["even", "odd"]}):
        new_expr = scrape_wordref_words(tr_c.find('td', {'class': 'FrWrd'}), 0)
        if new_expr:
          expr = new_expr
          expr_map[expr] = {'expl' : '', 'trans': [], 'to_exmpl': [], 'fr_exmpl': []}
        new_expl = scrape_wordref_words(tr_c.find('td', class_=lambda x: x not in ['ToWrd', 'FrEx', 'FrWrd']), 0)
        if new_expl:
          expr_map[expr]['expl'] = new_expl
        new_trans = scrape_wordref_words(tr_c.find('td', {'class': 'ToWrd'}), 0)
        if new_trans:
          expr_map[expr]['trans'].append(new_trans)
        new_fr_exmpl = scrape_wordref_words(tr_c.find('td', {'class': 'FrEx'}), 0)
        new_to_exmpl = scrape_wordref_words(tr_c.find('td', {'class': 'ToEx'}), 0)
        if new_fr_exmpl:
          expr_map[expr]['fr_exmpl'].append(new_fr_exmpl)
        if new_to_exmpl:
          expr_map[expr]['to_exmpl'].append(new_to_exmpl)
  return expr_map

def parse_straight_collocations(r):
  word_page = r.content
  word_soup = BeautifulSoup(word_page, features="html.parser")
  collocs_tables = word_soup.findAll('table', {'class': 'WRD', 'id': 'compound_forms'});
  expr_map = {}
  if collocs_tables:
    for collocs_table in collocs_tables:
      expr = ''
      for tr_c in collocs_table.findAll("tr", {"class": ["even", "odd"]}):
        new_expr = scrape_wordref_words(tr_c.find('td', {'class': 'FrWrd'}), 0)
        if new_expr:
          expr = new_expr
          expr_map[expr] = {'expl' : '', 'trans': [], 'exmpl': ''}
        new_expl = scrape_wordref_words(tr_c.find('td', class_=lambda x: x not in ['ToWrd', 'FrEx', 'FrWrd']), 0)
        if new_expl:
          expr_map[expr]['expl'] = new_expl
        new_trans = scrape_wordref_words(tr_c.find('td', {'class': 'ToWrd'}), 0)
        if new_trans:
          expr_map[expr]['trans'].append(new_trans)
        new_exmpl = scrape_wordref_words(tr_c.find('td', {'class': 'FrEx'}), 0)
        if new_exmpl:
          expr_map[expr]['exmpl'] = new_exmpl
  return expr_map

def parse_reverse_word(r):
  word_page = r.content
  word_soup = BeautifulSoup(word_page, features="html.parser")
  words_tables = word_soup.findAll('table', {'class': 'WRD'}, id=lambda x: x != 'compound_forms');
  if not words_tables:
    return []
  words_map = []
  for wd_table in words_tables:
    fr_word = ''
    word_trans = { 'trans': [], 'to_ex': [], 'fr_ex': [], 'expl': [] , 'fr_word': ''}
    trans = []
    for tr_wd in wd_table.findAll("tr", {"class": ["even", "odd"]}):
      new_word = scrape_wordref_words(tr_wd.find('td', {'class': 'FrWrd'}), 0)
      if new_word:
        fr_word = new_word
        words_map.append(word_trans)
        word_trans = { 'trans': [], 'to_ex': [], 'fr_ex': [], 'expl': [] , 'fr_word': fr_word }
      new_expl = scrape_wordref_words(tr_wd.find('td', class_=lambda x: x not in ['ToWrd', 'FrEx', 'FrWrd']), 0)
      if new_expl:
        word_trans['expl'].append(new_expl)
      new_trans = scrape_wordref_words(tr_wd.find('td', {'class': 'ToWrd'}), 0)
      if new_trans:
        word_trans['trans'].append(new_trans)
      new_fr_exmpl = scrape_wordref_words(tr_wd.find('td', {'class': 'FrEx'}), 0)
      new_to_exmpl = scrape_wordref_words(tr_wd.find('td', {'class': 'ToEx'}), 0)
      if new_fr_exmpl:
        word_trans['fr_ex'].append(new_fr_exmpl)
      if new_to_exmpl:
        word_trans['to_ex'].append(new_to_exmpl)
    words_map.append(word_trans)
  return words_map 

def parse_straight_word(r):
  word_page = r.content
  word_soup = BeautifulSoup(word_page, features="html.parser")
  words_tables = word_soup.findAll('table', {'class': 'WRD'}, id=lambda x: x != 'compound_forms');
  if not words_tables:
    return []
  words_map = []
  for wd_table in words_tables:
    fr_word = ''
    word_trans = { 'trans': [], 'to_ex': [], 'fr_ex': [], 'expl': [] }
    trans = []
    for tr_wd in wd_table.findAll("tr", {"class": ["even", "odd"]}):
      new_word = scrape_wordref_words(tr_wd.find('td', {'class': 'FrWrd'}), 0)
      if new_word:
        fr_word = new_word
        words_map.append(word_trans)
        word_trans = { 'trans': [], 'to_ex': [], 'fr_ex': [], 'expl': [] }
      new_expl = scrape_wordref_words(tr_wd.find('td', class_=lambda x: x not in ['ToWrd', 'FrEx', 'FrWrd']), 0)
      if new_expl:
        word_trans['expl'].append(new_expl)
      new_trans = scrape_wordref_words(tr_wd.find('td', {'class': 'ToWrd'}), 0)
      if new_trans:
        word_trans['trans'].append(new_trans)
      new_fr_exmpl = scrape_wordref_words(tr_wd.find('td', {'class': 'FrEx'}), 0)
      new_to_exmpl = scrape_wordref_words(tr_wd.find('td', {'class': 'ToEx'}), 0)
      if new_fr_exmpl:
        word_trans['fr_ex'].append(new_fr_exmpl)
      if new_to_exmpl:
        word_trans['to_ex'].append(new_to_exmpl)
    words_map.append(word_trans)
  return words_map 

def parse_straight_translations(r):
  word_page = r.content
  word_soup = BeautifulSoup(word_page, features="html.parser")
  words_tables = word_soup.findAll('table', {'class': 'WRD'}, id=lambda x: x != 'compound_forms');
  if not words_tables:
    return []
  word_trans = []
  for wd_table in words_tables:
    for tr_wd in wd_table.findAll("tr", {"class": ["even", "odd"]}):
      new_trans = scrape_wordref_words(tr_wd.find('td', {'class': 'ToWrd'}), 0)
      if new_trans:
        word_trans.extend(new_trans.split(' ,'))
  return word_trans

def parse_synonyms(r):
  word_page = r.content
  word_soup = BeautifulSoup(word_page, features="html.parser")
  synonyms_list = word_soup.find('div', {'class': 'FTlist'});
  if not synonyms_list:
   return []
  word_synonyms = []
  for syn in synonyms_list.findAll('a'):
    word_synonyms.append(scrape_wordref_words(syn, 0))
  return word_synonyms
  
def parse_reverse_translations(r):
  word_page = r.content
  word_soup = BeautifulSoup(word_page, features="html.parser")
  words_tables = word_soup.findAll('table', {'class': 'WRD'}, id=lambda x: x != 'compound_forms');
  
  word_trans = []
  if not words_tables:
   return []
  for wd_table in words_tables:
    for tr_wd in wd_table.findAll("tr", {"class": ["even", "odd"]}):
      new_trans = scrape_wordref_words(tr_wd.find('td', {'class': 'FrWrd'}), 0)
      if new_trans:
        word_trans.extend(new_trans.split(' ,'))
  return word_trans

