import { combineReducers } from "redux";

import wordsReducer from "./wordsReducers";
import corporaReducer from "./corporaReducers";
import transReducer from "./transReducers";
import noteReducer from "./noteReducers";
import synonymsReducer from "./synonymsReducers";
import pronounceReducer from "./pronounceReducers";
import conjugateReducer from "./conjugateReducers";
import collsReducer from "./collsReducers";
import collocationsReducer from "./collocationsReducers";
import auth from "./authReducers";
import tabReducer from "./tabReducers";
import visibilityReducer from "./visibilityReducers";
import refReducer from "./refReducers";
import context from "./contextReducer";

export default combineReducers({
  words: wordsReducer,
  synonyms: synonymsReducer,
  translations: transReducer,
  tabs: tabReducer,
  visibility: visibilityReducer,
  refs: refReducer,
  collections: collsReducer,
  collocations: collocationsReducer,
  auth: auth,
  context: context,
  notes: noteReducer,
  pronounce: pronounceReducer,
  conjugate: conjugateReducer,
  corpora: corporaReducer,
});

