import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import reducer from './reducer';
import api from './middleware/api';
import { persistenceMiddleware } from './middleware/persistence';

export const createStore = (preloadedState?: any):EnhancedStore => configureStore({
    reducer: reducer,
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(api, persistenceMiddleware.middleware),
    preloadedState
});

const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// export interface StoreType {
//     dispatch: any;
//     getState(): RootState;
// }

export default store;