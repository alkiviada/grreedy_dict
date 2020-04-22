import { 
  FETCH_COLLECTION_FULFILLED, 
  SAVE_COLLECTION_FULFILLED, 
  CLEAR_NEW_WORD_ERROR, FETCH_WORDS, 
  CLEAR_FETCHED, 
  CLEAR_FETCHING, 
  FETCH_WORDS_FULFILLED, 
  FETCH_WORDS_REJECTED, 
  FETCH_WORD, 
  FETCH_WORD_FULFILLED,
  MAP_REF,
  SWITCH_VISIBILITY
} from './types';
import { history } from '../components/WordsRoot'

import { conflateWords, conflateBareWords, filterMap, reshuffleWordsOnPages, shiftWordsOnPages } from './helpers';
import { maxWordsOnPages } from './constants';

export const requestWords = () => dispatch => {
  dispatch({
    type: FETCH_WORDS,
  })
};

export const clearNewWordError = () => dispatch => {
  dispatch({
    type: CLEAR_NEW_WORD_ERROR,
  })
};

export const clearFetched = () => dispatch => {
  dispatch({
    type: CLEAR_FETCHED,
  })
};

export const clearFetching = () => dispatch => {
  dispatch({
    type: CLEAR_FETCHING,
  })
};

export const requestWord = (word) => dispatch => {
  dispatch({
    type: FETCH_WORD,
    payload: word,
  })
};

export const fetchWords = (uuid, page) => { return (dispatch, getState) => {
  let { pagePrev, pageNext, allWordCount, allWordsMap, words } = getState().words;

  let { lastModifiedMap, name, collWords } = getState().collections;

  let time = lastModifiedMap[uuid] ? lastModifiedMap[uuid]['time'] : ''

  if (!uuid) {
  console.log('fetch WOTRDS')
  console.log(uuid)
    return dispatch({
      type: FETCH_WORDS_FULFILLED,
      payload: { 'words': [], page, 'allWordsMap': {} } 
    });
  }
  else if (!lastModifiedMap[uuid] && words.length && !page) {

// we have a collection but we never saved it 
// - let's load it from the storage of words' reducer  

    dispatch({
      type: FETCH_COLLECTION_FULFILLED,
      payload: { uuid, name, collWords }
    });
    return dispatch({
      type: FETCH_WORDS_FULFILLED,
      payload: { 'words': words, 
                 'allWordsMap': { ...words.map(e => e.word).reduce((o, e) => (o[e] = page, o), {}) },
                 page, pagePrev, pageNext, 
                 allWordCount 
               }
    });
  }
  else {
    page = page || 1
    time = (lastModifiedMap[uuid] && lastModifiedMap[uuid]['words'][page]) ? time : ''
    const url = '/api/words/' + (uuid ? uuid + `/${page}/` + time : '')
    return fetch(url)
      .then(response =>
      response.json().then(json => ({
        status: response.status,
        json
      })
    ))
    .then(
      // Both fetching and parsing succeeded!
      ({ status, json }) => {
        if (status >= 400) {
          // Status looks bad
          console.log('Server returned error status');
          dispatch({type: FETCH_WORDS_REJECTED, payload: {error: 'fetching words failed'}})
        } else {
          collWords = []
          if (json.words) {
            name = json.name;
            uuid = json.uuid
            collWords = conflateBareWords(json.words)
            console.log('this are my words')
            console.log(collWords)
            pagePrev = json.page_prev
            pageNext = json.page_next
            allWordCount = json.all_word_count

           let time = Date.now();
           time = Math.floor(time/1000);
           lastModifiedMap[uuid] = lastModifiedMap[uuid] ? lastModifiedMap[uuid] : {'words': {}, 'time': 0, 'name': ''}
           if (lastModifiedMap[uuid]['words'][page]) {
// this collection has changed meanwhile, 
// because i have now recieved a fresh page 
// instead of a permission to use cache  
// and as i do have some stale cache of it,
// let's nuke it 
             lastModifiedMap[uuid]['words'] = { page: [] }
             allWordsMap = { ...collWords.reduce((o, e) => (o[e] = page, o), {}) }
           }
           else {
// this is just a new page of a collection that did not change meanwhile:
             allWordsMap = { ...allWordsMap, ...collWords.reduce((o, e) => (o[e] = page, o), {}) }
           }
           lastModifiedMap[uuid]['words'][page] = collWords
           lastModifiedMap[uuid]['name'] = name 
           lastModifiedMap[uuid]['time'] = time 
           lastModifiedMap[uuid]['allWordCount'] = allWordCount

          }
          else {
            console.log('i fetched from local')
            collWords = lastModifiedMap[uuid]['words'][page]
            name = lastModifiedMap[uuid]['name']
            allWordCount = lastModifiedMap[uuid]['allWordCount']
            pagePrev = page > 1 ? page - 1 : 0
            pageNext = (page*maxWordsOnPages) < allWordCount ? page + 1 : 0
          }
          console.log(collWords)
          console.log('i am dispatchingt FETCH WORDS FUL ow ords')
          dispatch({
            type: FETCH_WORDS_FULFILLED,
            payload: { words, 
                       pageNext, pagePrev, 
                       allWordsMap,
                       allWordCount, page 
                     }
          });
          console.log('i will SAVE FULFILL dispatch to coll state')
          dispatch({
            type: SAVE_COLLECTION_FULFILLED,
            payload: { uuid, name, lastModifiedMap }
           });
           history.push(`/${page}`);
           return dispatch({
            type: FETCH_COLLECTION_FULFILLED,
            payload: { uuid, name, collWords }
          });
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_WORDS_REJECTED, payload: {error: 'fetching words failed'}})
      }
    ); 
  }
};
};

