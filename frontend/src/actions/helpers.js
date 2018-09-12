export const conflateWords = (words) => {
  console.log('conflating')
  let conflated_words = [];
  let word_map = {}
  for (let w of words) {
    const word = w.word;
    if (word_map[word]) {
      word_map[word] = [ ...word_map[word], 
                         { 'language': w.language, 'etymology': w.word_etymologies }
                       ]
    }
    else {
      word_map[word] = [ { 'language': w.language, 'etymology': w.word_etymologies } ]
        conflated_words.push(word)
    }
  }
  return conflated_words.map(w => ({'word': w, 'description': word_map[w]}))
}

export const translationsToMap = (w) => {
  const obj = w.reduce((o, e) => 
    (o[e['language']] = [...o[e['language']] ? 
      o[e['language']] : '', e['word'] ], o), {}
  );
  return obj
}
