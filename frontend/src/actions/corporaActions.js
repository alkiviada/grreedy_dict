import { 
         FETCH_CORPORA, 
         FETCH_CORPORA_FULFILLED, 
         FETCH_CORPORA_REJECTED, 
       } from './types';


export const fetchCorpora = (word) => (dispatch, getState) => {
  console.log('fetching word corpora');
  fetch('api/word/corpora/' + word)
  .then(response =>
      response.json().then(json => ({
        status: response.status,
        json
      })
    ))
  .then(
      // Both fetching and parsing succeeded!
      ({ status, json }) => {
        const { allCorpora, fetchingMap } = getState().corpora
        if (status >= 400) {
          // Status looks bad
          console.log('Server returned error status when fetching corpora');
          dispatch({type: FETCH_CORPORA_REJECTED, 
                    payload: { 
                      allCorpora: { ...allCorpora, ...{ [word]: {error: true} } },
                      fetchingMap: { ...fetchingMap, ...{ [word]: false } }
                    }
          })
        } else {
          // Status looks good
          dispatch({
            type: FETCH_CORPORA_FULFILLED,
            payload: {
                      allCorpora: { ...allCorpora, ...{ [word]: json } },
                      fetchingMap: { ...fetchingMap, ...{[word]: false} }
            }
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_CORPORA_REJECTED, payload: { error: 'fetching corpora failed', 
                      allCorpora: { ...allCorpora, ...{ [word]: {error: true} } },
                      fetchingMap: { ...fetchingMap, ...{[word]: false} } }
        })
      }
    ); 
};

export const requestCorpora = (word) => (dispatch, getState) => {
  console.log('requesting word corpora')
  const { fetchingMap } = getState().corpora
  dispatch({
    type: FETCH_CORPORA,
    payload: { ...fetchingMap, ...{[word]: true} }
  })
};
