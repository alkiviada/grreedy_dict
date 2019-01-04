import { combineReducers } from "redux";

import verbsReducer from "./verbsReducers";
import conjugsReducer from "./conjugsReducers";

export default combineReducers({
  verbs: verbsReducer,
  conjugs: conjugsReducer,
});

