import { 
         FETCH_VERBS, 
         FETCH_VERBS_FULFILLED, 
         FETCH_VERBS_REJECTED, 
       } from '../actions/types';

const initialState = {
  items: [],
  verbsFetching: false,
  verbsFetched: false,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_VERBS: return { ...state, 
                               verbsFetching: true, 
                             };
    case FETCH_VERBS_FULFILLED: return { ...state, 
                                         verbsFetching: false, 
                                         error: null, 
                                         verbsFetched: true,
                                         items: action.payload, 
                                       };
    case FETCH_VERBS_REJECTED: return { ...state, verbsFetching: false, 
                                        error: action.payload, 
                                      };
    default:
      return state;
  }
}

