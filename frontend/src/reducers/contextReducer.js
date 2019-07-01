import { MENU_OPEN, MENU_CLOSE } from '../actions/types';

const initialState = {
  menuOpen: 0,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MENU_OPEN: return { ...state, menuOpen: true };
    case MENU_CLOSE: return { ...state, menuOpen: false };
    default:
      return state;
  }
}

