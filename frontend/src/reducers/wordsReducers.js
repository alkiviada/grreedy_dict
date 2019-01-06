import { CLEAR_NEW_WORD_ERROR, 
         FETCH_WORDS, 
         FETCH_WORDS_FULFILLED, 
         FETCH_WORDS_REJECTED, 
         FETCH_WORD, 
         FETCH_WORD_FULFILLED 
       } from '../actions/types';

const initialState = {
  items: [],
  word: '',
  allWordsMap: {},
  newWordFetching: false,
  allWordsFetching: false,
  newWordFetched: false,
  allWordsFetched: false,
  error: null,
  page: 1,
  pageNext: 0,
  pagePrev: 0,
  allWordCount: 0,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_WORDS: return { ...state, 
                               allWordsFetching: true, 
                             };
    case CLEAR_NEW_WORD_ERROR: return { ...state, 
                                         error: null
                                      };
    case FETCH_WORD: return { ...state, 
                               newWordFetching: true, 
                             };
    case FETCH_WORDS_FULFILLED: return { ...state, 
                                         allWordsFetching: false, 
                                         error: null, 
                                         allWordsFetched: true,
                                         items: action.payload.words, 
                                         pagePrev: action.payload.pagePrev, 
                                         pageNext: action.payload.pageNext, 
                                         allWordCount: action.payload.allWordCount,
                                         allWordsMap: { ...action.payload.words.map(e => e.word).reduce((o, e) => (o[e] = 1, o), {}) } 
                                       };
    case FETCH_WORD_FULFILLED: return { ...state, 
                                         newWordFetching: false, 
                                         error: null, 
                                         newWordFetched: true,
                                         items: action.payload.words, 
                                         pageNext: action.payload.pageNext,
                                         allWordCount: action.payload.allWordCount,
                                         allWordsMap: { ...action.payload.words.map(e => e.word).reduce((o, e) => (o[e] = 1, o), {}) } 
                                       };
    case FETCH_WORDS_REJECTED: return { ...state, 
                                        allWordsFetching: false, 
                                        newWordFetching: false, 
                                        error: action.payload.error, 
                                        word: action.payload.word 
                                      };
    default:
      return state;
  }
}

