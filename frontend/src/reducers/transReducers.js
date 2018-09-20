import { FETCH_TRANSLATION, FETCH_TRANSLATION_REJECTED, FETCH_TRANSLATION_FULFILLED } from '../actions/types';

const initialState = {
  allTranslations: {},
  fetchingMap: {},
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_TRANSLATION: return { ...state, fetchingMap: action.payload };
    case FETCH_TRANSLATION_FULFILLED: return { ...state, 
                                               allTranslations: action.payload.allTranslations,  
                                               fetchingMap: action.payload.fetchingMap,  
                                             };
    case FETCH_TRANSLATION_REJECTED: return {...state, 
                                             allTranslations: action.payload.allTranslations, 
                                             fetchingMap: action.payload.fetchingMap,  
                                             error: 'Cannot load translation'
                                            };
    default:
      return state;
  }
}

