import { combineReducers } from "redux";

import cardsReducer from "./cards";
import packsReducer from "./packs";

export default combineReducers({
    cards: cardsReducer,
    packs: packsReducer,
});