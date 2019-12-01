import { FETCH_TRANSLATION, FETCH_TRANSLATION_FULFILLED, FETCH_TRANSLATION_REJECTED, } from './types';
import { translationsToMap } from './helpers';

export const lookUpTranslations = (word, allTranslations, fetchingMap) => dispatch => {
  console.log('fetching word translation');
  fetch('/api/word/translate/' + word)
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
          dispatch({type: FETCH_TRANSLATION_REJECTED, 
                    payload: { 
                      allTranslations: { ...allTranslations, ...{ [word]: {error: true} } },
                      fetchingMap: { ...fetchingMap, ...{ [word]: false } }
                    }
          })
        } else {
          // Status looks good
          dispatch({
            type: FETCH_TRANSLATION_FULFILLED,
            payload: {
                      allTranslations: { ...allTranslations, ...{ [word]: translationsToMap(json) } },
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

export const requestTranslations = (word, fetchingMap) => dispatch => {
  console.log('requesting word translation')
  dispatch({
    type: FETCH_TRANSLATION,
    payload: { ...fetchingMap, ...{[word]: true} }
  })
};
