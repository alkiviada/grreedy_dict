import { SAVE_COLLECTION, 
         SAVE_COLLECTION_FULFILLED, 
         FETCH_COLLECTION_REJECTED, 
         SAVE_COLLECTION_REJECTED, 
         FETCH_WORDS, 
         FETCH_WORDS_FULFILLED, 
         FETCH_COLLECTIONS_FULFILLED, 
         FETCH_COLLECTION_FULFILLED, 
         FETCH_COLLECTIONS 
       } from './types';

import { conflateWords } from './helpers';

export const requestSave = () => dispatch => {
 console.log('requesting save');
  dispatch({
    type: SAVE_COLLECTION,
  })
};

export const requestCollections = () => dispatch => {
 console.log('requesting collections');
  dispatch({
    type: FETCH_COLLECTIONS,
  })
};

export const requestCollection = () => dispatch => {
 console.log('requesting collection');
  dispatch({
    type: FETCH_WORDS_FULFILLED,
    payload: []
  })
  dispatch({
    type: FETCH_WORDS,
  })
};

export const fetchCollections = () => dispatch => {
  console.log('fetching collections');
  fetch('api/collection/')
    .then(res => res.json())
    .then(items => {
      dispatch({
        type: FETCH_COLLECTIONS_FULFILLED,
        payload: items
      })
    })
};

export const fetchCollection = (uuid) => dispatch => {
  console.log('fetching words for collection');
  fetch('api/collection/' + uuid)
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
          dispatch({type: FETCH_COLLECTION_REJECTED, payload: 'fetching words collection failed', })
        } else {
          // Status looks good
          var coll = json;
          console.log(coll)
          const conflatedWords = conflateWords(coll.words)
          dispatch({
            type: FETCH_WORDS_FULFILLED,
            payload: conflatedWords
          }),
          dispatch({
            type: FETCH_COLLECTION_FULFILLED,
            payload: { uuid: coll.uuid, name: coll.name }
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_COLLECTION_REJECTED, payload: 'fetching words collection failed', })
      }
    ); 
};

export const saveCollection = (name, words) => dispatch => {
  console.log('saving words');
  fetch('api/collection/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
     collection: words,
     name: name,
    }),})
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
          dispatch({type: SAVE_COLLECTION_REJECTED, payload: 'saving words failed', })
        } else {
          // Status looks good
          var colls = json;
          dispatch({
            type: SAVE_COLLECTION_FULFILLED,
            payload: colls
          }),
          dispatch({
            type: FETCH_WORDS_FULFILLED,
            payload: []
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: SAVE_COLLECTION_REJECTED, payload: 'saving words failed', })
      }
    ); 
};
