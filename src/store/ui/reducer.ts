import { combineReducers } from 'redux';
import paginationReducer from './pagination';
import packStatusReducer from './packsStatus';
import otherReducer from './other';
import filtersReducer from './filters';

export default combineReducers({
    pagination: paginationReducer,
    packStatusDict: packStatusReducer,
    other: otherReducer,
    filters: filtersReducer
});