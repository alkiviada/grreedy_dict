import { 
  FETCH_COLLECTION_FULFILLED, 
  SAVE_COLLECTION_FULFILLED, 
  CLEAR_NEW_WORD_ERROR, FETCH_WORDS, 
  FETCH_WORDS_FULFILLED, 
  FETCH_WORDS_REJECTED, 
  FETCH_WORD, 
  FETCH_WORD_FULFILLED,
  SWITCH_VISIBILITY
} from './types';

import { conflateWords, filterMap } from './helpers';

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

export const requestWord = () => dispatch => {
  dispatch({
    type: FETCH_WORD,
  })
};

export const fetchWords = (uuid, page) => { return (dispatch, getState) => {
  const { items, pagePrev, pageNext } = getState().words;

  let { lastModifiedMap, name } = getState().collections;
  let time = lastModifiedMap[uuid] ? lastModifiedMap[uuid]['time'] : ''

  if (!uuid) {
    console.log('i am here no uuid')
    return dispatch({
      type: FETCH_WORDS_FULFILLED,
      payload: [],
    });
  }
  else if (!lastModifiedMap[uuid] && items.length && !page) {

// we have a collection but we never saved it 
// - let's load it from the storage of words' reducer  
    console.log('am i here?')

    dispatch({
      type: FETCH_COLLECTION_FULFILLED,
      payload: { uuid: uuid, name: name }
    });
    return dispatch({
      type: FETCH_WORDS_FULFILLED,
      payload: { 'words': items, pagePrev, pageNext }
    });
  }
  else {
    page = page || 1
    console.log(page)
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
          if (json.words) {
            name = json.name
            uuid = json.uuid
            words = conflateWords(json.words)
            pagePrev = json.page_prev
            pageNext = json.page_next
            console.log(pageNext)
          }
          else {
            words = lastModifiedMap[uuid]['words']
            name = lastModifiedMap[uuid]['name']
          }
          dispatch({
            type: FETCH_COLLECTION_FULFILLED,
            payload: { uuid: uuid, name: name }
          });
          dispatch({
            type: FETCH_WORDS_FULFILLED,
            payload: { words, pageNext, pagePrev }
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
  const { uuid, name, items, lastModifiedMap } = getState().collections
  const { visibilityMap } = getState().visibility

  const url = 'api/word/delete/' + word + '/' + (uuid ? uuid : '')
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
         const words = json.empty ? [] : getState().words.items.filter(e => e.word != word) 

         dispatch({
            type: FETCH_WORD_FULFILLED,
            payload: words
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
                       lastModifiedMap: { ...lastModifiedMap, 
                                          [uuid]: { time, words, name }
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

export const fetchWord = (word) => { return (dispatch, getState) => {
  const { uuid, items, lastModifiedMap } = getState().collections
  const { visibilityMap } = getState().visibility

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
          const { page } = getState().words
          let words = page == 1 ? getState().words.items : lastModifiedMap[uuid]['words'] 
          const { word, name, uuid } = json
          let { pageNext } = json

          const obj = word.reduce((o, e) =>
                                  (o['word'] = e['word'], 
                                    o['description'] = [ ...o['description'] ? o['description'] : '', 
                                    { 'language' : e['language'], 
                                      'is_verb' : e['is_verb'], 
                                      'etymology': e['word_etymologies'] } ], o), {}
                                 );
          if (words.length >= 20) {
            console.log('popping')
            words.pop();
            pageNext = 2;            
          }
          dispatch({
            type: FETCH_WORD_FULFILLED,
            payload: { 'words': [ obj, ...words ], 'pageNext': pageNext }
          });
          dispatch({
            type: SWITCH_VISIBILITY,
            payload: { ...visibilityMap, ...{ [obj.word]: 'show' } }
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
                                                    words: [obj, ...words], 
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
      console.log('here i am on the road again')

      dispatch({
        type: FETCH_COLLECTION_FULFILLED,
        payload: { uuid: uuid, name: name }
      });
      dispatch({
        type: FETCH_WORDS_FULFILLED,
        payload: { 'words': items } 
      });
      return dispatch(fetchWord(word))
  }
  else {
    console.log('i am here')
    return dispatch(fetchWords(uuid)).then(() => {
      return dispatch(fetchWord(word))
    })
  }
  }
};
