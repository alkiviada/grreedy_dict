import { SWITCH_TAB } from './types';

export const switchTab = (index, word, map) => dispatch => {
  console.log('switching tab');
  dispatch({
    type: SWITCH_TAB,
    payload: { ...map, ...{[word]: index} }
  })
};

