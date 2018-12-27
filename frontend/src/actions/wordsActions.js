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

export const fetchWords = (uuid) => { return (dispatch, getState) => {
  console.log(`fetching words for ${uuid}`)

  const { items } = getState().words;

  let { lastModifiedMap, name } = getState().collections;
  let time = lastModifiedMap[uuid] ? lastModifiedMap[uuid]['time'] : ''

  if (!uuid) {
    return dispatch({
      type: FETCH_WORDS_FULFILLED,
      payload: [],
    });
  }
  else if (!lastModifiedMap[uuid]) {

// we have a collection but we never saved it 
// - let's load it from the storage of words' reducer  

    dispatch({
      type: FETCH_COLLECTION_FULFILLED,
      payload: { uuid: uuid, name: name }
    });
    return dispatch({
      type: FETCH_WORDS_FULFILLED,
      payload: items
    });
  }
  else {
    const url = 'api/words/' + (uuid ? uuid + '/' + time : '')
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
          let words = []
          let name = ''
          if (json[0] && json[0].words) {
            name = json[0].words[0].name
            uuid = json[0].words[0].uuid
            words = conflateWords(json)
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
            payload: words
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
  console.log('deleting word');
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
  console.log('fetching word');
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
          const words = getState().words.items || []
          const word = json;
          const collUUID = word[0].words[0].uuid
          const collName = word[0].words[0].name

          const obj = word.reduce((o, e) =>
                               (o['word'] = e['word'], 
                                o['description'] = [ ...o['description'] ? o['description'] : '', 
                                                     {'language' : e['language'], 
                                                     'is_verb' : e['is_verb'], 
                                                     'etymology': e['word_etymologies']} ], o), {}
                              );
          dispatch({
            type: FETCH_WORD_FULFILLED,
            payload: [ obj, ...words ]
          });
          dispatch({
            type: SWITCH_VISIBILITY,
            payload: { ...visibilityMap, ...{ [obj.word]: 'show' } }
          });

          dispatch({
            type: FETCH_COLLECTION_FULFILLED,
            payload: { uuid: collUUID, name: collName }
          });

          let time = Date.now();
          time = Math.floor(time/1000);
          console.log(collName)
          console.log(collUUID)
          dispatch({
            type: SAVE_COLLECTION_FULFILLED,
            payload: { items, 
                       uuid: collUUID, 
                       name: collName, 
                       lastModifiedMap: { ...lastModifiedMap, 
                                          [collUUID]: { time, words: [obj, ...words], name: collName }
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
  console.log(`fetching words for ${uuid}`)

  const { items } = getState().words;
  const { lastModifiedMap, name } = getState().collections;

  let time = lastModifiedMap[uuid] ? lastModifiedMap[uuid]['time'] : ''


  if (!uuid) {
    return dispatch(fetchWord(word))
  }
  else if (!lastModifiedMap[uuid]) {

// we have a collection but we never saved it 
// - let's load it from the storage of words' reducer  

    console.log('i am dispatching here')
    dispatch({
      type: FETCH_COLLECTION_FULFILLED,
      payload: { uuid: uuid, name: name }
    });
     dispatch({
      type: FETCH_WORDS_FULFILLED,
      payload: items
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
