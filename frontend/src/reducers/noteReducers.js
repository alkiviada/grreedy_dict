import { FETCH_NOTE, 
         FETCH_NOTE_REJECTED, 
         FETCH_NOTE_FULFILLED, 
         CLEAR_FETCHED_NOTE, 
         POST_NOTE 
       } from '../actions/types';

const initialState = {
  allNotes: {},
  fetchingMap: {},
  fetchedNote: false,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_NOTE: return { ...state, fetchingMap: action.payload };
    case FETCH_NOTE_FULFILLED: return { ...state, 
                                        fetchedNote: true,
                                        allNotes: action.payload.allNotes,  
                                        fetchingMap: action.payload.fetchingMap,  
                                       };
    case FETCH_NOTE_REJECTED: return { ...state, 
                                       allNotes: action.payload.allNotes, 
                                       fetchingMap: action.payload.fetchingMap,  
                                       error: 'Cannot load notes',
                                       fetchedNote: false
                                     };
    case CLEAR_FETCHED_NOTE: return { ...state, fetchedNote: false };
    default:
      return state;
  }
}

