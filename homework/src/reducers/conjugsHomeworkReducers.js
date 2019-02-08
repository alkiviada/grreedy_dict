import { 
         FETCH_HOMEWORK, 
         FETCH_HOMEWORK_FULFILLED, 
         FETCH_HOMEWORK_REJECTED, 
         LOG_HOMEWORK_REFS,
         STORE_MY_HOMEWORK_CONJUGATIONS,
         LOG_HOMEWORK_TENSE_IDX,
       } from '../actions/types';

const initialState = {
  correctConjugs: [],
  myConjugs: [],
  homeworkFetching: false,
  homeworkFetched: false,
  myConjugsRefs: [],
  error: null,
  tenseIdx: 0,
  homework: [],
  correct: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_HOMEWORK: return { ...state, 
                               homeworkFetching: true, 
                             };
    case FETCH_HOMEWORK_FULFILLED: return { ...state, 
                                         homeworkFetching: false, 
                                         error: null, 
                                         homeworkFetched: true,
                                         homework: action.payload.homework, 
                                         correct: action.payload.correct, 
                                       };
    case FETCH_HOMEWORK_REJECTED: return { ...state, homeworkFetching: false, 
                                        error: action.payload, 
                                      };
    case LOG_HOMEWORK_REFS: return { ...state, 
                                        myConjugsRefs: action.payload, 
                                      };
    case STORE_MY_HOMEWORK_CONJUGATIONS: return { ...state, 
                                        myConjugs: action.payload, 
                                      };
    case LOG_HOMEWORK_TENSE_IDX: return { ...state, 
                                   tenseIdx: action.payload, 
                                 };
    default:
      return state;
  }
}
