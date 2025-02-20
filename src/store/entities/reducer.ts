import { combineReducers } from "redux";

import cardsReducer from "./cards";
import packsReducer from "./packs";
import decksReducer from "./decks";

export default combineReducers({
    cards: cardsReducer,
    packs: packsReducer,
    decks: decksReducer,
});