export const loadState = () => {
  try { 
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined
    }
    // return JSON.parse(serializedState)
    const state = JSON.parse(serializedState)
    console.log(state)
    if (!Object.keys(state.visibility.visibilityMap).length && state.words.items.length) {
      const visibilityMap = state.words.items.reduce((visibilityMap, e) => (visibilityMap[e.word] = 'show', visibilityMap), {})
      state.visibility.visibilityMap = visibilityMap
    }
    
    return state
  } catch (err) {
    console.log(err)
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state', serializedState)
  } catch (err) {
    console.log(err)
  }
}
