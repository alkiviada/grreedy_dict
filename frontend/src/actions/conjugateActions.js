import { 
         FETCH_CONJUGATE, 
         FETCH_CONJUGATE_FULFILLED, 
         FETCH_CONJUGATE_REJECTED, 
       } from './types';


export const fetchConjugations = (word) => (dispatch, getState) => {
  console.log('fetching word conjugations');
  fetch('api/word/conjugate/' + word)
  .then(response =>
      response.json().then(json => ({
        status: response.status,
        json
      })
    ))
  .then(
      // Both fetching and parsing succeeded!
      ({ status, json }) => {
        const { allConjugations, fetchingMap } = getState().conjugate
        if (status >= 400) {
          // Status looks bad
          console.log('Server returned error status when fetching notes');
          dispatch({type: FETCH_CONJUGATE_REJECTED, 
                    payload: { 
                      allConjugations: { ...allConjugations, ...{ [word]: {error: true} } },
                      fetchingMap: { ...fetchingMap, ...{ [word]: false } }
                    }
          })
        } else {
          // Status looks good
          dispatch({
            type: FETCH_CONJUGATE_FULFILLED,
            payload: {
                      allConjugations: { ...allConjugations, ...{ [word]: json } },
                      fetchingMap: { ...fetchingMap, ...{[word]: false} }
            }
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_CONJUGATE_REJECTED, payload: { error: 'fetching conjugations failed', 
                      allConjugations: { ...allConjugations, ...{ [word]: {error: true} } },
                      fetchingMap: { ...fetchingMap, ...{[word]: false} } }
        })
      }
    ); 
};

export const requestConjugations = (word) => (dispatch, getState) => {
  console.log('requesting word conjugations')
  const { fetchingMap } = getState().conjugate
  dispatch({
    type: FETCH_CONJUGATE,
    payload: { ...fetchingMap, ...{[word]: true} }
  })
};
