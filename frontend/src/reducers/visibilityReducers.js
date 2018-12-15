import { SWITCH_VISIBILITY } from '../actions/types';

const initialState = {
  visibilityMap: {},
};

export default function(state = initialState, action) {
  console.log(action.payload)
  switch (action.type) {
    case SWITCH_VISIBILITY: return { ...state, visibilityMap: action.payload };
    default:
      return state;
  }
}

