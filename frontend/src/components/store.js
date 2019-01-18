import {applyMiddleware, createStore, compose} from "redux";
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
    collections: store.getState().collections,
    auth: store.getState().auth,
    words: store.getState().words,
    visibility: store.getState().visibility
  });
}, 1000));

export default store;
