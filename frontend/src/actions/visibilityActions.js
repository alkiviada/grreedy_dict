import { SWITCH_VISIBILITY } from './types';

export const switchVisibility = (word) => (dispatch, getState) => {
  const { visibilityMap } = getState().visibility

  console.log('switching visibility');
  dispatch({
    type: SWITCH_VISIBILITY,
    payload: { ...visibilityMap, ...{ [word]: !visibilityMap[word] || visibilityMap[word] == 'hide' ? 'show' : 'hide' } }
  })
};
