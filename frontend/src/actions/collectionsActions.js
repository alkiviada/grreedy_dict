import { SAVE_COLLECTION, 
         SAVE_COLLECTION_FULFILLED, 
         FETCH_WORDS_REJECTED,
         FETCH_COLLECTION_REJECTED, 
         SAVE_COLLECTION_REJECTED, 
         FETCH_WORDS, 
         FETCH_WORDS_FULFILLED, 
         FETCH_NOTE_FULFILLED, 
         FETCH_COLLECTIONS_FULFILLED, 
         FETCH_COLLECTION_FULFILLED, 
         FETCH_COLLECTIONS, 
         FETCH_COLLECTION, 
         CLEAR_FETCHED
       } from './types';

import { conflateWords } from './helpers';

export const requestSave = () => dispatch => {
 console.log('requesting save');
  dispatch({
    type: SAVE_COLLECTION,
  })
};

export const clearFetched = () => dispatch => {
 console.log('clearing fetched colection name');
  dispatch({
    type: CLEAR_FETCHED,
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
    type: FETCH_WORDS,
  })
  dispatch({
    type: FETCH_COLLECTION,
  })
};

export const fetchCollections = () => (dispatch, getState) => {
  console.log('fetching collections');
  let headers = {"Content-Type": "application/json"};
  let {token} = getState().auth;

  console.log(token)
  if (token) {
      headers["Authorization"] = `Token ${token}`;
  }
  fetch('api/collection/', {headers, })
    .then(res => res.json())
    .then(items => {
      dispatch({
        type: FETCH_COLLECTIONS_FULFILLED,
        payload: items
      })
    })
};

export const fetchCollection = (uuid) => (dispatch, getState) => {
  console.log('fetching words for collection');
  let headers = {"Content-Type": "application/json"};
  let {token} = getState().auth;
  if (token) {
      headers["Authorization"] = `Token ${token}`;
  }

  console.log(token)
  fetch('api/collection/' + uuid, {headers, })
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
          dispatch({type: 'AUTHENTICATION_ERROR', payload: 'saving words failed', })
          dispatch({type: FETCH_COLLECTION_REJECTED, payload: 'fetching words collection failed', })
          dispatch({type: FETCH_WORDS_REJECTED, payload: {error: false }})
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

export const saveCollection = (name, uuid, words) => (dispatch, getState) => {
  console.log('saving words');
  console.log(uuid);
  let {token} = getState().auth;
  let headers = {
                 Accept: 'application/json',
                 "Content-Type": "application/json"
                };
  console.log(token)
  if (token) {
      headers["Authorization"] = `Token ${token}`;
  }
  fetch('api/collection/', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
     collection: words,
     name: name,
     uuid: uuid,
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
          dispatch({type: 'AUTHENTICATION_ERROR', payload: 'saving words failed', })
          dispatch({type: SAVE_COLLECTION_REJECTED, payload: 'saving words failed', })
        } else {
          // Status looks good
          var colls = json;
          dispatch({
            type: SAVE_COLLECTION_FULFILLED,
            payload: colls
          }),
          dispatch({
            type: FETCH_NOTE_FULFILLED,
            payload: { allNotes: {}, fetchingMap: {} }
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
