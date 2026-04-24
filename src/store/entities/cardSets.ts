import { createSelector, createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../configureStore';
import { apiCallBegan } from "../api";
import i18n from "../../i18n";

export type CardSet = {
    code: string;
    name: string;
    card_set_type_code: string;
}



export type CardSetTranslation = Pick<CardSet, "code" | "name">;

export type CardSetSliceState = {
    list: CardSet[];
    loading: boolean;
    lastFetch: number;
    error: string | null;
}

const initialState: CardSetSliceState = {
    list: [],
    loading: false,
    lastFetch: 0,
    error: null,
};

/* Reducer */
const slice = createSlice({
    name: 'cardSets',
    initialState: initialState,
    reducers: {
        cardSetsRequested(state) {
            state.loading = true;
            state.error = null;
            return state;
        },
        cardSetsReceived(state, action: PayloadAction<CardSet[]>) {
            state.list = action.payload;
            state.loading = false;
            state.lastFetch = Date.now();
            return state;
        },
        cardSetsRequestFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            return state;
        },
        cardSetsTranslationsReceived(state, action: PayloadAction<CardSetTranslation[]>) {
            const translations: CardSetTranslation[] = action.payload;
            for (let translation of translations) {
                const index = state.list.findIndex((set: CardSet) => set.code === translation.code);
                if (index !== -1) {
                    state.list[index] = { ...state.list[index], ...translation };
                }
            }
            return state;
        },
        cardSetsTranslationsRequestFailed(state, action: PayloadAction<string>) {
            console.error(`Error loading card sets translations for pack ${action.payload}`);
            return state;
        }
    }
});

/* Reducer exports */
export default slice.reducer;
export const { 
    cardSetsRequested,
    cardSetsReceived,
    cardSetsRequestFailed,
    cardSetsTranslationsReceived,
    cardSetsTranslationsRequestFailed,
} = slice.actions;


/* Action creators */
export const loadCardSets = () => async (dispatch: Dispatch<any>) => {
    const afterSuccessDispatch = i18n.language === "en" ? undefined : translateSets();
    return dispatch(
        apiCallBegan({
            url: "https://cdn.jsdelivr.net/gh/zzorba/marvelsdb-json-data@master/sets.json",
            onStart: cardSetsRequested.type,
            onSuccess: cardSetsReceived.type,
            afterSuccessDispatch: afterSuccessDispatch,
            onError: cardSetsRequestFailed.type,
        })
    );
};

export const translateSets = () => async (dispatch: Dispatch<any>) => {
    return dispatch(
        apiCallBegan({
            url: `https://cdn.jsdelivr.net/gh/zzorba/marvelsdb-json-data@master/translations/${i18n.language}/sets.json`,
            onSuccess: cardSetsTranslationsReceived.type,
            onError: cardSetsTranslationsRequestFailed.type,
        })
    );
};

/* Selectors */
export const selectCardSetsState = (state: RootState) => state.entities.cardSets;
export const selectAllCardSets = createSelector(
    selectCardSetsState,
    (cardSetsState: CardSetSliceState) => cardSetsState.list
);

export const selectNumberOfCardSets = createSelector(
    selectAllCardSets,
    (cardSets: CardSet[]) => cardSets.length
);

export const selectCardSetByCode = (code: string) => createSelector(
    selectAllCardSets,
    (cardSets: CardSet[]) => cardSets.find((set: CardSet) => set.code === code)
);

export const selectAreCardSetsLoading = createSelector(
    selectCardSetsState,
    (cardSetsState: CardSetSliceState) => cardSetsState.loading
);

export const selectLastFetch = createSelector(
    selectCardSetsState,
    (cardSetsState: CardSetSliceState) => cardSetsState.lastFetch
);

export const selectCardSetError = createSelector(
    selectCardSetsState,
    (cardSetsState: CardSetSliceState) => cardSetsState.error
);

export const selectCardSetOptions = createSelector(
    selectAllCardSets,
    (cardSets: CardSet[]) => cardSets.map((set: CardSet) => ({ value: set.code, label: set.name }))
);

export const selectCardSetByType = (type: string) => createSelector(
    selectAllCardSets,
    (cardSets: CardSet[]) => cardSets.filter((set: CardSet) => set.card_set_type_code === type)
);

export const selectCardSetOptionsByType = (type: string) => createSelector(
    selectCardSetByType(type),
    (cardSets: CardSet[]) => cardSets.map((set: CardSet) => ({ value: set.code, label: set.name }))
);
