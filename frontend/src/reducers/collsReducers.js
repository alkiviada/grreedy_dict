import { 
        FETCH_COLLECTION_REJECTED, 
        FETCH_COLLECTION_FULFILLED, 
        SAVE_COLLECTION, 
        SAVE_COLLECTION_REJECTED, 
        SAVE_COLLECTION_FULFILLED, 
        FETCH_COLLECTIONS, 
        FETCH_COLLECTIONS_FULFILLED 
       } from '../actions/types';

const initialState = {
  saving: false,
  saved: false,
  error: null,
  name: '',
  uuid: '',
  fetching: false,
  items: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SAVE_COLLECTION: return { ...state, 
                                   saving: true, 
                                 };
    case SAVE_COLLECTION_FULFILLED: return { ...state, 
                                             saving: false, 
                                             error: null, 
                                             saved: true,
                                             items: action.payload,
                                           };
    case SAVE_COLLECTION_REJECTED: return { ...state, saving: false, error: action.payload };
    case FETCH_COLLECTION_REJECTED: return { ...state, error: action.payload };
    case FETCH_COLLECTION_FULFILLED: return { ...state, name: action.payload.name, uuid: action.payload.uuid };
    case FETCH_COLLECTIONS_FULFILLED: return { ...state, fetching: false, items: action.payload };
    case FETCH_COLLECTIONS: return { ...state, fetching: true };
    default:
      return state;
  }
}
