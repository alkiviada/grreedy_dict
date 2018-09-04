import { FETCH_WORDS, FETCH_WORD } from './types';

export const fetchWords = () => dispatch => {
  fetch('api/word')
    .then(res => res.json())
    .then(words =>
      dispatch({
        type: FETCH_WORDS,
        payload: words
      })
    );
};

export const lookUpWord = word => dispatch => {
  fetch('api/word' + word)
    .then(res => res.json())
    .then(post =>
      dispatch({
        type: FETCH_WORD,
        payload: word
      })
    );
};
