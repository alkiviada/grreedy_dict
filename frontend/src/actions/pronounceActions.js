import { 
         FETCH_PRONOUNCE, 
         FETCH_PRONOUNCE_FULFILLED, 
         FETCH_PRONOUNCE_REJECTED, 
       } from './types';


export const fetchPronunciation = (word) => (dispatch, getState) => {
  console.log('fetching word pronunciation');
  fetch('api/word/pronounce/' + word)
  .then(response =>
      response.json().then(json => ({
        status: response.status,
        json
      })
    ))
  .then(
      // Both fetching and parsing succeeded!
      ({ status, json }) => {
        const { allPronunciations, fetchingMap } = getState().pronounce
        if (status >= 400) {
          // Status looks bad
          console.log('Server returned error status when fetching notes');
          dispatch({type: FETCH_PRONOUNCE_REJECTED, 
                    payload: { 
                      allPronunciations: { ...allPronunciations, ...{ [word]: {error: true} } },
                      fetchingMap: { ...fetchingMap, ...{ [word]: false } }
                    }
          })
        } else {
          // Status looks good
          console.log(json)
          dispatch({
            type: FETCH_PRONOUNCE_FULFILLED,
            payload: {
                      allPronunciations: { ...allPronunciations, ...{ [word]: json } },
                      fetchingMap: { ...fetchingMap, ...{[word]: false} }
            }
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_NOTE_REJECTED, payload: { error: 'fetching pronunciation failed', 
                      allPronunciations: { ...allPronunciations, ...{ [word]: {error: true} } },
                      fetchingMap: { ...fetchingMap, ...{[word]: false} } }
        })
      }
    ); 
};

export const requestPronunciation = (word) => (dispatch, getState) => {
  console.log('requesting word pronunciation')
  const { fetchingMap } = getState().pronounce
  dispatch({
    type: FETCH_PRONOUNCE,
    payload: { ...fetchingMap, ...{[word]: true} }
  })
};
