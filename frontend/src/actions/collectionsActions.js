import { SAVE_COLLECTION, SAVE_COLLECTION_FULFILLED, SAVE_COLLECTION_REJECTED } from './types';

export const requestSave = () => dispatch => {
 console.log('requesting save');
  dispatch({
    type: SAVE_COLLECTION,
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
          dispatch({
            type: SAVE_COLLECTION_FULFILLED,
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
