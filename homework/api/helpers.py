from bs4 import BeautifulSoup
import glob
import re
from ..models import Tense, Pronoun, Conjugation
from words.models import Word, Example, Collocation

def pull_conjugations_arrays(c, idx):
  conjs_arr = []
  c_soup = BeautifulSoup(c, features="html.parser")
  conjs = c_soup.findAll('table')[int(idx)].findAll('tr')
  for c in conjs:
    tds = c.findAll('td')
    if len(tds) and tds[0]:
      conjs_arr.append(tds[0].get_text())
  return conjs_arr

def pull_conjugations(verb):
  print(verb)
  tenses = Tense.objects.all()
  pronouns = Pronoun.objects.all()
  for t in tenses:
    c_arr = pull_conjugations_arrays(verb.conjugations, t.num_id)
    for p in pronouns:
      c = Conjugation.objects.filter(word=verb, tense=t, pronoun=p, verb_form=c_arr[p.num_id])
      if not len(c):
        c = Conjugation.objects.create(word=verb, tense=t, pronoun=p, verb_form=c_arr[p.num_id])

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

def process_file(filename, vf_re):
  output = ''
  matched_examples = []
  with open(filename,'r') as f:
    output = f.read()
  examples_soup = BeautifulSoup(output, features="html.parser")
  examples = examples_soup.findAll('p')
  for e in examples:
    if re.search(vf_re, e.get_text(), re.IGNORECASE):
      matched_examples.append(e.get_text())
  return matched_examples

def search_books(conjugs):
  matched_examples = []
  for filename in glob.glob('grreedy_library/**/*.*ml', recursive=True):
    print(filename)
    matched_examples.extend(process_file(filename, conjugs))
    
  return matched_examples

def search_db_examples(v):
  all_db_examples = []
  collocs = v.word_collocations.all()
  examples = v.word_examples.all()
  ow = Word.objects.filter(origin_verb=v).first()
  if not len(examples) and ow:
    examples = ow.word_examples.all()
    if not len(examples):
      print('still no examples ', ow)
  if not len(collocs) and ow:
    collocs = ow.word_collocations.all()
    if not len(collocs):
      print('still no collocs', ow)
      try:
        objects_manager = getattr(Word, ow.language + '_objects')
        print(objects_manager)
        try:
          collocs_method = getattr(objects_manager, 'fetch_collocations')
          collocs = collocs_method(ow)
        except Exception as e: 
          print(e)
          print('No method to get collocations')
      except Exception as e: 
        print(e)
        print('No method to get collocations')
  examples_pks = [ e.pk for e in examples ]
  collocs_pks = [ c.pk for c in collocs ]
  all_db_examples = [ *examples, *collocs ] 
  return { 'all_ex': all_db_examples, 'c_pks': collocs_pks, 'e_pks': examples_pks }

def more_db_examples(vf_db_re, examples_pks, collocs_pks, v):
  more_examples = []
  other_examples = Example.objects.filter(example__iregex=vf_db_re).exclude(pk__in=examples_pks); 
  other_collocs = Collocation.objects.filter(example__iregex=vf_db_re).exclude(pk__in=collocs_pks); 
  for e in [*other_examples, *other_collocs]:
    print(e.example)
    if e.word.language != v.language:
      continue
    more_examples.append(e)
  return more_examples
