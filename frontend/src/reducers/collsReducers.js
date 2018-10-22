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

const initialState = {
  saving: false,
  saved: false,
  error: null,
  name: '',
  uuid: localStorage.getItem("uuid"),
  fetching: false,
  fetched: false,
  items: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SAVE_COLLECTION: return { ...state, 
                                   saving: true, 
                                 };
    case SAVE_COLLECTION_FULFILLED: 
      localStorage.removeItem("uuid");
      return { ...state, saving: false, error: null, saved: true, name: '', uuid: '', items: action.payload, };
    case SAVE_COLLECTION_REJECTED: 
      return { ...state, saving: false, fetching: false, error: action.payload };
    case FETCH_COLLECTION_REJECTED: return { ...state, error: action.payload, fetching: false };
    case FETCH_COLLECTION_FULFILLED: 
      localStorage.setItem("uuid", action.payload.uuid);
      return { ...state, fetching: false, fetched: true, error: false, name: action.payload.name, uuid: action.payload.uuid };
    case FETCH_COLLECTIONS_FULFILLED: return { ...state, fetching: false, items: action.payload };
    case FETCH_COLLECTIONS: return { ...state, fetching: true };
    case FETCH_COLLECTION: return { ...state, fetching: true };
    case CLEAR_FETCHED: return { ...state, fetched: false };
    default:
      return state;
  }
}
