export const tenses = ['present', 'past progressive', 'simple past', 'future', 'preterite past', ]

export const contentToMap = (w) => {
  const obj = w.reduce((o, e) => 
    (o[e['language']] = [...o[e['language']] ? 
      o[e['language']] : '', e.notes ? e.word + ' {' + e.notes + '}' : e.word ], o), {}
  );
  return obj
}
