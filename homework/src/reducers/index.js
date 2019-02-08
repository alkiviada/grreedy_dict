import { combineReducers } from "redux";

import verbsReducer from "./verbsReducers";
import conjugsReducer from "./conjugsReducers";
import conjugsHomeworkReducer from "./conjugsHomeworkReducers";

export default combineReducers({
  verbs: verbsReducer,
  conjugs: conjugsReducer,
  conjugsHomework: conjugsHomeworkReducer,
});

