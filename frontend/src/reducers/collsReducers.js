import { 
        FETCH_COLLECTION_REJECTED, 
        FETCH_COLLECTION_FULFILLED, 
        SAVE_COLLECTION, 
        SAVE_COLLECTION_REJECTED, 
        SAVE_COLLECTION_FULFILLED, 
        FETCH_COLLECTIONS, 
        FETCH_COLLECTION, 
        FETCH_COLLECTIONS_FULFILLED,
        CLEAR_FETCHED,
       } from '../actions/types';

import { loadState, saveState } from './localStorage'


const initialState = {
  saving: false,
  saved: false,
  error: null,
  name: '',
  uuid: '',
  fetching: false,
  fetched: false,
  lastModifiedMap: {},
  items: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SAVE_COLLECTION: return { ...state, 
                                   saving: true, 
                                 };
    case SAVE_COLLECTION_FULFILLED: 
      console.log(action.payload)
      return { ...state, 
               saving: false, 
               error: null, 
               saved: true, 
               name: action.payload.name ? action.payload.name : '', 
               uuid: action.payload.uuid ? action.payload.uuid : '', 
               items: action.payload.items,
               lastModifiedMap: action.payload.lastModifiedMap
             };
    case SAVE_COLLECTION_REJECTED: 
      return { ...state, saving: false, fetching: false, error: action.payload };
    case FETCH_COLLECTION_REJECTED: 
      return { ...state, 
               error: action.payload, 
               fetching: false 
      };
    case FETCH_COLLECTION_FULFILLED: 
      return { ...state, 
               fetching: false, 
               fetched: true, 
               error: false, 
               name: action.payload.name, 
               uuid: action.payload.uuid 
             };
    case FETCH_COLLECTIONS_FULFILLED: return { ...state, fetching: false, items: action.payload };
    case FETCH_COLLECTIONS: return { ...state, fetching: true };
    case FETCH_COLLECTION: return { ...state, fetching: true };
    case CLEAR_FETCHED: return { ...state, fetched: false };
    default:
      return state;
  }
}
