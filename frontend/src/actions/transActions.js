import { FETCH_TRANSLATION, FETCH_TRANSLATION_FULFILLED, FETCH_TRANSLATION_REJECTED, SWITCH_TAB } from './types';

export const switchTab = (index, word, map) => dispatch => {
  console.log('switching tab');
  dispatch({
    type: SWITCH_TAB,
    payload: { ...map, ...{[word]: index} }
  })
};

export const lookUpTranslations = (word, allTranslations, fetchingMap) => dispatch => {
  console.log('fetching word translation');
  fetch('api/word/enit/' + word)
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
  console.log('requestiong word translation')
  dispatch({
    type: FETCH_TRANSLATION,
    payload: { ...fetchingMap, ...{[word]: true} }
  })
};

const translationsToMap = (w) => {
  const obj = w.reduce((o, e) => 
    (o[e['language']] = [...o[e['language']] ? 
      o[e['language']] : '', e['word'] ], o), {}
  );
  return obj
}
