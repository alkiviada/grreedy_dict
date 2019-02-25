import { FETCH_SYNONYMS, FETCH_SYNONYMS_REJECTED, FETCH_SYNONYMS_FULFILLED } from '../actions/types';

const initialState = {
  allSynonyms: {},
  fetchingMap: {},
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_SYNONYMS: return { ...state, fetchingMap: action.payload };
    case FETCH_SYNONYMS_FULFILLED: return { ...state, 
                                            allSynonyms: action.payload.allSynonyms,  
                                            fetchingMap: action.payload.fetchingMap,  
                                           };
    case FETCH_SYNONYMS_REJECTED: return {...state, 
                                             allSynonyms: action.payload.allSynonyms, 
                                             fetchingMap: action.payload.fetchingMap,  
                                             error: 'Cannot load synonyms'
                                            };
    default:
      return state;
  }
}
