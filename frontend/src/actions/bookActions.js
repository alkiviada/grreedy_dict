import { 
  REGISTER_UUID,
  FETCH_PAGE,
  FETCH_PAGE_FULFILLED,
  FETCH_PAGE_REJECTED,
} from './types';

export const registerUUId = (uuid) => dispatch => {
  dispatch({
    type: REGISTER_UUID,
    payload: uuid,
  })
};

export const requestPage = (page) => dispatch => {
  dispatch({
    type: FETCH_PAGE,
    payload: page,
  })
};

export const fetchPage = (start) => { return (dispatch, getState) => {
  let { bookPageMap, page, ps } = getState().book
  console.log('fetching')
  console.log(bookPageMap)
  console.log(page)
  if(bookPageMap[page]) {
     console.log('old data')
    const newStart = start ? (bookPageMap[page]['end'] >= ps.length ? bookPageMap[page]['end'] - 2 : bookPageMap[page]['end']) : 0 
    const newEnd = bookPageMap[page]['end'] >= ps.length ? bookPageMap[page]['end'] : bookPageMap[page]['end'] + 2
    bookPageMap[page]['psToShow'] = ps.slice(newStart, newEnd)
    bookPageMap[page]['end'] = newEnd
    return dispatch({
          type: FETCH_PAGE_FULFILLED,
          payload: { ps, bookPageMap }
        });
  }
  else {

  let headers = {"Content-Type": "application/json"};
  const {token} = getState().auth;
  if (token) {
      headers["Authorization"] = `Token ${token}`;
  }

  const url = '/api/book/' + page 
  return fetch(url, {headers})
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
          dispatch({type: FETCH_PAGE_REJECTED, payload: {error: 'fetching page failed', page: page}})
        } else {
          // Status looks good
          ps = json.ps
          console.log('new fresh ps')
          console.log('before')
          console.log(bookPageMap)
          for (const k in bookPageMap) {
             console.log(k)
            bookPageMap[k] = undefined
          }
          bookPageMap[page] = {}
          bookPageMap[page]['psToShow'] = []
          for (const p in ps) {
            console.log(p)
            bookPageMap[page]['psToShow'].push(ps[p])
            let l = bookPageMap[page]['psToShow'].join(' ').length
            bookPageMap[page]['end'] = ps.findIndex(e => ps[p] == e) + 1
            if (l > 500) {
              break
            }
          }
          console.log('after')
          console.log(bookPageMap)

          dispatch({
            type: FETCH_PAGE_FULFILLED,
            payload: { ps, bookPageMap }
          });
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_PAGE_REJECTED, payload: {error: 'fetching page failed', page: page}})
      }
    ); 
}
};
};

