import { combineReducers, createStore } from 'redux';
// import { devToolsEnhancer } from 'redux-devtools-extension';
import { devToolsEnhancer } from '@redux-devtools/extension';
import packsReducer from './packs';
import cardsReducer from './cards';

const rootReducer = combineReducers({
    packs: packsReducer,
    cards: cardsReducer
});

export default function configureStore() {
    const store = createStore(
        rootReducer,
        // devToolsEnhancer()
        //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        devToolsEnhancer({
            trace: true,
        })
    );
    return store;
}