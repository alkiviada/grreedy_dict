import { FETCH_WORDS, FETCH_WORDS_FULFILLED, FETCH_WORDS_REJECTED, FETCH_WORD, FETCH_WORD_FULFILLED } from './types';

export const requestWords = () => dispatch => {
  dispatch({
    type: FETCH_WORDS,
  })
};

export const requestWord = () => dispatch => {
  dispatch({
    type: FETCH_WORD,
  })
};

export const fetchWords = () => dispatch => {
  console.log('fetching words');
  fetch('api/word')
    .then(res => res.json())
    .then(words => {
      let conflated_words = [];
      let word_map = {}
      for (let w of words) {
        const word = w.word;
        if (word_map[word]) {
          word_map[word] = [ ...word_map[word], 
                             { 'language': w.language, 'etymology': w.word_etymologies }
                           ]
        }
        else {
          word_map[word] = [ { 'language': w.language, 'etymology': w.word_etymologies } ]
          conflated_words.push(word)
        }
      }
      conflated_words = conflated_words.map(w => ({'word': w, 'description': word_map[w]}))
      dispatch({
        type: FETCH_WORDS_FULFILLED,
        payload: conflated_words
      })
    }
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
          dispatch({type: FETCH_WORDS_REJECTED, payload: 'fetching words failed', })
        } else {
          // Status looks good
          var word = json;
          const obj = word.reduce((o, e) =>
                               (o['word'] = e['word'], 
                                o['description'] = [ ...o['description'] ? o['description'] : '', 
                                                     {'language' : e['language'], 
                                                      'etymology': e['word_etymologies']} ], o), {}
                              );
          dispatch({
            type: FETCH_WORD_FULFILLED,
            payload: [obj, ...words]
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_WORDS_REJECTED, payload: 'fetching words failed', })
      }
    ); 
};

