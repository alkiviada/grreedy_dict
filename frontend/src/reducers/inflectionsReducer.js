import { FETCH_INFLECTIONS, FETCH_INFLECTIONS_REJECTED, FETCH_INFLECTIONS_FULFILLED } from '../actions/types';

const initialState = {
  allInflections: {},
  fetchingMap: {},
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_INFLECTIONS: return { ...state, fetchingMap: action.payload };
    case FETCH_INFLECTIONS_FULFILLED: return { ...state, 
                                             allInflections: action.payload.allInflections,  
                                             fetchingMap: action.payload.fetchingMap,  
                                           };
    case FETCH_INFLECTIONS_REJECTED: return {...state, 
                                           allInflections: action.payload.allInflections, 
                                           fetchingMap: action.payload.fetchingMap,  
                                           error: 'Cannot load inflections'
                                          };
    default:
      return state;
  }
}
