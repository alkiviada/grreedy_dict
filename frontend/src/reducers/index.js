import {combineReducers} from "redux";

import wordsReducer from "./wordsReducers";

export default combineReducers({
  words: wordsReducer
});
