import { SAVE_COLLECTION, SAVE_COLLECTION_FULFILLED, SAVE_COLLECTION_REJECTED } from './types';

export const requestSave = () => dispatch => {
  dispatch({
    type: SAVE_COLLECTION,
  })
};

export const saveCollection = () => dispatch => {
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
