import { configureStore } from '@reduxjs/toolkit';
import packsReducer from './packs';
import cardsReducer from './cards';
import paginationReducer from './pagination';

const store = configureStore({
    reducer: {
        packs: packsReducer,
        cards: cardsReducer,
        pagination: paginationReducer,
    },
    devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;