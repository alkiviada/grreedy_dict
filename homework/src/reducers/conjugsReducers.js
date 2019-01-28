import { 
         FETCH_CONJUGATIONS, 
         FETCH_CONJUGATIONS_FULFILLED, 
         FETCH_CONJUGATIONS_REJECTED, 
         LOG_CONJUGATE_REFS,
         STORE_MY_CONJUGATIONS,
         LOG_TENSE_IDX,
       } from '../actions/types';

const initialState = {
  correctConjugs: [],
  myConjugs: [],
  conjugsFetching: false,
  conjugsFetched: false,
  myConjugsRefMap: {},
  error: null,
  tenseIdx: 0,
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
                                         correctConjugs: action.payload, 
                                       };
    case FETCH_CONJUGATIONS_REJECTED: return { ...state, conjugsFetching: false, 
                                        error: action.payload, 
                                      };
    case LOG_CONJUGATE_REFS: return { ...state, 
                                        myConjugsRefMap: action.payload, 
                                      };
    case STORE_MY_CONJUGATIONS: return { ...state, 
                                        myConjugs: action.payload, 
                                      };
    case LOG_TENSE_IDX: return { ...state, 
                                   tenseIdx: action.payload, 
                                 };
    default:
      return state;
  }
}
