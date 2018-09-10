import { SAVE_COLLECTION, SAVE_COLLECTION_REJECTED, SAVE_COLLECTION_FULFILLED } from '../actions/types';

const initialState = {
  saving: false,
  saved: false,
  error: null
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
                                           };
    case SAVE_COLLECTION_REJECTED: return {...state, saving: false, error: action.payload};
    default:
      return state;
  }
}
