import React from "react";

import {  
         FETCH_HOMEWORK, 
         FETCH_HOMEWORK_FULFILLED, 
         FETCH_HOMEWORK_REJECTED, 
         LOG_HOMEWORK_REFS,
         LOG_HOMEWORK_TENSE_IDX,
         STORE_MY_HOMEWORK_CONJUGATIONS,
       } from './types';

import { countMatches } from '../components/helpers'

export const requestConjugateHomework = () => dispatch => {
 console.log('requesting homework');
  dispatch({
    type: FETCH_HOMEWORK,
  })
};

export const fetchConjugateHomework = (verb, language) => (dispatch, getState) => {
  console.log('fetching homework');
  if (!verb) {
    let { verb, language } = getState().verbs
  }
  console.log(getState().verbs)
  console.log('this was my verb state')
  const { tenseIdx } = getState().conjugsHomework

  return fetch('/homework/conjugate-homework/' + verb + '/' + language + '/' + tenseIdx)
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
          dispatch({ type: FETCH_HOMEWORK_REJECTED, payload: 'fetching homework failed' })
        } else {
          // Status looks good
          const homework = json.examples.map(e => e.example.stub)
          const correct = json.examples.map(e => e.example.correct)
          dispatch({
            type: FETCH_HOMEWORK_FULFILLED,
            payload: { homework, correct } 
          });
         return json;
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_HOMEWORK_REJECTED, payload: 'fetching homework failed', })
        throw json;
      }
    ); 
};

export const storeMyHomeworkConjugateRefs = () => (dispatch, getState) => {
  console.log('storing conjugate homework refs');
  const placeHNum = countMatches(getState().conjugsHomework.homework.join(''))
  console.log(placeHNum)
  const hconjRefs = [ ...Array(placeHNum).keys() ].map(m => React.createRef());
  console.log(hconjRefs)
  dispatch({
    type: LOG_HOMEWORK_REFS,
    payload: hconjRefs
  })
};

export const storeMyHomeworkConjugs = (myConjugsRefs) => dispatch => {
 console.log('storing my homework conjugations');
 console.log(myConjugsRefs)
 const myConjugs = myConjugsRefs.map(c => c.current.innerHTML.trim())
 console.log('my homework')
 console.log(myConjugs)
  dispatch({
    type: STORE_MY_HOMEWORK_CONJUGATIONS,
    payload: myConjugs
  })
};

export const logHomeworkTenseIdx = (tenseIdx) => dispatch => {
 console.log('logging homework tense idx');
  dispatch({
    type: LOG_HOMEWORK_TENSE_IDX,
    payload: tenseIdx
  })
};
