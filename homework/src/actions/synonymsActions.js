import { FETCH_SYNONYMS, FETCH_SYNONYMS_FULFILLED, FETCH_SYNONYMS_REJECTED, } from './types';
import { contentToMap } from './helpers';

export const lookUpSynonyms = (word, allSynonyms, fetchingMap) => dispatch => {
  console.log('fetching word synonyms');
  fetch('/api/word/synonyms/' + word)
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
          dispatch({type: FETCH_SYNONYMS_REJECTED, 
                    payload: { 
                      allSynonyms: { ...allSynonyms, ...{ [word]: {error: true} } },
                      fetchingMap: { ...fetchingMap, ...{ [word]: false } }
                    }
          })
        } else {
          // Status looks good
          dispatch({
            type: FETCH_SYNONYMS_FULFILLED,
            payload: {
                      allSynonyms: { ...allSynonyms, ...{ [word]: contentToMap(json) } },
                      fetchingMap: { ...fetchingMap, ...{[word]: false} }
            }
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_SYNONYMS_REJECTED, payload: 'fetching synonyms failed', })
      }
    ); 
};

export const requestSynonyms = (word, fetchingMap) => dispatch => {
  console.log('requesting word synonyms')
  dispatch({
    type: FETCH_SYNONYMS,
    payload: { ...fetchingMap, ...{[word]: true} }
  })
};
