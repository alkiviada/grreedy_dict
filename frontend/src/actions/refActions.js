import { MAP_REF, MAP_OFFSET, SET_ALL_DATA_REF } from './types';

export const wordRefToMap = (word, wref) => (dispatch, getState) => {
  const { refMap } = getState().refs
  dispatch({
    type: MAP_REF,
    payload: { ...refMap, ...{ [word]: wref } }
  })
};

export const logWordDivOffset = (word, offset) => (dispatch, getState) => {
  const { offsetMap } = getState().refs
  console.log(offset)
  console.log(word)
  dispatch({
    type: MAP_OFFSET,
    payload: { ...offsetMap, ...{ [word]: offset } }
  })
};

export const setAllDataRef = (ref) => (dispatch) => {
  dispatch({
    type: SET_ALL_DATA_REF,
    payload: ref
  })
};

