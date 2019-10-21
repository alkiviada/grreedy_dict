import { maxWordsOnPages } from './constants';

export const conflateWords = (words) => {
  let conflated_words = [];
  let word_map = {}
  for (let w of words) {
    const word = w.word;
    if (word_map[word]) {
      word_map[word] = [ ...word_map[word], 
                         { 'language': w.language, 'etymology': w.word_etymologies, 'is_verb': w.is_verb, 'has_corpora': w.has_corpora }
                       ]
    }
    else {
      word_map[word] = [ { 'language': w.language, 'etymology': w.word_etymologies, 'is_verb': w.is_verb, 'has_corpora': w.has_corpora } ]
        conflated_words.push(word)
    }
  }
  return conflated_words.map(w => ({'word': w, 'description': word_map[w]}))
}

export const reshuffleWordsOnPages = (newEl, wordsToPagesMap, allWordsMap, page, allWordCount, maxWords = maxWordsOnPages) => {
  let wordsOnPage = wordsToPagesMap[page] ? wordsToPagesMap[page] : []
  if (allWordCount > (page-1)*maxWords) {
    allWordsMap = filterMap(allWordsMap, newEl.word)
    return wordsToPagesMap, allWordsMap
  }
  wordsOnPage = [ newEl, ...wordsOnPage ]

  allWordsMap = { ...allWordsMap, ...{ [newEl.word]: page } }

  console.log(allWordsMap)

  if (wordsOnPage.length > maxWords) {
    newEl = wordsOnPage.pop()
    wordsToPagesMap[page] = wordsOnPage
    page = page + 1
    return reshuffleWordsOnPages(newEl, wordsToPagesMap, allWordsMap, page)
  }
  else {
    wordsToPagesMap[page] = wordsOnPage
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

export const shiftWordsOnPages = (newEl, wordsToPagesMap, allWordsMap, page, maxWords = maxWordsOnPages) => {
  let wordsOnPage = wordsToPagesMap[page-1]
  console.log(wordsOnPage)

  wordsOnPage = [ ...wordsOnPage, newEl ]
  wordsToPagesMap[page-1] = wordsOnPage
  allWordsMap = { ...allWordsMap, ...{ [newEl.word]: page-1 } }
  page = page + 1
  if (wordsToPagesMap[page]) {
    newEl = wordsToPagesMap[page].shift()
    return shiftWordsOnPages(newEl, wordsToPagesMap, allWordsMap, page)
  }
  return wordsToPagesMap, allWordsMap
}
