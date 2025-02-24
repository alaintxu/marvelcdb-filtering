import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';
import { getFromLocalStorage } from '../../LocalStorageHelpers';
import i18n from 'i18next';
import { apiCallBegan } from '../api';

export const LOCAL_STORAGE_DECKS_KEY = "decks_favourites";

/* The one from MarvelCDB */
export interface Deck {
    id: number,
    name: string,
    date_creation: string,
    date_update: string,
    description_md: string,
    user_id: 21328,
    hero_code: string;
    hero_name: string;
    investigator_code: string,
    investigator_name: string,
    slots: {
        [key: string]: number
    },
    ignoreDeckLimitSlots: {
        [key: string]: number
    },
    version: number,
    meta: string,
    tags: string,
}

/* The one for local */
export interface MarvelDeck extends Omit<Deck, 'investigator_code' | 'investigator_name' | 'tags'> {
    aspect: string | undefined,
    tags_str: string,
    tags: string[],
}

export type MarvelDecksDict = {
    [deck_id: number]: MarvelDeck;
}

const convertDeckToMarvelDeck = (deck: Deck): MarvelDeck => {
    const base_path = i18n.t('base_path', {ns: 'global'});

    const { investigator_code, investigator_name, description_md, hero_code, hero_name, ...rest } = deck;

    let aspect: string | undefined = undefined;
    try {
        const metaJson = JSON.parse(deck.meta);
        aspect = metaJson.aspect;
    } catch (e) {
        console.error(`Error parsing meta for deck ${deck.id}`, e);
    }

    return {
        ...rest, 
        hero_code: hero_code || investigator_code, 
        hero_name: hero_name || investigator_name,
        description_md: description_md
            .replace(/]\(\/card\/(\w+)\)/g, `](${base_path}/card/$1)`)
            .replace(/<img.*?src=['"](.*?)['"].*?>/gs, '![]($1)'),
        aspect: aspect, 
        tags_str: deck.tags, 
        tags: deck.tags.split(', ')
    };
}

/* Slice */
const slice = createSlice({
    name: 'decks',
    initialState: {
        currentDeck: null as MarvelDeck | null,
        deckError: "" as string,
        isDeckLoading: false as boolean,
        decks: getFromLocalStorage<MarvelDecksDict>(LOCAL_STORAGE_DECKS_KEY) || {} as MarvelDecksDict,
    },
    reducers: {
        // Actions
        removeCurrentDeck: (state) => {
            state.currentDeck = null;
            return state;
        },
        setCurrentDeck: (state, action: PayloadAction<number>) => {
            const deck_id: number = action.payload;
            state.currentDeck = state.decks[deck_id] || null;
            return state;
        },
        bookmarkCurrentDeck: (state) => {
            if (state.currentDeck) {
                state.decks[state.currentDeck.id] = state.currentDeck;
            }
            return state;
        },
        unbookmarkDeck: (state, action: PayloadAction<number>) => {
            const deck_id: number = action.payload;
            if (state.decks[deck_id]) {
                state.currentDeck = state.decks[deck_id] || null;
                delete state.decks[deck_id];
            }
            return state;
        },
        // Events
        deckRequested: (state) => {
            state.isDeckLoading = true;
            return state;
        },
        deckRequestFailed: (state, action: PayloadAction<string>) => {
            state.deckError = action.payload;
            state.isDeckLoading = false;
            return state;
        },
        deckReceived: (state, action: PayloadAction<Deck>) => {
            console.log("Converting deck", action.payload);
            const marvelDeck: MarvelDeck = convertDeckToMarvelDeck(action.payload);
            state.currentDeck = marvelDeck;
            state.isDeckLoading = false;
            state.deckError = "";
            return state;
        },
    }
});

/* Export reducer */
export default slice.reducer;
export const { 
    removeCurrentDeck,
    setCurrentDeck,
    bookmarkCurrentDeck,
    unbookmarkDeck,
} = slice.actions;  // Export commands

const {
    deckReceived,
    deckRequested,
    deckRequestFailed,
} = slice.actions;  // Do not export events

/* Actions */
export const loadDeck = (deckId: number) => apiCallBegan({
    url: `/decklist/${deckId}`,
    onSuccess: deckReceived.type,
    onError: deckRequestFailed.type,
    onStart: deckRequested.type,
}); // No cache

/* Selectors */
export const selectDeckSlice = (rootState: RootState) => rootState.entities.decks;

export const selectIsDeckLoading = createSelector(
    selectDeckSlice,
    (state) => state.isDeckLoading
);

export const selectDeckError = createSelector(
    selectDeckSlice,
    (state) => state.deckError
);

export const selectCurrentDeck = createSelector(
    selectDeckSlice,
    (state) => state.currentDeck
);
export const selectCurrentDeckId = createSelector(
    selectCurrentDeck,
    (currentDeck) => currentDeck?.id
)

export const selectAllDecks = createSelector(
    selectDeckSlice,
    (state) => state.decks
);
export const selectAllDeckIds = createSelector(
    selectAllDecks,
    (decks) => Object.keys(decks).map(Number)
);

export const selectDeckById = (deck_id: number) => createSelector(
    selectAllDecks,
    (decks) => decks[deck_id]
);

export const selectIsDeckInList = (deckId: number) => createSelector(
    selectAllDeckIds,
    (deckIds) => deckIds.includes(deckId)
);

export const selectIsCurrentInList = createSelector(
    selectCurrentDeckId,
    selectAllDeckIds,
    (currentDeckId, decks) => currentDeckId ? decks.includes(currentDeckId) : false
);