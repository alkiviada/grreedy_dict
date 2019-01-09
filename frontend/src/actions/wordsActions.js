import { 
  FETCH_COLLECTION_FULFILLED, 
  SAVE_COLLECTION_FULFILLED, 
  CLEAR_NEW_WORD_ERROR, FETCH_WORDS, 
  FETCH_WORDS_FULFILLED, 
  FETCH_WORDS_REJECTED, 
  FETCH_WORD, 
  FETCH_WORD_FULFILLED,
  MAP_REF,
  SWITCH_VISIBILITY
} from './types';

import { conflateWords, filterMap, reshuffleWordsOnPages } from './helpers';

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

export const requestWord = (word) => dispatch => {
  dispatch({
    type: FETCH_WORD,
    payload: word,
  })
};

export const fetchWords = (uuid, page) => { return (dispatch, getState) => {
  const { items, pagePrev, pageNext, allWordCount } = getState().words;

  let { lastModifiedMap, name } = getState().collections;
  let time = lastModifiedMap[uuid] ? lastModifiedMap[uuid]['time'] : ''

  if (!uuid) {
    return dispatch({
      type: FETCH_WORDS_FULFILLED,
      payload: { 'words': [], page } 
    });
  }
  else if (!lastModifiedMap[uuid] && items.length && !page) {

// we have a collection but we never saved it 
// - let's load it from the storage of words' reducer  

    dispatch({
      type: FETCH_COLLECTION_FULFILLED,
      payload: { uuid: uuid, name: name }
    });
    return dispatch({
      type: FETCH_WORDS_FULFILLED,
      payload: { 'words': items, page, pagePrev, pageNext, allWordCount }
    });
  }
  else {
    page = page || 1
    const url = 'api/words/' + (uuid ? uuid + `/${page}/` + time : '')
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
          console.log('i have some fresh json')
          let words = []
          let name = ''
          let pagePrev = 0
          let pageNext = 0
          let allWordCount = 0
          if (json.words) {
            name = json.name;
            uuid = json.uuid
            words = conflateWords(json.words)
            pagePrev = json.page_prev
            pageNext = json.page_next
            allWordCount = json.all_word_count
          }
          else {
            words = lastModifiedMap[uuid]['words'][page]
            name = lastModifiedMap[uuid]['name']
          }
          dispatch({
            type: FETCH_COLLECTION_FULFILLED,
            payload: { uuid: uuid, name: name }
          });
          dispatch({
            type: FETCH_WORDS_FULFILLED,
            payload: { words, pageNext, pagePrev, allWordCount, page }
          });
        let time = Date.now();
        time = Math.floor(time/1000);
        lastModifiedMap[uuid] = {'words': {}, 'time': 0, 'name': ''}
        lastModifiedMap[uuid]['words'][page] = words
        lastModifiedMap[uuid]['name'] = name 
        lastModifiedMap[uuid]['time'] = time 
        dispatch({
          type: SAVE_COLLECTION_FULFILLED,
          payload: { items: getState().collections.items,
                     uuid, 
                     name, 
                     lastModifiedMap 
                   }
        })
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
  const { uuid, name, items, lastModifiedMap } = getState().collections
  let { page } = getState().words
  const { visibilityMap } = getState().visibility

  const url = 'api/word/delete/' + word + '/' + (uuid ? uuid + '/' + page : '')
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
          dispatch({type: FETCH_WORDS_REJECTED, payload: {error: 'fetching words failed', word: word}})
        } else {
          // Status looks good
         const words = json.empty ? [] : conflateWords(json.words) 
         const pagePrev = json.page_prev
         const pageNext = json.page_next
         const allWordCount = json.all_word_count
         page = json.page

         dispatch({
            type: FETCH_WORDS_FULFILLED,
            payload: { words, pagePrev, pageNext, allWordCount, page }
          });
        dispatch({
          type: SWITCH_VISIBILITY,
          payload: filterMap(visibilityMap, word)
        });

        let time = Date.now();
        time = Math.floor(time/1000);
        const collections = json.empty ? items.filter(e => e.name != name) : items
        dispatch({
          type: SAVE_COLLECTION_FULFILLED,
          payload: { items: collections,
                     uuid: uuid, 
                     name: name, 
                     lastModifiedMap: { ...lastModifiedMap, [uuid]: { time, 'words': { page: words }, name } } 
                   }
        })
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

export const fetchWord = (word) => { return (dispatch, getState) => {
  const { uuid, items } = getState().collections
  let { lastModifiedMap } = getState().collections
  const { visibilityMap } = getState().visibility
  const { refMap } = getState().refs

  let headers = {"Content-Type": "application/json"};
  const {token} = getState().auth;
  if (token) {
      headers["Authorization"] = `Token ${token}`;
  }

  const url = 'api/word/' + word + '/' + (uuid ? uuid : '')
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
          console.log(lastModifiedMap[uuid])
          let words = lastModifiedMap[uuid]['words'][page] 
          let pageNext = json.page_next
          let pagePrev = json.page_prev ? json.page_prev : 0
          let allWordCount = json.all_word_count
          console.log(pagePrev)
          console.log(pageNext)
          if (json.words) {
            words = conflateWords(json.words)
          }
          else {

          const obj = word.reduce((o, e) =>
                                  (o['word'] = e['word'], 
                                    o['description'] = [ ...o['description'] ? o['description'] : '', 
                                    { 'language' : e['language'], 
                                      'is_verb' : e['is_verb'], 
                                      'etymology': e['word_etymologies'] } ], o), {}
                                 );
          if (words.length >= 20) {
            console.log('popping')
            const popped = words.pop();
            pageNext = 2;            
            if (lastModifiedMap[uuid]['words'][pageNext]) {
              lastModifiedMap = reshuffleWordsOnPages(popped, lastModifiedMap[uuid]['words'], pageNext)
            }
          }
            words = [ obj, ...words ]
          }
          dispatch({
            type: FETCH_WORD_FULFILLED,
            payload: { 'words': words, pageNext, pagePrev, allWordCount }
          });
          dispatch({
            type: SWITCH_VISIBILITY,
            payload: { ...visibilityMap, ...{ [word]: 'show' } }
          });
          dispatch({
            type: MAP_REF,
            payload: { }
          });

          dispatch({
            type: FETCH_COLLECTION_FULFILLED,
            payload: { uuid, name }
          });

          let time = Date.now();
          time = Math.floor(time/1000);
          dispatch({
            type: SAVE_COLLECTION_FULFILLED,
            payload: { items, 
                       uuid, 
                       name, 
                       lastModifiedMap: { ...lastModifiedMap, 
                                          [uuid]: { time, name,
                                                    'words': { ...lastModifiedMap[uuid]['words'], ...{ page: words } }, 
                                                  }
                       } 
            }
          })
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
        payload: { uuid: uuid, name: name }
      });
      dispatch({
        type: FETCH_WORDS_FULFILLED,
        payload: { 'words': items, page } 
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
