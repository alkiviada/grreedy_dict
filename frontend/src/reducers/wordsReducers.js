import { FETCH_WORDS, FETCH_WORDS_FULFILLED, FETCH_WORDS_REJECTED, FETCH_WORD, FETCH_WORD_FULFILLED, FETCH_TRANSLATION, SWITCH_TAB } from '../actions/types';

const initialState = {
  items: [],
  item: {},
  allTranslations: {},
  translations: {},
  allWordsMap: {},
  mapTabIndex: {},
  newWordFetching: false,
  allWordsFetching: false,
  newWordFetched: false,
  allWordsFetched: false,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_WORDS: return { ...state, 
                               allWordsFetching: true, 
                             };
    case FETCH_WORD: return { ...state, 
                               newWordFetching: true, 
                             };
    case FETCH_WORDS_FULFILLED: return { ...state, 
                                         allWordsFetching: false, 
                                         error: null, 
                                         allWordsFetched: true,
                                         items: action.payload, 
                                         allWordsMap: { ...action.payload.map(e => e.word).reduce((o, e) => (o[e] = 1, o), {}) } 
                                       };
    case FETCH_WORD_FULFILLED: return { ...state, 
                                         newWordFetching: false, 
                                         error: null, 
                                         newWordFetched: true,
                                         items: action.payload, 
                                         allWordsMap: { ...action.payload.map(e => e.word).reduce((o, e) => (o[e] = 1, o), {}) } 
                                       };
    case FETCH_WORDS_REJECTED: return {...state, allWordsfetching: false, newWordFetching: false, error: action.payload};
    case SWITCH_TAB: return { ...state, mapTabIndex: action.payload };
    case FETCH_TRANSLATION: return { ...state, allTranslations: action.payload };
    default:
      return state;
  }
}

