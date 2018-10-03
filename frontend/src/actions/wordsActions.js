import { 
  FETCH_COLLECTION_FULFILLED, 
  CLEAR_ERROR, FETCH_WORDS, 
  FETCH_WORDS_FULFILLED, 
  FETCH_WORDS_REJECTED, 
  FETCH_WORD, 
  FETCH_WORD_FULFILLED } from './types';

import { conflateWords } from './helpers';

export const requestWords = () => dispatch => {
  dispatch({
    type: FETCH_WORDS,
  })
};

export const clearError = () => dispatch => {
  dispatch({
    type: CLEAR_ERROR,
  })
};

export const requestWord = () => dispatch => {
  dispatch({
    type: FETCH_WORD,
  })
};

export const fetchWords = (uuid) => dispatch => {
  console.log('fetching words');
  const url = 'api/words/' + (uuid ? uuid : '')
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
        console.log(status)
        if (status >= 400) {
          // Status looks bad
          console.log('Server returned error status');
          dispatch({type: FETCH_WORDS_REJECTED, payload: {error: 'fetching words failed'}})
        } else {
      const conflated_words = conflateWords(json)
      dispatch({
        type: FETCH_WORDS_FULFILLED,
        payload: conflated_words
      })
    }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_WORDS_REJECTED, payload: {error: 'fetching words failed'}})
      }
    ); 
};

export const lookUpWord = (word, words, uuid) => dispatch => {
  console.log('fetching word');
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
        console.log(status)
        if (status >= 400) {
          // Status looks bad
          console.log('Server returned error status');
          dispatch({type: FETCH_WORDS_REJECTED, payload: {error: 'fetching words failed', word: word}})
        } else {
          // Status looks good
          const word = json;
          console.log(word)
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
            payload: [obj, ...words]
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
