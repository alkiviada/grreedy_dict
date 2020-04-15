import { CLEAR_NEW_WORD_ERROR, 
         CLEAR_FETCHED, 
         CLEAR_FETCHING, 
         FETCH_WORDS, 
         FETCH_WORDS_FULFILLED, 
         FETCH_WORDS_REJECTED, 
         FETCH_WORD, 
         FETCH_WORD_FULFILLED 
       } from '../actions/types';

const initialState = {
  words: [],
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
    case CLEAR_FETCHING: return { ...state, 
                                newWordFetched: true, 
                                newWordFetching: false,
                               };
    case CLEAR_FETCHED: return { ...state, 
                                newWordFetched: false, 
                               };
    case FETCH_WORD: return { ...state, 
                               newWordFetching: true, 
                               word: action.payload
                             };
    case FETCH_WORDS_FULFILLED: return { ...state, 
                                         allWordsFetching: false, 
                                         error: null, 
                                         allWordsFetched: true,
                                         words: action.payload.words, 
                                         pagePrev: action.payload.pagePrev, 
                                         pageNext: action.payload.pageNext, 
                                         allWordCount: action.payload.allWordCount,
                                         page: action.payload.page ? action.payload.page : state.page,
                                         allWordsMap: action.payload.allWordsMap
                                       };
    case FETCH_WORD_FULFILLED: return { ...state, 
                                        newWordFetching: false, 
                                        error: null, 
                                        newWordFetched: true,
                                        words: action.payload.words, 
                                        pageNext: action.payload.pageNext,
                                        pagePrev: action.payload.pagePrev ? action.payload.pagePrev: state.pagePrev,
                                        allWordCount: action.payload.allWordCount,
                                        page: action.payload.page ? action.payload.page : state.page,
                                        allWordsMap: action.payload.allWordsMap
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

