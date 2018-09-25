def create_word(**args):
  word = args[word]
  words_map= = args[words_map]
  if not words_map:
    return ()
  w = Word.objects.create(word=word, lookup_date=timezone.now(), language='italian')
  ety = Etymology.objects.create(word=w, etymology='');

  for defs in words_map:
    definition, example = prep_def_exmpl(defs)
    if not definition:
      continue
    print(definition)
    print(example)
       
    d = Definition.objects.filter(definition=definition, word=w).first()
    if not d:
      d = Definition.objects.create(word=w, definition=definition, etymology=ety);
    if example:
      Example.objects.create(definition=d, example=example, word=w)
  return (w,)

def create_tranlations(**args):
  new_trans, orig_word, language = [ args[i] for i in ['translations', 'original', 'language'] ]
  trans = []
  for new_trans in word_trans:
    w = Word.objects.filter(word=new_trans, language=language).first()
    if not w:
      w = Word.objects.create(word=new_trans, lookup_date=timezone.now(), language=language, from_translation=True) 
    w.translations.add(orig_word)
    trans.append(w)
    
  print(trans)
  return trans

