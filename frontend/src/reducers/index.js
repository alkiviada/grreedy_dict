import {combineReducers} from "redux";

import wordsReducer from "./wordsReducers";
import transReducer from "./transReducers";
import collsReducer from "./collsReducers";

export default combineReducers({
  words: wordsReducer,
  translations: transReducer,
  collections: collsReducer,
});
