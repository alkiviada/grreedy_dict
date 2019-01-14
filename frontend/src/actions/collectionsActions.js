import { SAVE_COLLECTION, 
         SAVE_COLLECTION_FULFILLED, 
         FETCH_WORDS_REJECTED,
         FETCH_COLLECTION_REJECTED, 
         SAVE_COLLECTION_REJECTED, 
         FETCH_WORDS, 
         FETCH_WORDS_FULFILLED, 
         FETCH_NOTE_FULFILLED, 
         FETCH_COLLECTIONS_FULFILLED, 
         FETCH_COLLECTION_FULFILLED, 
         SWITCH_TAB,
         SWITCH_VISIBILITY,
         FETCH_COLLECTIONS, 
         FETCH_COLLECTION, 
         CLEAR_FETCHED
       } from './types';

import { conflateWords } from './helpers';
import { fetchWords } from './wordsActions';

export const requestSave = () => dispatch => {
  dispatch({
    type: SAVE_COLLECTION,
  })
};

export const clearFetched = () => dispatch => {
  dispatch({
    type: CLEAR_FETCHED,
  })
};

export const requestCollections = () => dispatch => {
  dispatch({
    type: FETCH_COLLECTIONS,
  })
};

export const requestCollection = () => dispatch => {
  dispatch({
    type: FETCH_WORDS,
  })
  dispatch({
    type: FETCH_COLLECTION,
  })
};

export const fetchCollections = () => (dispatch, getState) => {
  let headers = {"Content-Type": "application/json"};
  let {token} = getState().auth;

  if (token) {
      headers["Authorization"] = `Token ${token}`;
  }
  fetch('api/collection/', {headers, })
    .then(res => res.json())
    .then(items => {
      dispatch({
        type: FETCH_COLLECTIONS_FULFILLED,
        payload: items
      })
    })
};

export const fetchCollection = (uuid, page) => { return (dispatch, getState) => {
  let headers = {"Content-Type": "application/json"};

  const {token} = getState().auth;

  if (token) {
      headers["Authorization"] = `Token ${token}`;
  }

  const { lastModifiedMap } = getState().collections;
  const time = lastModifiedMap[uuid] ? lastModifiedMap[uuid]['time'] : '';

  return fetch('api/collection/' + uuid + (time ? '/' + time : ''), {headers, })
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
          dispatch({type: 'AUTHENTICATION_ERROR', payload: 'saving words failed', })
          dispatch({type: FETCH_COLLECTION_REJECTED, payload: 'fetching words collection failed', })
          dispatch({type: FETCH_WORDS_REJECTED, payload: {error: false }})
        } else {
          // Status looks good
          let coll = json;
          let words = []
// i have this collection in my cache with its words' content and visibilityMap
          if (!coll.words) {
            words = lastModifiedMap[uuid]['words']
            name = lastModifiedMap[uuid]['name']
          }
          else {
            words = conflateWords(coll.words)
            uuid = coll.uuid
            name = coll.name
          }
          dispatch({
            type: FETCH_WORDS_FULFILLED,
            payload: words 
          }),
          dispatch({
            type: FETCH_COLLECTION_FULFILLED,
            payload: { uuid: uuid, name: name }
          });
          dispatch({
            type: SWITCH_VISIBILITY,
            payload: { ...words.reduce((visibilityMap, e) => (visibilityMap[e.word] = 'show', visibilityMap), {}) }
          });
         return json;
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_COLLECTION_REJECTED, payload: 'fetching words collection failed', })
      }
    ); 
};
};

export const saveCollection = (name, wordsString) => { return (dispatch, getState) => {

  const { uuid } = getState().collections
  const {token} = getState().auth;

  let headers = {
                 Accept: 'application/json',
                 "Content-Type": "application/json"
                };

  if (token) {
      headers["Authorization"] = `Token ${token}`;
  }
  return fetch('api/collection/', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
     name: name,
     uuid: uuid,
    }),})
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
          dispatch({type: 'AUTHENTICATION_ERROR', payload: 'saving words failed', })
          dispatch({type: SAVE_COLLECTION_REJECTED, payload: 'saving words failed', })
        } else {
          // Status looks good
          var colls = json;
          let time = Date.now();
          time = Math.floor(time/1000);
          
          const { lastModifiedMap } = getState().collections
          const words = getState().words.items || []
          const { page, allWordCount } = getState().words 

          dispatch({
            type: SAVE_COLLECTION_FULFILLED,
            payload: { items: colls, lastModifiedMap: {...lastModifiedMap, 
                                                       [uuid]: { time, allWordCount,
                                                                'words': {...lastModifiedMap[uuid]['words'], ...{[page]: words} }, 
                                                                 name }
                                                      } 
            }
          }),
          dispatch({
            type: FETCH_NOTE_FULFILLED,
            payload: { allNotes: {}, fetchingMap: {} }
          }),
          dispatch({
            type: SWITCH_TAB,
            payload: { mapTabIndex: {} }
          }),
          dispatch({
            type: FETCH_WORDS_FULFILLED,
            payload: { 'words': [] }
          });
          return json;
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: SAVE_COLLECTION_REJECTED, payload: 'saving words failed', })
      }
    ); 
};
};

export const saveCollectionAndLoadNew = (name, newUuid) => { return (dispatch, getState) => {

  const { uuid } = getState().collections

  const {token} = getState().auth;

  let headers = {
                 Accept: 'application/json',
                 "Content-Type": "application/json"
                };

  if (token) {
      headers["Authorization"] = `Token ${token}`;
  }
  return fetch('api/collection/', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
     name: name,
     uuid: uuid,
    }),})
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
          dispatch({type: 'AUTHENTICATION_ERROR', payload: 'saving words failed', })
          dispatch({type: SAVE_COLLECTION_REJECTED, payload: 'saving words failed', })
        } else {
          // Status looks good
          var colls = json;
          let time = Date.now();
          time = Math.floor(time/1000);
          
          const { lastModifiedMap } = getState().collections
          const words = getState().words.items || []

          dispatch({
            type: SAVE_COLLECTION_FULFILLED,
            payload: { items: colls, lastModifiedMap: {...lastModifiedMap, [uuid]: { time, words, name }} }
          }),
          dispatch({
            type: FETCH_NOTE_FULFILLED,
            payload: { allNotes: {}, fetchingMap: {} }
          }),
          dispatch({
            type: SWITCH_TAB,
            payload: { mapTabIndex: {} }
          }),
          dispatch({
            type: FETCH_WORDS_FULFILLED,
            payload: { 'words': [] }
          });
         return dispatch(fetchWords(newUuid))
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: SAVE_COLLECTION_REJECTED, payload: 'saving words failed', })
      }
    ); 
};
};
