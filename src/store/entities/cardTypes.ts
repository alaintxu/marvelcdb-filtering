import { createSelector, createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../configureStore';
import { apiCallBegan } from "../api";
import i18n from "../../i18n";

export type CardType = {
    code: string;
    name: string;
}

export type CardTypeTranslation = Pick<CardType, "code" | "name">;

export type CardTypeSliceState = {
    list: CardType[];
    loading: boolean;
    lastFetch: number;
    error: string | null;
}

const initialState: CardTypeSliceState = {
    list: [],
    loading: false,
    lastFetch: 0,
    error: null,
};

/* Reducer */
const slice = createSlice({
    name: 'cardTypes',
    initialState: initialState,
    reducers: {
        cardTypesRequested(state) {
            state.loading = true;
            state.error = null;
            return state;
        },
        cardTypesReceived(state, action: PayloadAction<CardType[]>) {
            state.list = action.payload;
            state.loading = false;
            state.lastFetch = Date.now();
            return state;
        },
        cardTypesRequestFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            return state;
        },
        cardTypesTranslationsReceived(state, action: PayloadAction<CardTypeTranslation[]>) {
            const translations: CardTypeTranslation[] = action.payload;
            for (let translation of translations) {
                const index = state.list.findIndex((type: CardType) => type.code === translation.code);
                if (index !== -1) {
                    state.list[index].name = translation.name;
                }
            }
            return state;
        },
        cardTypesTranslationsRequestFailed(state, action: PayloadAction<string>) {
            console.error(`Error loading card types translations for pack ${action.payload}`);
            return state;
        }
    }
});

/* Reducer export */
export default slice.reducer;
export const {
    cardTypesRequested,
    cardTypesReceived,
    cardTypesRequestFailed,
    cardTypesTranslationsReceived,
    cardTypesTranslationsRequestFailed
} = slice.actions;

/* Action creators */
export const loadCardTypes = () => async (dispatch: Dispatch) => {
    const afterSuccessDispatch = i18n.language === "en" ? undefined : translateCardTypes();
    return dispatch(
        apiCallBegan({
            url: "https://cdn.jsdelivr.net/gh/zzorba/marvelsdb-json-data@master/types.json",
            onStart: cardTypesRequested.type,
            onSuccess: cardTypesReceived.type,
            afterSuccessDispatch: afterSuccessDispatch,
            onError: cardTypesRequestFailed.type,
        })
    );
}

export const translateCardTypes = () => async (dispatch: Dispatch) => {
    return dispatch(
        apiCallBegan({
            url: `https://cdn.jsdelivr.net/gh/zzorba/marvelsdb-json-data@master/translations/${i18n.language}/types.json`,
            onSuccess: cardTypesTranslationsReceived.type,
            onError: cardTypesTranslationsRequestFailed.type,
        })
    );
}

/* Selectors */
export const selectCardTypesState = (state: RootState) => state.entities.cardTypes;
export const selectAllCardTypes = createSelector(
     selectCardTypesState,
     (cardTypesState: CardTypeSliceState) => cardTypesState.list
 );

export const selectNumberOfCardTypes = createSelector(
    selectAllCardTypes,
    (cardTypes: CardType[]) => cardTypes.length
);


export const selectCardTypeOptions = createSelector(
    selectAllCardTypes,
    (cardTypes: CardType[]) => cardTypes.map((type: CardType) => ({ value: type.code, label:type.name }))
);

export const selectCardTypeByCode = (code: string) => createSelector(
    selectAllCardTypes,
    (cardTypes: CardType[]) => cardTypes.find((type: CardType) => type.code === code)
);