import { FETCH_PRONOUNCE, FETCH_PRONOUNCE_REJECTED, FETCH_PRONOUNCE_FULFILLED } from '../actions/types';

const initialState = {
  allPronunciations: {},
  fetchingMap: {},
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRONOUNCE: return { ...state, fetchingMap: action.payload };
    case FETCH_PRONOUNCE_FULFILLED: return { ...state, 
                                             allPronunciations: action.payload.allPronunciations,  
                                             fetchingMap: action.payload.fetchingMap,  
                                           };
    case FETCH_PRONOUNCE_REJECTED: return {...state, 
                                           allPronunciations: action.payload.allPronunciations, 
                                           fetchingMap: action.payload.fetchingMap,  
                                           error: 'Cannot load pronunciations'
                                          };
    default:
      return state;
  }
}
