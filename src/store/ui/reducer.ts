import { combineReducers } from 'redux';
import paginationReducer from './pagination';
import otherReducer from './other';
import filtersReducer from './filters';
import selectedPacksReducer from './selectedPacks';

export default combineReducers({
    pagination: paginationReducer,
    other: otherReducer,
    filters: filtersReducer,
    selectedPacks: selectedPacksReducer
});