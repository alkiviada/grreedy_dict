import { SWITCH_TAB } from '../actions/types';

const initialState = {
  mapTabIndex: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SWITCH_TAB: return { ...state, mapTabIndex: action.payload };
    default:
      return state;
  }
}

