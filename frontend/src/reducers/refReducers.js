import { MAP_REF, MAP_OFFSET, SET_ALL_DATA_REF } from '../actions/types';

const initialState = {
  refMap: {},
  offsetMap: {},
  allDataRef: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MAP_REF: return { ...state, refMap: action.payload };
    case MAP_OFFSET: return { ...state, offsetMap: action.payload };
    case SET_ALL_DATA_REF: return { ...state, allDataRef: action.payload };
    default:
      return state;
  }
}

