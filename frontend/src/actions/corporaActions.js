import { 
         FETCH_CORPORA, 
         FETCH_CORPORA_FULFILLED, 
         FETCH_CORPORA_REJECTED, 
       } from './types';


export const fetchCorpora = (word, oldIds) => (dispatch, getState) => {
  console.log('fetching word orpora');
  console.log(word)
  fetch('/api/word/corpora/' + word + (oldIds ? '/' + oldIds : ''))
  .then(response =>
      response.json().then(json => ({
        status: response.status,
        json
      })
    ))
  .then(
      // Both fetching and parsing succeeded!
      ({ status, json }) => {
        const { allCorpora, fetchingMap, } = getState().corpora
        let end = false
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
          console.log(json)
          console.log(allCorpora[word])
          const b = allCorpora[word] ? allCorpora[word] : []
          console.log(b)
          const a = { ...allCorpora, ...{ [word]: [ ...b, ...json] } }
          end = !json.length
          console.log('end: ', end)
          console.log('this was my copropar');
          console.log(a)
          dispatch({
            type: FETCH_CORPORA_FULFILLED,
            payload: {
                      allCorpora: a,
                      fetchingMap: { ...fetchingMap, ...{[word]: false} },
                      end
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
