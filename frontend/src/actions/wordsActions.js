import { 
  FETCH_COLLECTION_FULFILLED, 
  CLEAR_NEW_WORD_ERROR, FETCH_WORDS, 
  FETCH_WORDS_FULFILLED, 
  FETCH_WORDS_REJECTED, 
  FETCH_WORD, 
  FETCH_WORD_FULFILLED 
} from './types';

import { conflateWords } from './helpers';

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

export const fetchWords = (uuid) => (dispatch, getState) => {
  console.log(`fetching words for ${uuid}`)

  const items = getState().words.items || [];
  console.log(getState().collections);

  let { lastModifiedMap, name } = getState().collections;
  let time = lastModifiedMap[uuid] ? lastModifiedMap[uuid]['time'] : ''
  console.log(time)

  console.log('last modified map in fetch words')
  console.log(lastModifiedMap)

  if (!uuid) {
    dispatch({
      type: FETCH_WORDS_FULFILLED,
      payload: [],
    });
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
  }
  else {
    const url = 'api/words/' + (uuid ? uuid + '/' + time : '')
    fetch(url)
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
          console.log(json)
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

export const lookUpWord = (word) => (dispatch, getState) => {
  console.log('fetching word');
  const { uuid } = getState().collections

  const url = 'api/word/' + word + '/' + (uuid ? uuid : '')
  fetch(url)
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
                                                      'etymology': e['word_etymologies']} ], o), {}
                              );
          dispatch({
            type: FETCH_WORD_FULFILLED,
            payload: [ obj, ...words ]
          });
          dispatch({
            type: FETCH_COLLECTION_FULFILLED,
            payload: { uuid: collUUID, name: collName }
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
