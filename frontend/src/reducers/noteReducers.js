import { FETCH_NOTE, 
         FETCH_NOTE_REJECTED, 
         FETCH_NOTE_FULFILLED, 
         CLEAR_FETCHED, 
         POST_NOTE 
       } from '../actions/types';

const initialState = {
  allNotes: {},
  fetchingMap: {},
  fetched: false,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_NOTE: return { ...state, fetchingMap: action.payload };
    case FETCH_NOTE_FULFILLED: return { ...state, 
                                        allNotes: action.payload.allNotes,  
                                        fetchingMap: action.payload.fetchingMap,  
                                       };
    case FETCH_NOTE_REJECTED: return { ...state, 
                                       allNotes: action.payload.allNotes, 
                                       fetchingMap: action.payload.fetchingMap,  
                                       error: 'Cannot load notes'
                                     };
    case CLEAR_FETCHED: return { ...state, fetched: false };
    default:
      return state;
  }
}

