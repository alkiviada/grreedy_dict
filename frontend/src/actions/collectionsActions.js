import { SAVE_COLLECTION, SAVE_COLLECTION_FULFILLED, SAVE_COLLECTION_REJECTED, FETCH_WORDS_FULFILLED, FETCH_COLLECTIONS_FULFILLED, FETCH_COLLECTIONS } from './types';

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
