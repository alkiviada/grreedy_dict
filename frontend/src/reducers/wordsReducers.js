import { FETCH_WORDS, FETCH_WORD, FETCH_TRANSLATION, SWITCH_TAB } from '../actions/types';

const initialState = {
  items: [],
  item: {},
  allTranslations: {},
  translations: {},
  allWordsMap: {},
  mapTabIndex: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_WORDS: return { ...state, items: action.payload, allWordsMap: { ...action.payload.map(e => e.word).reduce((o, e) => (o[e] = 1, o), {}) } };
    case SWITCH_TAB: return { ...state, mapTabIndex: action.payload };
    case FETCH_TRANSLATION: return { ...state, allTranslations: action.payload };
    default:
      return state;
  }
}

