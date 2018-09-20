import { FETCH_COLLOCATIONS, FETCH_COLLOCATIONS_REJECTED, FETCH_COLLOCATIONS_FULFILLED, } from '../actions/types';

const initialState = {
  allCollocations: {},
  fetchingMap: {},
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_COLLOCATIONS: return { ...state, fetchingMap: action.payload };
    case FETCH_COLLOCATIONS_FULFILLED: return { ...state, 
                                                allCollocations: action.payload.allCollocations,  
                                                fetchingMap: action.payload.fetchingMap,  
                                             };
    case FETCH_COLLOCATIONS_REJECTED: return {...state, 
                                              allCollocations: action.payload.allCollocations, 
                                              fetchingMap: action.payload.fetchingMap,  
                                              error: 'Cannot load collocations'
                                            };
    default:
      return state;
  }
}
