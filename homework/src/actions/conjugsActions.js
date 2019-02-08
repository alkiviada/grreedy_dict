import {  
         FETCH_CONJUGATIONS, 
         FETCH_CONJUGATIONS_FULFILLED, 
         FETCH_CONJUGATIONS_REJECTED, 
         LOG_CONJUGATE_REFS,
         LOG_TENSE_IDX,
         STORE_MY_CONJUGATIONS,
       } from './types';

import { prons } from '../components/helpers'

export const requestConjugations = () => dispatch => {
 console.log('requesting conjugations');
  dispatch({
    type: FETCH_CONJUGATIONS,
  })
};

export const fetchConjugations = (word, language, tenseIdx) => (dispatch, getState) => {
  console.log('fetching conjugations');

  return fetch('/homework/conjugations/' + word + '/' + language + '/' + tenseIdx)
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
          let conjugations = json.map(e => e.verb_form);
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

export const storeMyConjugateRefs = (myConjugsRefMap) => dispatch => {
 console.log('storing conjugate refs');
 console.log(myConjugsRefMap)
  dispatch({
    type: LOG_CONJUGATE_REFS,
    payload: myConjugsRefMap
  })
};

export const storeMyConjugs = (myConjugsRefMap, lang) => dispatch => {
 console.log(lang)
 console.log('storing my conjugations');
 console.log(prons[lang])
 const myConjugs = prons[lang].reduce((cA, p) => (cA.push(myConjugsRefMap[p].current.innerHTML.trim()), cA), [])
 console.log('my conjugs')
 console.log(myConjugs)
  dispatch({
    type: STORE_MY_CONJUGATIONS,
    payload: myConjugs
  })
};

export const logTenseIdx = (tenseIdx) => dispatch => {
 console.log('logging tense idx');
  dispatch({
    type: LOG_TENSE_IDX,
    payload: tenseIdx
  })
};
