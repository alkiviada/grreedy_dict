def prep_def_exmpl(defs):
  #print(defs)
  if not defs['trans']:
    return ('', '') 
  definition = example = fr_word = ''
  fr_word = defs.get('fr_word')
  definition = ', '.join(defs['trans'])
  expl = ''.join(defs['expl'])
  if fr_word:
    definition = fr_word + ' [' + definition + ']' 
  if expl:
     definition += ' ' + expl if expl.startswith('(') else ' [' + expl + ']'

  to_exmpl = defs.get('to_ex')
  fr_exmpl = defs.get('fr_ex')

  if fr_exmpl:
     example = ', '.join(fr_exmpl)
  if to_exmpl:
     example += ' (' + ' '.join(to_exmpl) + ')' if example else ' '.join(to_exmpl)
  return (definition, example)
