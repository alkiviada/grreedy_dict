import {combineReducers} from "redux";

import wordsReducer from "./wordsReducers";
import transReducer from "./transReducers";
import noteReducer from "./noteReducers";
import synonymsReducer from "./synonymsReducers";
import collsReducer from "./collsReducers";
import collocationsReducer from "./collocationsReducers";
import auth from "./authReducers";
import tabReducer from "./tabReducers";

export default combineReducers({
  words: wordsReducer,
  synonyms: synonymsReducer,
  translations: transReducer,
  tabs: tabReducer,
  collections: collsReducer,
  collocations: collocationsReducer,
  auth: auth,
  notes: noteReducer 
});
