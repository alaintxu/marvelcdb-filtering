import { combineReducers } from 'redux';
import paginationReducer from './pagination';
import packStatusReducer from './packsStatus';
import showPackListReducer from './showPackList';

export default combineReducers({
    pagination: paginationReducer,
    packStatusDict: packStatusReducer,
    showPackList: showPackListReducer,
});