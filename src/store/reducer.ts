import { combineReducers } from 'redux';
import entitiesReducer from './entities/reducer';
import uiReducer from './ui/reducer';

export default combineReducers({
    entities: entitiesReducer,
    ui: uiReducer,
});
