from background_task import background
from django.utils import timezone
import spacy
import re

from homework.models import Tense, Pronoun, Conjugation, ConjugationExample
from .models import Word
from homework.api.helpers import pull_conjugations, search_db_examples, more_db_examples, search_books

@background(schedule=timezone.now())
def generate_examples(word_pk):
  word = Word.objects.get(pk=word_pk)
  if word.language != 'french':
    return 
  verb = word.origin_verb if word.origin_verb else word
  if verb.did_book_examples:
    print('i did')
    return 
  pull_conjugations(verb)
  exs = []
  nlp = spacy.load('fr')
  print('privet')
  tenses = Tense.objects.all()
  print(tenses)
  c = verb.conjugations
  for t in tenses:
    conjugs = Conjugation.objects.filter(word=verb, tense=t)
    seen_vf = {}
    for c in conjugs:
      print('I have these conjugations')
      print(c)
      vf = c.verb_form
      vf_re_sep = ''
      if seen_vf.get(vf):
        continue
      seen_vf[vf] = 1
      if re.search(r'\s+', vf):
        print(vf)
        vf_parts = vf.split(' ')
        for vf_part in vf_parts:
          if re.search(r'\(', vf_part):
            vf_part = re.sub(r'\(.+$', '', vf_part)
            vf_part = vf_part + r"\w*\W+"
          if re.search(r"\'", vf_part):
            vf_part = re.sub(r"\'", ".*", vf_part)
          vf_re_sep += r"\W" + vf_part + r"\W.*"
        vf_db_re = vf_re = vf_re_sep
        print(vf_db_re)
        print(vf_re)
          
      elif re.search(r'\(', vf):
        vf_stripped = re.sub(r'\(.+$', '', vf)
        vf_db_re = r"\W+" + vf_stripped + r"\w*\W+"
        vf_re = r"\b" + vf_stripped + r"\w*\b"
        #print(vf_db_re)
        #print(vf_re)
      elif re.search(r'\/', vf):
        vf_stripped = re.sub(r'.\/.', '', vf)
        vf_db_re = r"\W+" + vf_stripped + r"\w*\W+"
        vf_re = r"\b" + vf_stripped + r"\w*\b"
        print(vf_db_re)
        print(vf_re)
      else:
        vf_sub = ''
        if re.search(r"\'", vf):
          vf_sub = re.sub(r"\'", ".*", vf)
        vf_db_re = r"\W+?" + vf_sub if vf_sub else vf + r"\W+"
        vf_re = r"\b" + vf_sub if vf_sub else vf + r"\b"

      all_db_examples = []
      ret_map = search_db_examples(verb)
      all_db_examples = ret_map.get('all_ex')
      all_db_examples.extend(more_db_examples(vf_db_re, ret_map.get('e_pks'), ret_map.get('c_pks'), verb)) 
      
      all_db_examples.extend(search_books(vf_re))
       
      seen_ex = {}
      for e in all_db_examples:
        text = nlp(e.example if not type(e) == str else e)
        for s in text.sents:
          if not re.search(r'\b\s+\b', str(s.text)):
            continue
          if re.search(vf_re, str(s.text), re.IGNORECASE):
            ex = str(s.text)
            if ex.endswith(('.', '!', '?')):
              ex = ex.strip()
              if re.match(r"\(", ex):
                ex = ex[1:]
              if re.search(r'[.|!|?] \([A-Z]', ex):
                ex_parts = ex.split(' (')
                for e_p in ex_parts:
                  if re.search(vf_re, e_p, re.IGNORECASE):
                    ex = e_p
              if not re.match('(- |« )?[A-ZÀÇ]', ex):
                print('I will be discarding: ', ex)
                continue    
              else:
                if not seen_ex.get(ex):
                  print(verb, ' ', vf, ' ', ex)
                  seen_ex[ex] = 1
                  exs.append({ 'verb': verb, 'conjugation': c, 'example': ex, 'tense': t })
  for e in exs:
    ce = ConjugationExample.objects.filter(example=e['example'], conjugation=e['conjugation'])
    if not len(ce):
      ConjugationExample.objects.create(example=e['example'], conjugation=e['conjugation'], tense=e['tense'], word=e['verb'])
  verb.did_book_examples = 1
  verb.save()



