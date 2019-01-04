import { 
         FETCH_CONJUGATIONS, 
         FETCH_CONJUGATIONS_FULFILLED, 
         FETCH_CONJUGATIONS_REJECTED, 
       } from '../actions/types';

const initialState = {
  items: [],
  conjugsFetching: false,
  conjugsFetched: false,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_CONJUGATIONS: return { ...state, 
                               conjugsFetching: true, 
                             };
    case FETCH_CONJUGATIONS_FULFILLED: return { ...state, 
                                         conjugsFetching: false, 
                                         error: null, 
                                         conjugsFetched: true,
                                         items: action.payload, 
                                       };
    case FETCH_CONJUGATIONS_REJECTED: return { ...state, conjugsFetching: false, 
                                        error: action.payload, 
                                      };
    default:
      return state;
  }
}
