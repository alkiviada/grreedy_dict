import { MAP_REF, MAP_OFFSET } from './types';

export const wordRefToMap = (word, wref) => (dispatch, getState) => {
  console.log('logging ref');
  const { refMap } = getState().refs
  dispatch({
    type: MAP_REF,
    payload: { ...refMap, ...{ [word]: wref } }
  })
};

export const logWordDivOffset = (word, offset) => (dispatch, getState) => {
  console.log('logging offset');
  const { offsetMap } = getState().refs
  dispatch({
    type: MAP_OFFSET,
    payload: { ...offsetMap, ...{ [word]: offset } }
  })
};

