import { MENU_OPEN, MENU_CLOSE } from './types';

export const openMenu = () => (dispatch, getState) => {
  console.log('opening')
  dispatch({
    type: MENU_OPEN,
  })
};

export const closeMenu = () => (dispatch, getState) => {
  console.log('closing')
  dispatch({
    type: MENU_CLOSE,
  })
};


