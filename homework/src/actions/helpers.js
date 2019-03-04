export const TENSES = { 0: 'present', 1: 'past progressive', 2: 'simple past', 3: 'future', 4: 'preterite past', }

export const contentToMap = (w) => {
  const obj = w.reduce((o, e) => 
    (o[e['language']] = [...o[e['language']] ? 
      o[e['language']] : '', e.notes ? e.word + ' {' + e.notes + '}' : e.word ], o), {}
  );
  return obj
}
