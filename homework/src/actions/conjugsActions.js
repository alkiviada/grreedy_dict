import {  
         FETCH_CONJUGATIONS, 
         FETCH_CONJUGATIONS_FULFILLED, 
         FETCH_CONJUGATIONS_REJECTED, 
       } from './types';

export const requestConjugations = () => dispatch => {
 console.log('requesting conjugations');
  dispatch({
    type: FETCH_CONJUGATIONS,
  })
};

export const fetchConjugations = (word) => (dispatch, getState) => {
  console.log('fetching conjugations');

  return fetch('/homework/conjugate/' + word)
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
          dispatch({ type: FETCH_CONJUGATIONS_REJECTED, payload: 'fetching conjugations failed' })
        } else {
          // Status looks good
          let conjugations = json.conjugations;
          dispatch({
            type: FETCH_CONJUGATIONS_FULFILLED,
            payload: conjugations
          });
         return json;
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_CONJUGATIONS_REJECTED, payload: 'fetching conjugations failed', })
        throw json;
      }
    ); 
};
