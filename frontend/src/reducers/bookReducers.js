import { 
  REGISTER_UUID,
  FETCH_PAGE,
  FETCH_PAGE_FULFILLED,
  FETCH_PAGE_REJECTED,

} from '../actions/types';

const initialState = {
  uuid: null,
  error: null,
  page: 0,
  ps: [],
  pageFetching: false,
  bookPageMap: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REGISTER_UUID: return { ...state, uuid: action.payload };
    case FETCH_PAGE: return { ...state, 
                               pageFetching: true, 
                               page: action.payload
                             };
    case FETCH_PAGE_FULFILLED: return { ...state, 
                                         pageFetching: false, 
                                         error: null, 
                                         pageFetched: true,
                                         ps: action.payload.ps, 
                                         bookPageMap: action.payload.bookPageMap
                                       };
    case FETCH_PAGE_REJECTED: return { ...state, 
                                        pageFetching: false, 
                                        error: action.payload.error, 
                                        page: action.payload.page
                                      };
    default:
      return state;
  }
}
