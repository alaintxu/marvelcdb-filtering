import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';

// @ToDo: Use this to have a "favorite" deck list in the future?

export interface MarvelDeck {
    id: number;
    name: string;
    date_creation: string;
    date_update: string;
    description_md: string;
    user_id: 21328;
    hero_code: string;
    hero_name: string;
    slots: {
        [key: string]: number;
    };
    ignoreDeckLimitSlots: {
        [key: string]: number;
    };
    version: number;
    meta: string;
    aspect: string | undefined;
    tags_str: string;
    tags: string[];
}

export type MarvelDecksDict = {
    [deck_id: number]: MarvelDeck;
}

const slice = createSlice({
    name: 'decks',
    initialState: {
        selectedDeck: null as number | null,
        decks: {} as MarvelDecksDict,
    },
    reducers: {
        deckUnselected: (state) => {
            state.selectedDeck = null;
        },
        deckSelected: (state, action) => {
            const deck_id: number = action.payload;
            state.selectedDeck = deck_id;
            return state;
        },
        decksAdded: (state, action) => {
            const deck: MarvelDeck = action.payload;
            state.decks[deck.id] = deck;
            return state;
        },
        deckRemoved: (state, action) => {
            const deck_id: number = action.payload;
            if(state.selectedDeck === deck_id) {
                state.selectedDeck = null;
            }
            delete state.decks[deck_id];
            return state;
        }
    }
});

export const selectAllDecks = (state: RootState) => state.entities.decks.decks;
export const selectSelectedDeck = createSelector(
    (state: RootState) => state.entities.decks,
    (deckState) => {
        if(deckState.selectedDeck === null) return;
        return deckState.decks[deckState.selectedDeck];
    }
);
export const selectDeckById = (deck_id: number) => createSelector(
    (state: RootState) => state.entities.decks,
    (deckState) => deckState.decks[deck_id]
);

export default slice.reducer;
export const { deckSelected, decksAdded, deckRemoved } = slice.actions;