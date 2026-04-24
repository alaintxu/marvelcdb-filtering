import { createSelector, createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../configureStore';
import { apiCallBegan } from "../api";
import i18n from "../../i18n";

export type Faction = {
    code: string;
    is_primary: boolean;
    name: string;
    octgn_id: string;
}

export type FactionTranslation = Pick<Faction, "code" | "name">;

export type FactionSliceState = {
    list: Faction[];
    loading: boolean;
    lastFetch: number;
    error: string | null;
}

const initialState: FactionSliceState = {
    list: [],
    loading: false,
    lastFetch: 0,
    error: null,
};

/* Reducer */
const slice = createSlice({
    name: 'factions',
    initialState: initialState,
    reducers: {
        factionsRequested(state) {
            state.loading = true;
            state.error = null;
            return state;
        },
        factionsReceived(state, action: PayloadAction<Faction[]>) {
            state.list = action.payload;
            state.loading = false;
            state.lastFetch = Date.now();
            return state;
        },
        factionsRequestFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            return state;
        },
        factionsTranslationsReceived(state, action: PayloadAction<FactionTranslation[]>) {
            const translations: FactionTranslation[] = action.payload;
            for (let translation of translations) {
                const index = state.list.findIndex((faction: Faction) => faction.code === translation.code);
                if (index !== -1) {
                    state.list[index].name = translation.name;
                }
            }
            return state;
        },
        factionsTranslationsRequestFailed(state, action: PayloadAction<string>) {
            console.error(`Error loading factions translations: ${action.payload}`);
            return state;
        }
    }
});

/* Reducer export */
export default slice.reducer;
export const {
    factionsRequested,
    factionsReceived,
    factionsRequestFailed,
    factionsTranslationsReceived,
    factionsTranslationsRequestFailed,
} = slice.actions;

/* Action creators */
export const loadFactions = () => async (dispatch: Dispatch) => {
    const afterSuccessDispatch = i18n.language === "en" ? undefined : translateFactions();
    return dispatch(
            apiCallBegan({
                url: "https://cdn.jsdelivr.net/gh/zzorba/marvelsdb-json-data@master/factions.json",
                onStart: factionsRequested.type,
                onSuccess: factionsReceived.type,
                afterSuccessDispatch: afterSuccessDispatch,
                onError: factionsRequestFailed.type,
            }
        )
    );
}

export const translateFactions = () => async (dispatch: Dispatch) => {
    return dispatch(
        apiCallBegan({
            url: `https://cdn.jsdelivr.net/gh/zzorba/marvelsdb-json-data@master/translations/${i18n.language}/factions.json`,
            onSuccess: factionsTranslationsReceived.type,
            onError: factionsTranslationsRequestFailed.type,
        })
    );
}

/* Selectors */
export const selectFactionsState = (state: RootState) => state.entities.factions;
export const selectAllFactions = createSelector(
     selectFactionsState,
     (factionsState: FactionSliceState) => factionsState.list
 );
 export const selectNumberOfFactions = createSelector(
    selectAllFactions,
    (factions: Faction[]) => factions.length
);
export const selectFactionOptions = createSelector(
    selectAllFactions,
    (factions: Faction[]) => factions.map((faction: Faction) => ({ value: faction.code, label: faction.name }))
);

export const selectFactionByCode = (code: string) => createSelector(
    selectAllFactions,
    (factions: Faction[]) => factions.find((faction: Faction) => faction.code === code)
);