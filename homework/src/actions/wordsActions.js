import { 
  CLEAR_NEW_WORD_ERROR, 
  FETCH_WORD_REJECTED, 
  FETCH_WORD, 
  FETCH_WORD_FULFILLED,
} from './types';

export const clearNewWordError = () => dispatch => {
  dispatch({
    type: CLEAR_NEW_WORD_ERROR,
  })
};


export const requestWord = (word) => dispatch => {
  dispatch({
    type: FETCH_WORD,
    payload: word,
  })
};

export const lookUpWord = (word) => { return (dispatch, getState) => {
  let { uuid, words } = getState().words
  const url = '/api/word/' + word + '/' + (uuid ? uuid : '')
  return fetch(url)
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
          dispatch({type: FETCH_WORD_REJECTED, payload: {error: 'fetching words failed', word: word}})
        } else {
          // Status looks good
          const { word, uuid } = json
          console.log(word)

          const obj = word.reduce((o, e) =>
                                  (o['word'] = e['word'], 
                                    o['description'] = [ ...o['description'] ? o['description'] : '', 
                                    { 'language' : e['language'], 
                                      'is_verb' : e['is_verb'], 
                                      'etymology': e['word_etymologies'] } ], o), {}
                                 );
          words = [ obj, ...words ]
          
          dispatch({
            type: FETCH_WORD_FULFILLED,
            payload: { words, uuid }
          });

        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_WORD_REJECTED, payload: {error: 'fetching words failed', word: word}})
      }
    ); 
};
};

