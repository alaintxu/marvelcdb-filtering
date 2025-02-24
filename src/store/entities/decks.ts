import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';
import { getFromLocalStorage } from '../../LocalStorageHelpers';
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

const convertDeckToMarvelDeck = (deck: Deck/*, t?: TFunction*/): MarvelDeck => {
    // @ToDo: Think how to solve the issue with t
    //const base_path = t('base_path');
    const base_path = 'https://es.marvelcdb.com';
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
        deckAdded: (state, action: PayloadAction<MarvelDeck>) => {
            const deck: MarvelDeck = action.payload;
            slice.caseReducers.deckRemoved(state, {
                type: slice.actions.deckRemoved.type,
                payload: deck.id
            });
            state.decks[deck.id] = deck;
            return state;
        },
        deckRemoved: (state, action: PayloadAction<number>) => {
            const deck_id: number = action.payload;
            delete state.decks[deck_id];
            return state;
        },
        deckDownloading: (state) => {
            state.isDeckLoading = true;
            return state;
        },
        /*deckCurrentAdded: (state, action: PayloadAction<MarvelDeck>) => {
            const deck: MarvelDeck = action.payload;
            slice.caseReducers.deckRemoved(state, {
                type: slice.actions.deckRemoved.type,
                payload: deck.id
            })
            slice.caseReducers.deckAdded(state, {
                type: slice.actions.deckAdded.type,
                payload: deck
            });
            slice.caseReducers.deckCurrentSet(state, {
                type: slice.actions.deckCurrentSet.type,
                payload: deck
            });
            return state;
        },*/
        deckCurrentRemoved: (state) => {
            state.currentDeck = null;
            return state;
        },
        deckCurrentSet: (state, action: PayloadAction<MarvelDeck>) => {
            const deck: MarvelDeck = action.payload;
            state.currentDeck = deck;
            return state;
        },
        deckError: (state, action: PayloadAction<string>) => {
            state.deckError = action.payload;
            state.isDeckLoading = false;
            return state;
        },
        deckCurrentConvertAndSet: (state, action: PayloadAction<Deck>) => {
            console.log("Converting deck", action.payload);
            const marvelDeck: MarvelDeck = convertDeckToMarvelDeck(action.payload);
            slice.caseReducers.deckCurrentSet(state, {
                type: slice.actions.deckCurrentSet.type,
                payload: marvelDeck,
            });
            state.isDeckLoading = false;
            state.deckError = "";
            return state;
        },
        deckCurrentSetFromList: (state, action: PayloadAction<number>) => {
            const deck_id: number = action.payload;
            state.currentDeck = state.decks[deck_id] || null;
            return state;
        },
    }
});

/* Export reducer */
export default slice.reducer;
export const { 
    deckAdded, 
    deckRemoved, 
    deckCurrentRemoved, 
    deckCurrentSet, 
    deckCurrentConvertAndSet, 
    deckCurrentSetFromList,
    deckDownloading,
    deckError,
} = slice.actions;

/* Actions */
export const loadDeck = (deckId: number) => apiCallBegan({
    url: `/decklist/${deckId}`,
    onSuccess: deckCurrentConvertAndSet.type,
    onError: deckError.type,
    onStart: deckDownloading.type,
})

/* Selectors */

export type DeckSliceState = ReturnType<typeof slice.reducer>;

export const selectDeckSlice = (rootState: RootState) => rootState.entities.decks;

export const selectIsDeckDownloading = createSelector(
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

export const selectIsCurrentInList = createSelector(
    selectCurrentDeckId,
    selectAllDeckIds,
    (currentDeckId, decks) => currentDeckId ? decks.includes(currentDeckId) : false
);

export const selectIsDeckInList = (deckId: number) => createSelector(
    selectAllDeckIds,
    (deckIds) => deckIds.includes(deckId)
);