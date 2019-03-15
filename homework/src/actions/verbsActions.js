import {  
         FETCH_VERBS, 
         FETCH_VERB, 
         FETCH_VERB_FULFILLED, 
         FETCH_VERBS_FULFILLED, 
         FETCH_VERBS_REJECTED, 
       } from './types';

export const requestVerbs = () => dispatch => {
 console.log('requesting verbs');
  dispatch({
    type: FETCH_VERBS,
  })
};

export const requestVerb = (verb, language) => dispatch => {
  console.log('requesting verb');
  console.log(verb);
 
  dispatch({
    type: FETCH_VERB,
    payload: { language, verb }
  })
};

export const fetchVerbs = () => (dispatch, getState) => {
  console.log('fetching verbs');

  return fetch('/homework/verbs')
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
          dispatch({ type: FETCH_VERBS_REJECTED, payload: 'fetching verbs failed' })
        } else {
          // Status looks good
          let verbs = json;
          dispatch({
            type: FETCH_VERBS_FULFILLED,
            payload: verbs 
          });
         return json;
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_VERBS_REJECTED, payload: 'fetching verbs failed', })
        throw json;
      }
    ); 
};
