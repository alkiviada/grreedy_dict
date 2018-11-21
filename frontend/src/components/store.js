import {applyMiddleware, createStore, compose} from "redux";
import { loadState, saveState } from '../reducers/localStorage'

import thunk from "redux-thunk";

import reducer from "../reducers";

const middleware = [thunk];

const persistedState = loadState()
console.log(persistedState);

const store = createStore(
  reducer,
  persistedState,
  compose(
    applyMiddleware(...middleware),
  )
);

store.subscribe(() => {
  saveState({
    collections: store.getState().collections,
    auth: store.getState().auth,
    words: store.getState().words
  })
})

export default store;

