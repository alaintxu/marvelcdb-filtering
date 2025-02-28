import { combineReducers } from 'redux';
import paginationReducer from './pagination';
import otherReducer from './other';
import filtersReducer from './filters';

export default combineReducers({
    pagination: paginationReducer,
    other: otherReducer,
    filters: filtersReducer
});