import { FETCH_CORPORA, FETCH_CORPORA_REJECTED, FETCH_CORPORA_FULFILLED } from '../actions/types';

const initialState = {
  allCorpora: {},
  end: false,
  fetchingMap: {},
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_CORPORA: return { ...state, fetchingMap: action.payload };
    case FETCH_CORPORA_FULFILLED: return { ...state, 
                                             allCorpora: action.payload.allCorpora,  
                                             fetchingMap: action.payload.fetchingMap,  
                                             end: action.payload.end,  
                                           };
    case FETCH_CORPORA_REJECTED: return {...state, 
                                           allCorpora: action.payload.allCorpora, 
                                           fetchingMap: action.payload.fetchingMap,  
                                           error: 'Cannot load corpora'
                                          };
    default:
      return state;
  }
}
