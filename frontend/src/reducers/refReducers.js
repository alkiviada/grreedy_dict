import { MAP_REF, MAP_OFFSET } from '../actions/types';

const initialState = {
  refMap: {},
  offsetMap: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MAP_REF: return { ...state, refMap: action.payload };
    case MAP_OFFSET: return { ...state, offsetMap: action.payload };
    default:
      return state;
  }
}