export const deleteWord = (word) => { return (dispatch, getState) => {
  const { uuid, name, collWords, items } = getState().collections
  let { lastModifiedMap } = getState().collections
  let { page, allWordsMap, pagePrev, pageNext, allWordCount } = getState().words
  const oldWords = getState().words.words
  const { refMap } = getState().refs

  let time = lastModifiedMap[uuid] && lastModifiedMap[uuid]['words'][pageNext] ? lastModifiedMap[uuid]['time'] : ''

  const url = 'api/word/delete/' + word + '/' + (uuid ? uuid + `/${page}/` + time : '')
  return fetch(url)
  .then(response =>
      response.json().then(json => ({
        status: response.status,
        json
      })
    ))
  .then(
      // Both fetching and parsing succeeded!
      ({ status, json }) => {
        if (status >= 400) {
          // Status looks bad
          console.log('Server returned error status');
          dispatch({ type: FETCH_WORDS_REJECTED, 
                     payload: {error: 'fetching words failed', word: word}})
        } else {
          // Status looks good
         console.log(json)
         console.log('after delete')
         let words;
         if (json.empty) {
           words = []
           allWordsMap = {}
         }
         else if (json.words) {
console.log('i was sent words')
// the collection changed - let's  nuke its cache
           pagePrev = json.page_prev
           pageNext = json.page_next
           allWordCount = json.all_word_count
           page = json.page ? json.page : page
           words = json.words.map(w => w.word)
           lastModifiedMap[uuid]['words'] = { [page]: words }
           allWordsMap = { ...words.map(e => e.word).reduce((o, e) => (o[e] = page, o), {}) }
         }
         else {
// let's deal with local changes
// filter the deleted word from the words' array
// rearrange the allWordsMap and lastModified's page cache if words' array was from not the last page

           words = lastModifiedMap[uuid]['words'][page].filter(w => w != word)
           lastModifiedMap[uuid]['words'] = { ...lastModifiedMap[uuid]['words'], [page]: words }
           allWordsMap = filterMap(allWordsMap, word)
           if (lastModifiedMap[uuid]['words'][pageNext]) {
             let wordsOnPage = lastModifiedMap[uuid]['words'][pageNext]
             const shifted = wordsOnPage.shift()
             allWordsMap = filterMap(allWordsMap, shifted)
             let cachedWords
             cachedWords, allWordsMap = shiftWordsOnPages(shifted, lastModifiedMap[uuid]['words'], allWordsMap, pageNext)
           }
           allWordCount = lastModifiedMap[uuid]['allWordCount'] - 1
           pagePrev = page > 1 ? page - 1 : 0
           pageNext = (page*maxWordsOnPages) < allWordCount ? page + 1 : 0
         }
         dispatch({
            type: FETCH_WORDS_FULFILLED,
            payload: { words: oldWords.filter(w => w.word != word), 
                       allWordsMap,
                       pagePrev, pageNext, allWordCount, page }
          });

        let time = Date.now();
        time = Math.floor(time/1000);
        const collections = json.empty ? items.filter(e => e.name != name) : items
        if (json.empty)
          delete lastModifiedMap[uuid]
        else {
          lastModifiedMap = { ...lastModifiedMap, [uuid]: { time, 'words': lastModifiedMap[uuid]['words'], name, allWordCount } } 
        }
        dispatch({
          type: SAVE_COLLECTION_FULFILLED,
          payload: { items: collections,
                     lastModifiedMap,
                     uuid: json.empty ? false: uuid, 
                     name: json.empty ? false : name, 
                     collWords: words,
                   }
        })
          return dispatch({
            type: FETCH_COLLECTION_FULFILLED,
            payload: { uuid: json.empty ? false: uuid, 
                       name: json.empty ? false : name, 
                       collWords: words }
          });
      }
    },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_WORDS_REJECTED, payload: {error: 'fetching words failed', word: word}})
      }
    ); 
};
};

