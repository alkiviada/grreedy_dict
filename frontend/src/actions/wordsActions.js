import { CLEAR_ERROR, FETCH_WORDS, FETCH_WORDS_FULFILLED, FETCH_WORDS_REJECTED, FETCH_WORD, FETCH_WORD_FULFILLED } from './types';
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

export const fetchWords = () => dispatch => {
  console.log('fetching words');
  fetch('api/word')
    .then(res => res.json())
    .then(words => {
      const conflated_words = conflateWords(words)
      dispatch({
        type: FETCH_WORDS_FULFILLED,
        payload: conflated_words
      })
    }
  );
};

export const lookUpWord = (word, words, uuid) => dispatch => {
  console.log('fetching word');
  fetch('api/word/' + word + '/' + uuid)
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
        dispatch({type: FETCH_WORDS_REJECTED, payload: {error: 'fetching words failed', }})
      }
    ); 
};
