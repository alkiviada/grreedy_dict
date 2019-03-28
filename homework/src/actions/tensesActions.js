import {  
         FETCH_TENSES_FULFILLED, 
         FETCH_TENSES_REJECTED, 
       } from './types';

export const fetchVerbTenses = (verb, language) => (dispatch, getState) => {
 console.log('fetching tenses for verb')

  const { verbTensesMap } = getState().tenses
  console.log(verb)

  return fetch('/homework/tenses/' + verb + '/' + language) 
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
          dispatch({ type: FETCH_TENSES_REJECTED, payload: 'fetching tenses failed' })
        } else {
          // Status looks good
          console.log('this is my tense load ', json)
          let verb_tenses = json;
          let v_t = verb_tenses.map(vt => vt.num_id)
          console.log(`this is my tense array ${v_t}`)
          dispatch({
            type: FETCH_TENSES_FULFILLED,
            payload: { ...verbTensesMap, [verb]: v_t }
          });
         return json;
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_TENSES_REJECTED, payload: 'fetching tenses failed', })
        throw json;
      }
    ); 
}