export const fetchWord = (word, direction) => { return (dispatch, getState) => {
  direction = direction ? direction : 'next'
  const { uuid, items } = getState().collections
  let { words } = getState().words
  console.log('will fetch')

  let { lastModifiedMap } = getState().collections
  let { allWordsMap } = getState().words
  const { refMap } = getState().refs

  let headers = {"Content-Type": "application/json"};
  const {token} = getState().auth;
  if (token) {
      headers["Authorization"] = `Token ${token}`;
  }

  const url = '/api/word/' + word.toLowerCase() + '/' + (uuid ? uuid : '')
  return fetch(url, {headers})
  .then(response =>
      response.json().then(json => ({
        status: response.status,
        json
      })
    ))
  .then(
      // Both fetching and parsing succeeded!
      ({ status, json }) => {
        if (status >= 400) {
          // Status looks bad
          console.log('Server returned error status');
          dispatch({type: FETCH_WORDS_REJECTED, payload: {error: 'fetching words failed', word: word}})
        } else {
          // Status looks good
          const { word, name, uuid, page } = json
          console.log(json)
          console.log('i recieved word')

          let wordsOnPage = lastModifiedMap[uuid] && lastModifiedMap[uuid]['words'] ? 
                            lastModifiedMap[uuid]['words'][page] : 
                            getState().collections.collWords

          let pageNext = json.page_next
          let pagePrev = json.page_prev ? json.page_prev : 0
          let allWordCount = json.all_word_count


          if (json.words) {
            wordsOnPage = conflateBareWords(json.words)
            allWordsMap = { ...allWordsMap, ...words.map(e => e.word).reduce((o, e) => (o[e] = page, o), {}) }
          }
          else {
          console.log('i amd reducing etc');
          const obj = word.reduce((o, e) =>
                                  (o['word'] = e['word'], 
                                    o['description'] = [ ...o['description'] ? o['description'] : '', 
                                    { 'language' : e['language'], 
                                      'is_verb' : e['is_verb'], 
                                      'has_corpora' : e['has_corpora'], 
                                      'etymology': e['word_etymologies'] } ], o), {}
                                 );
          console.log(wordsOnPage)
          wordsOnPage = wordsOnPage.findIndex(w => w == obj.word) == -1 ? (direction == 'next' ? [ obj.word, ...wordsOnPage ] : [ ...wordsOnPage, obj.word ]) : wordsOnPage
          if (wordsOnPage.length >= maxWordsOnPages) {
            const popped = wordsOnPage.pop();
            pageNext = 2;            
            allWordsMap = filterMap(allWordsMap, popped.word)
            if (lastModifiedMap[uuid]['words'][pageNext]) {
              lastModifiedMap, allWordsMap = reshuffleWordsOnPages(popped, lastModifiedMap[uuid]['words'], allWordsMap, pageNext, allWordCount)
            }
          }
          words = direction == 'next' ? [ obj, ...words ] : [ ...words, obj ]
          console.log(words);
          allWordsMap = { ...allWordsMap, ...{ [obj.word]: page } }
         }
          console.log(words)
          dispatch({
            type: FETCH_WORD_FULFILLED,
            payload: { words, 
                       allWordsMap,
                       pageNext, page, pagePrev, 
                       allWordCount 
                     }
          });
          dispatch({
            type: MAP_REF,
            payload: { }
          });


          let time = Date.now();
          time = Math.floor(time/1000);
          console.log(words)
          console.log(uuid)
          console.log(wordsOnPage)
          console.log('dispatching to collection')
          const onPage = { ...lastModifiedMap[uuid] ? lastModifiedMap[uuid]['words'] : {}, ...{ [page]: wordsOnPage }};
          console.log(onPage) 
          dispatch({
            type: SAVE_COLLECTION_FULFILLED,
            payload: { collWords: wordsOnPage, 
                       uuid, 
                       name, 
                       lastModifiedMap: { ...lastModifiedMap, 
                                          [uuid]: { time, name, allWordCount,
                                                    'words': { ...lastModifiedMap[uuid] ? lastModifiedMap[uuid]['words'] : {}, 
                                                               ...{ [page]: wordsOnPage } }, 
                                                  }
                       } 
            }
          });
          return dispatch({
            type: FETCH_COLLECTION_FULFILLED,
            payload: { uuid, name, collWords: wordsOnPage }
          });
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_WORDS_REJECTED, payload: {error: 'fetching word failed', word: word}})
      }
    ); 
};
};

