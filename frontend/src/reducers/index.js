import {combineReducers} from "redux";

import wordsReducer from "./wordsReducers";
import transReducer from "./transReducers";

export default combineReducers({
  words: wordsReducer,
  translations: transReducer
});
