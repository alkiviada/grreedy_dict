import { 
  REGISTER_LESSON_ID,
  REQUEST_LESSON,
  POST_LESSON,
  FETCH_LESSON,
  FETCH_LESSON_REJECTED,
  FETCH_LESSON_FULFILLED,
  FETCH_WORK_FULFILLED,
  POST_LESSON_FULFILLED,
  POST_WORK_FULFILLED,
  POST_LESSON_REJECTED,
  POST_WORK_REJECTED,
  CLEAR_FETCHED_LESSON,
} from '../actions/types';

const initialState = {
  lessonId: null,
  fetching: 0,
  fetched: 0,
  error: null,
  text: '',
  work: '',
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REGISTER_LESSON_ID: return { ...state, lessonId: action.payload };
    case REQUEST_LESSON: return { ...state, fetching: 1 };
    case POST_LESSON: return { ...state, text: action.payload, fetching: 0 };
    case POST_LESSON_REJECTED: return { ...state, error: action.payload, fetching: 0 };
    case POST_LESSON_FULFILLED: return { ...state, text: action.payload, fetching: 0, fetched: 1 };
    case CLEAR_FETCHED_LESSON: return { ...state, fetched: 0 };
    case FETCH_LESSON: return { ...state, fetching: 1, fetched: 0 };
    case FETCH_LESSON_REJECTED: return { ...state, fetching: 0, fetched: 0, error: action.payload };
    case FETCH_LESSON_FULFILLED: return { ...state, fetching: 0, fetched: 1, ...action.payload };
    case FETCH_WORK_FULFILLED: return { ...state, fetching: 0, fetched: 1, ...action.payload };
    default:
      return state;
  }
}
