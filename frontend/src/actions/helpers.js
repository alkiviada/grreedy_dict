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

export const reshuffleWordsOnPages = (newEl, wordsToPagesMap, allWordsMap, page, maxWords = 20) => {
  let wordsOnPage = wordsToPagesMap[page]

  wordsOnPage = [ newEl, ...wordsOnPage ]
  if (wordsOnPage.length > maxWords) {
    newEl = wordsOnPage.pop()
    wordsToPagesMap[page] = wordsOnPage
    allWordsMap = { ...allWordsMap, ...wordsOnPage.map(e => e.word).reduce((o, e) => (o[e] = page, o), {}) }
    page = page + 1
    return wordsToPagesMap[page] ? reshuffleWordsOnPages(newEl, wordsToPagesMap, allWordsMap, page) : wordsToPagesMap, allWordsMap
  }
  else {
    wordsToPagesMap[page] = wordsOnPage
    allWordsMap = { ...allWordsMap, ...wordsOnPage.map(e => e.word).reduce((o, e) => (o[e] = page, o), {}) }
  }
  return wordsToPagesMap, allWordsMap
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