export const lookUpWord = (word, uuid) => { 
  return (dispatch, getState) => {
    const { items, page } = getState().words;
    const { lastModifiedMap, name } = getState().collections;

    let time = lastModifiedMap[uuid] ? lastModifiedMap[uuid]['time'] : ''

    if (!uuid) {
// we have nothing - let's start a collection 
      return dispatch(fetchWord(word))
    }
    else if (!lastModifiedMap[uuid]) {

// we have a collection but we never saved it 
// - let's load it from the storage of words' reducer  

      dispatch({
        type: FETCH_COLLECTION_FULFILLED,
        payload: { uuid, name }
      });
      dispatch({
        type: FETCH_WORDS_FULFILLED,
        payload: { 'words': items, page, 'allWordsMap': {} } 
      });
      return dispatch(fetchWord(word))
  }
  else {
    return dispatch(fetchWords(uuid)).then(() => {
      return dispatch(fetchWord(word))
    })
  }
  }
};
export const nextWord = (word) =>  { return (dispatch, getState) => {
  console.log('word')
  const wIdx = getState().words.words.findIndex(w => w.word == word);
  console.log(wIdx)
  const nw = getState().words.words[wIdx-1]
  return dispatch({
    payload: nw.word,
    type: FETCH_WORD,
  })
};
};

export const prevWord = (word) => {
  return (dispatch, getState) => {
  console.log('prev word')
  console.log(word)
  console.log(getState().words)
  console.log(getState().collections)
  let wIdx = getState().words.words.findIndex(w => w.word == word);
  console.log('my idx ', wIdx)
  let pw = getState().words.words[wIdx+1]
  if (pw) {
  console.log(pw)
  history.push(`/word/${pw.word}`);
  return dispatch({
    type: FETCH_WORD,
    payload: pw.word
  })
  }
  const collWords = getState().collections.collWords
  console.log(collWords)
  wIdx = collWords.findIndex(w => w == word);
  const collPrevWord = collWords[wIdx+1]
  console.log(collPrevWord)
};
};

