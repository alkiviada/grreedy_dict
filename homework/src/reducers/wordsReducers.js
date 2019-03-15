import { 
         FETCH_WORD, 
         REGISTER_UUID,
         FETCH_WORD_FULFILLED, 
         FETCH_WORD_REJECTED, 
         CLEAR_NEW_WORD_ERROR,
       } from '../actions/types';

const initialState = {
  words: [],
  word: '',
  uuid: '',
  wordFetching: false,
  wordFetched: false,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_WORD: return { ...state, 
                              word: action.payload, 
                              wordFetching: true, 
                             };
    case REGISTER_UUID: return { ...state, 
                              uuid: action.payload, 
                             };
    case FETCH_WORD_FULFILLED: return { ...state, 
                                        wordFetching: false, 
                                        error: null, 
                                        wordFetched: true,
                                        words: action.payload.words, 
                                        uuid: action.payload.uuid, 
                                      };
    case FETCH_WORD_REJECTED: return { ...state, wordFetching: false, 
                                        error: action.payload, 
                                      };
    case CLEAR_NEW_WORD_ERROR: return { ...state, 
                                         error: null
                                      };
    default:
      return state;
  }
}

