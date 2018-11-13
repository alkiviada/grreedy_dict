import { FETCH_NOTE, FETCH_NOTE_FULFILLED, FETCH_NOTE_REJECTED, POST_NOTE, CLEAR_FETCHED } from './types';

export const fetchNote = (word, allNotes, fetchingMap) => dispatch => {
  console.log('fetching word notes');
  const uuid = localStorage.getItem("uuid")
  fetch('api/word/note/' + word + '/' + uuid)
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
          console.log('Server returned error status when fetching notes');
          dispatch({type: FETCH_NOTE_REJECTED, 
                    payload: { 
                      allNotes: { ...allNotes, ...{ [word]: {error: true} } },
                      fetchingMap: { ...fetchingMap, ...{ [word]: false } }
                    }
          })
        } else {
          // Status looks good
          console.log(json)
          dispatch({
            type: FETCH_NOTE_FULFILLED,
            payload: {
                      allNotes: { ...allNotes, ...{ [word]: json } },
                      fetchingMap: { ...fetchingMap, ...{[word]: false} }
            }
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_NOTE_REJECTED, payload: 'fetching note failed', })
      }
    ); 
};

export const clearFetched = () => dispatch => {
 console.log('clearing fetched');
  dispatch({
    type: CLEAR_FETCHED,
  })
};


export const requestNote = (word, fetchingMap) => dispatch => {
  console.log('requesting word note')
  dispatch({
    type: FETCH_NOTE,
    payload: { ...fetchingMap, ...{[word]: true} }
  })
};
