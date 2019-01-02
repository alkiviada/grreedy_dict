export const conflateWords = (words) => {
  let conflated_words = [];
  let word_map = {}
  for (let w of words) {
    const word = w.word;
    if (word_map[word]) {
      word_map[word] = [ ...word_map[word], 
                         { 'language': w.language, 'etymology': w.word_etymologies, 'is_verb': w.is_verb }
                       ]
    }
    else {
      word_map[word] = [ { 'language': w.language, 'etymology': w.word_etymologies, 'is_verb': w.is_verb } ]
        conflated_words.push(word)
    }
  }
  return conflated_words.map(w => ({'word': w, 'description': word_map[w]}))
}

export const translationsToMap = (w) => {
  const obj = w.reduce((o, e) => 
    (o[e['language']] = [...o[e['language']] ? 
      o[e['language']] : '', e.notes ? e.word + ' {' + e.notes + '}' : e.word ], o), {}
  );
  return obj
}

export const filterMap = (map, w) => {
  return Object.keys(map).filter(k => k != w)
    .map(k => Object.assign({}, {[k]: map[k]}))
    .reduce((res, o) => Object.assign(res, o), {});
}
