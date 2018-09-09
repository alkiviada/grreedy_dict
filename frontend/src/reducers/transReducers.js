import { FETCH_TRANSLATION, FETCH_TRANSLATION_REJECTED, FETCH_TRANSLATION_FULFILLED, SWITCH_TAB } from '../actions/types';

const initialState = {
  allTranslations: {},
  translations: {},
  mapTabIndex: {},
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SWITCH_TAB: return { ...state, mapTabIndex: action.payload };
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

