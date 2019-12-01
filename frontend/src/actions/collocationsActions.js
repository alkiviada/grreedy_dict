import { FETCH_COLLOCATIONS, FETCH_COLLOCATIONS_FULFILLED, FETCH_COLLOCATIONS_REJECTED, } from './types';

export const lookUpCollocations = (word, allCollocations, fetchingMap) => dispatch => {
  console.log('fetching word collocations');
  fetch('/api/word/collocations/' + word)
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
          dispatch({type: FETCH_COLLOCATIONS_REJECTED, 
                    payload: { 
                      allCollocations: { ...allCollocations, ...{ [word]: {error: true} } },
                      fetchingMap: { ...fetchingMap, ...{ [word]: false } }
                    }
          })
        } else {
          // Status looks good
          dispatch({
            type: FETCH_COLLOCATIONS_FULFILLED,
            payload: {
                      allCollocations: { ...allCollocations, ...{ [word]: json } },
                      fetchingMap: { ...fetchingMap, ...{[word]: false} }
            }
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_TRANSLATION_REJECTED, payload: 'fetching translation failed', })
      }
    ); 
};

export const requestCollocations= (word, fetchingMap) => dispatch => {
  console.log('requesting word collocation')
  dispatch({
    type: FETCH_COLLOCATIONS,
    payload: { ...fetchingMap, ...{[word]: true} }
  })
};

