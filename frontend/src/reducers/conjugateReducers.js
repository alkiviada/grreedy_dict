import { FETCH_CONJUGATE, FETCH_CONJUGATE_REJECTED, FETCH_CONJUGATE_FULFILLED } from '../actions/types';

const initialState = {
  allConjugations: {},
  fetchingMap: {},
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_CONJUGATE: return { ...state, fetchingMap: action.payload };
    case FETCH_CONJUGATE_FULFILLED: return { ...state, 
                                             allConjugations: action.payload.allConjugations,  
                                             fetchingMap: action.payload.fetchingMap,  
                                           };
    case FETCH_CONJUGATE_REJECTED: return {...state, 
                                           allConjugations: action.payload.allConjugations, 
                                           fetchingMap: action.payload.fetchingMap,  
                                           error: 'Cannot load conjugation'
                                          };
    default:
      return state;
  }
}
