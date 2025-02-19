import { createSlice } from '@reduxjs/toolkit';

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

const slice = createSlice({
    name: 'decks',
    initialState: {
        selectedDeck: null as number | null,
        decks: [] as MarvelDeck[],
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
            state.decks.push(deck);
            return state;
        },
        deckRemoved: (state, action) => {
            const deck_id: number = action.payload;
            if(state.selectedDeck === deck_id) {
                state.selectedDeck = null;
            }
            state.decks = state.decks.filter((deck) => deck.id !== deck_id);
            return state;
        }
    }
});

export default slice.reducer;
export const { deckSelected, decksAdded, deckRemoved } = slice.actions;