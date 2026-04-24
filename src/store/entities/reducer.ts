import { combineReducers } from "redux";

import cardsReducer from "./cards";
import packsReducer from "./packs";
import decksReducer from "./decks";
import cardSetsReducer from "./cardSets";
import factionsReducer from "./factions";
import cardTypesReducer from "./cardTypes";

export default combineReducers({
    cards: cardsReducer,
    packs: packsReducer,
    decks: decksReducer,
    cardSets: cardSetsReducer,
    cardTypes: cardTypesReducer,
    factions: factionsReducer,
});