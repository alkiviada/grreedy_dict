import { combineReducers } from "redux";

import verbsReducer from "./verbsReducers";
import conjugsReducer from "./conjugsReducers";
import conjugsHomeworkReducer from "./conjugsHomeworkReducers";
import wordsReducer from "./wordsReducers";
import synonymsReducer from "./synonymsReducers";

export default combineReducers({
  verbs: verbsReducer,
  words: wordsReducer,
  conjugs: conjugsReducer,
  conjugsHomework: conjugsHomeworkReducer,
  synonyms: synonymsReducer,
});

