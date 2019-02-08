from bs4 import BeautifulSoup
import glob
import re

def pull_conjugations_arrays(c, idx):
  conjs_arr = []
  c_soup = BeautifulSoup(c, features="html.parser")
  conjs = c_soup.findAll('table')[int(idx)].findAll('tr')
  for c in conjs:
    tds = c.findAll('td')
    if len(tds) and tds[0]:
      conjs_arr.append(tds[0].get_text())
  return conjs_arr

def process_parts(examples, verb_forms):
  new_example = ''
  correct = ''
  seen = {}
  matched_examples = []
  string_parts = re.split(r"(\.|!|\?)", examples)
  for ep in string_parts:
    if not re.search(r'\b\s+\b', ep):
      continue
    for vf in verb_forms:
      vf_re = r"\b" + vf + r"\b" 
      vf_re_cap = r"\b" + vf.capitalize() + r"\b" 
      if re.search(vf_re, ep, re.IGNORECASE):
        ep = re.sub(vf_re, "...", ep)
        ep = re.sub(vf_re_cap, "...", ep)
        ep = ep.strip()
        if re.match(r"\(", ep):
          ep = ep[1:]
        new_example = ep + "."
        correct = vf
    if new_example and not seen.get(new_example):
      e = { 'stub': new_example, 'correct': correct }
      matched_examples.append({'example': e})
      seen[new_example] = 1;
  return matched_examples

def process_examples_by_tense(examples, verb_forms):
  matched_examples = []
  seen = {}
  for e in examples:
    if e.get('example'):
      new_example = ''
      correct = ''
      string_parts = re.split(r"(\.|!|\?)", e['example'])
      for ep in string_parts:
        if not re.search(r'\b\s+\b', ep):
          continue
        for vf in verb_forms:
          vf_re = r"\b" + vf + r"\b" 
          vf_re_cap = r"\b" + vf.capitalize() + r"\b" 
          vf_re_sep = ''
          if re.search(r'\s+', vf):
            print(vf)
            vf_parts = vf.split(' ')
            for vf_part in vf_parts:
              vf_re_sep += r"\b" + vf_part + r"\b[\+s?\w+?]+?\s+"
          if vf_re_sep and re.search(vf_re_sep, ep, re.IGNORECASE):
            print(ep)
          if re.search(vf_re, ep, re.IGNORECASE):
            ep = re.sub(vf_re, "...", ep)
            ep = re.sub(vf_re_cap, "...", ep)
            ep = ep.strip()
            if re.match(r"\(", ep):
              ep = ep[1:]
            new_example = ep + "."
            correct = vf
    if new_example and not seen.get(new_example):
      e['example'] = { 'stub': new_example, 'correct': correct }
      matched_examples.append(e)
      seen[new_example] = 1;
  return matched_examples

def process_file(filename, conjugs):
  output = ''
  matched_examples = []
  with open(filename,'r') as f:
    output = f.read()
  examples_soup = BeautifulSoup(output, features="html.parser")
  examples = examples_soup.findAll('p')
  for e in examples:
    matched_e = process_parts(e.get_text(), conjugs)
    if matched_e:
      matched_examples.extend(matched_e)
  return matched_examples

def search_books(conjugs):
  matched_examples = []
  for filename in glob.glob('grreedy_library/**/*.*ml', recursive=True):
    print(filename)
    matched_examples.extend(process_file(filename, conjugs))
    
  return matched_examples
