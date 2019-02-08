import { 
         FETCH_VERBS, 
         FETCH_VERB, 
         FETCH_VERBS_FULFILLED, 
         FETCH_VERB_FULFILLED, 
         FETCH_VERBS_REJECTED, 
         FETCH_VERB_REJECTED, 
       } from '../actions/types';

const initialState = {
  verbs: [],
  verb: '',
  language: '',
  verbsFetching: false,
  verbFetching: false,
  verbsFetched: false,
  verbFetched: false,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_VERBS: return { ...state, 
                               verbsFetching: true, 
                             };
    case FETCH_VERB: return { ...state, 
                               verbFetching: true, 
                               verb: action.payload.verb, 
                               language: action.payload.language, 
                             };
    case FETCH_VERB_FULFILLED: return { ...state, 
                                         verbFetching: false, 
                                         error: null, 
                                         verbFetched: true,
                                         verb: action.payload.verb, 
                                         language: action.payload.language, 
                                       };
    case FETCH_VERBS_FULFILLED: return { ...state, 
                                         verbsFetching: false, 
                                         error: null, 
                                         verbsFetched: true,
                                         verbs: action.payload, 
                                       };
    case FETCH_VERB_REJECTED: return { ...state, verbFetching: false, 
                                        error: action.payload, 
                                      };
    case FETCH_VERBS_REJECTED: return { ...state, verbsFetching: false, 
                                        error: action.payload, 
                                      };
    default:
      return state;
  }
}

