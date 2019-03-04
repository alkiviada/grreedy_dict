import { 
         FETCH_TENSES_FULFILLED, 
         FETCH_TENSES_REJECTED, 
       } from '../actions/types';

const initialState = {
  verbTensesMap: {},
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_TENSES_FULFILLED: return { ...state, 
                                         error: null, 
                                         verbTensesMap: action.payload, 
                                       };
    case FETCH_TENSES_REJECTED: return { ...state,  
                                        error: action.payload, 
                                      };
    default:
      return state;
  }
}
