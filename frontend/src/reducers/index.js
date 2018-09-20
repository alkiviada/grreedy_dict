import {combineReducers} from "redux";

import wordsReducer from "./wordsReducers";
import transReducer from "./transReducers";
import collsReducer from "./collsReducers";
import collocationsReducer from "./collocationsReducers";
import auth from "./authReducers";
import tabReducer from "./tabReducers";

export default combineReducers({
  words: wordsReducer,
  translations: transReducer,
  tabs: tabReducer,
  collections: collsReducer,
  collocations: collocationsReducer,
  auth: auth
});
