import { applyMiddleware, createStore, compose } from "redux";
import throttle from 'lodash/throttle'
import { loadState, saveState } from '../reducers/localStorage'

import thunk from "redux-thunk";

import reducer from "../reducers";

const middleware = [thunk];

const persistedState = loadState()

const store = createStore(
  reducer,
  persistedState,
  compose(
    applyMiddleware(...middleware),
  )
);

store.subscribe(throttle(() => {
  saveState({
    verbs: store.getState().verbs,
    dict: store.getState().dict,
  });
}, 1000));

export default store;
