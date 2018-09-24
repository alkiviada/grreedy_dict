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
