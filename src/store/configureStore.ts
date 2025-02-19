import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';

const store = configureStore({
    reducer: reducer,
    devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;