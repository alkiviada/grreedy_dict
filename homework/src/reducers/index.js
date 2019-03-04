import { combineReducers } from "redux";

import verbsReducer from "./verbsReducers";
import conjugsReducer from "./conjugsReducers";
import conjugsHomeworkReducer from "./conjugsHomeworkReducers";
import wordsReducer from "./wordsReducers";
import tensesReducer from "./tensesReducers";
import synonymsReducer from "./synonymsReducers";

export default combineReducers({
  verbs: verbsReducer,
  tenses: tensesReducer,
  words: wordsReducer,
  conjugs: conjugsReducer,
  conjugsHomework: conjugsHomeworkReducer,
  synonyms: synonymsReducer,
});

