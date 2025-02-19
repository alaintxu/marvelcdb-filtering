import { combineReducers } from 'redux';
import paginationReducer from './pagination';
import packStatusReducer from './packsStatus';
import showPackListReducer from './showPackList';
import selectedNavigationOptionKeyReducer from './selectedNavigationOptionKey';

export default combineReducers({
    pagination: paginationReducer,
    packStatusDict: packStatusReducer,
    showPackList: showPackListReducer,
    selectedNavigationOptionKey: selectedNavigationOptionKeyReducer,
});