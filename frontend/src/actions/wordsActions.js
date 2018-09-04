import { FETCH_WORDS, FETCH_WORD, FETCH_TRANSLATION, SWITCH_TAB } from './types';

export const switchTab = (index, word, map) => dispatch => {
  console.log('switching tab');
  dispatch({
    type: SWITCH_TAB,
    payload: { ...map, ...{[word]: index} }
  })
};

export const fetchWords = () => dispatch => {
  console.log('fetching words');
  fetch('api/word')
    .then(res => res.json())
    .then(words =>
      dispatch({
        type: FETCH_WORDS,
        payload: words
      })
    );
};

export const lookUpWord = (word, words) => dispatch => {
  console.log('fetching word');
  fetch('api/word/' + word)
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
        } else {
          // Status looks good
          var word = Object.assign({}, json);
          dispatch({
            type: FETCH_WORDS,
            payload: [word, ...words]
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
      }
    ); 
};

export const lookUpTranslations = (word, allTranslations) => dispatch => {
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
        } else {
          // Status looks good
          dispatch({
            type: FETCH_TRANSLATION,
            payload: { ...allTranslations, ...{ [word]: translationsToMap(json) } }
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
      }
    ); 
};


const translationsToMap = (w) => {
  const obj = w.reduce((o, e) => 
    (o[e['language']] = [...o[e['language']] ? 
      o[e['language']] : '', e['word'] ], o), {}
  );
  return obj
}
