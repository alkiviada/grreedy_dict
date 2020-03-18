import { 
         FETCH_INFLECTIONS, 
         FETCH_INFLECTIONS_FULFILLED, 
         FETCH_INFLECTIONS_REJECTED, 
       } from './types';


export const fetchInflections = (word) => (dispatch, getState) => {
  console.log('fetching word inflections');
  fetch('/api/word/inflection/' + word)
  .then(response =>
      response.json().then(json => ({
        status: response.status,
        json
      })
    ))
  .then(
      // Both fetching and parsing succeeded!
      ({ status, json }) => {
        const { allInflections, fetchingMap } = getState().inflections
        if (status >= 400) {
          // Status looks bad
          console.log('Server returned error status when fetching inflections');
          dispatch({type: FETCH_INFLECTIONS_REJECTED, 
                    payload: { 
                      allInflections: { ...allInflections, ...{ [word]: {error: true} } },
                      fetchingMap: { ...fetchingMap, ...{ [word]: false } }
                    }
          })
        } else {
          // Status looks good
          dispatch({
            type: FETCH_INFLECTIONS_FULFILLED,
            payload: {
                      allInflections: { ...allInflections, ...{ [word]: json } },
                      fetchingMap: { ...fetchingMap, ...{[word]: false} }
            }
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_INFLECTIONS_REJECTED, payload: { error: 'fetching inflections failed', 
                      allInflections: { ...allInflections, ...{ [word]: {error: true} } },
                      fetchingMap: { ...fetchingMap, ...{[word]: false} } }
        })
      }
    ); 
};

export const requestInflections = (word) => (dispatch, getState) => {
  console.log('requesting word inflections')
  const { fetchingMap } = getState().inflections
  dispatch({
    type: FETCH_INFLECTIONS,
    payload: { ...fetchingMap, ...{[word]: true} }
  })
};
