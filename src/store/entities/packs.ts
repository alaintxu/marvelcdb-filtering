import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';
import { apiCallBegan } from '../api';
//import moment from 'moment';
import { Dispatch } from '@reduxjs/toolkit';
import { cardsReceived, cardsTranslationsReceived, cardsTranslationsRequestFailed, MCCard } from './cards';
import i18n from '../../i18n';

// const PACK_CARDS_URL = '/cards/';
//const PACKS_CACHE_TIME_IN_MINUTES = 10;
type PackLoadStatus = "idle" | "downloading" | "downloaded" | "error";

export type Pack = {
    /* GHJson style */
    cgdb_id: number;
    code: string;
    date_release: string;
    name: string;
    octgn_id: string;
    pack_type_code: string;
    position: number;
    size: number;
}

export type PackTranslation = Pick<Pack, "code" | "name">;

// export type Pack = {
//     name: string;
//     code: string;
//     position: number;
//     available: string;
//     known: number;
//     total: number;
//     url: string;
//     id: number;
//     // Additional fields
//     download_date?: number;
//     download_status?: "unselected" | "selected" | "downloading" | "downloaded" | "error";
//     error?: string;
// }

export type PackSliceState = {
    list: Pack[];
    loading: boolean;
    lastFetch: number;
    error: string | null;
    packCardLoadByCode: Record<string, {
        status: PackLoadStatus;
        download_date?: number;
        error?: string;
    }>;
}

const initialState: PackSliceState = {
    list: [],
    loading: true,
    lastFetch: 0,
    error: null,
    packCardLoadByCode: {}
}

/* Reducer */
const slice = createSlice({
    name: 'packs',
    initialState,
    reducers: {
        unloadPackCards: (state, action: PayloadAction<string>) => {
            const packCode = action.payload;
            delete state.packCardLoadByCode[packCode];
            // @ToDo: Remove cards from store
            return state;
        },
        packCardsRequested: (state, action: PayloadAction<string>) => {
            const packCode = action.payload;
            state.packCardLoadByCode[packCode] = {
                status: "downloading"
            };
            return state;
        },
        packCardsReceived: (state, action: PayloadAction<MCCard[]>) => {
            const cards: MCCard[] = action.payload;
            if (cards.length === 0) return state;

            const packCode = cards[0].pack_code;
            state.packCardLoadByCode[packCode] = {
                status: "downloaded",
                download_date: Date.now(),
                error: ""
            };
            // @ToDo: Remove old cards and add new cards to store
            return state;
        },
        packCardsRequestFailed: (state, action: PayloadAction<{error: string, errorPayload: string}>) => {
            const packCode = action.payload.errorPayload;
            const error = action.payload.error;
            state.packCardLoadByCode[packCode] = {
                status: "error",
                download_date: 0,
                error
            };
            return state;
        },
        packTranslationReceived(state, action: PayloadAction<PackTranslation[]>) {
            const translations: PackTranslation[] = action.payload;
            const now = Date.now();
            for (let translation of translations) {
                const index = state.list.findIndex((pack: Pack) => pack.code === translation.code);
                if (index !== -1) {
                    state.list[index] = {
                        ...state.list[index],
                        ...translation
                    }
                }
            }
            state.loading = false;
            state.lastFetch = now;
            state.error = null;
            return state;
        },
        packsRequested(state) {
            state.error = "";
            state.loading = true;
            return state;
        },
        packsReceived(state, action: PayloadAction<Pack[]>) {
            const newPacks = action.payload;

            for (let newPack of newPacks) {
                const index = state.list.findIndex((oldPack: Pack) => oldPack.code === newPack.code);
                if (index !== -1) {
                    state.list[index] = newPack;
                }else{
                    state.list.push(newPack);
                }
            }

            state.loading = false;
            state.lastFetch = Date.now();
            state.error = null;
            return state;
        },
        // For POST (as example, not needed)
        // packAdded(state, action: PayloadAction<Pack>) {
        //     state.list.push(action.payload);
        //     return state;
        // },
        packsRequestFailed(state, action: PayloadAction<Error>) {
            state.loading = false;
            state.error = action.payload.message;
            return state;
        }
    }
});

/* Reducer exports */
export default slice.reducer;


const {
    packsRequested,
    //packAdded,
    packsReceived,
    packsRequestFailed,
    packCardsReceived,
    packCardsRequested,
    packCardsRequestFailed,
    packTranslationReceived,
} = slice.actions; // Do not export, as they are events and not commands. Events should be internal.

export const {
    unloadPackCards
} = slice.actions;


/* Action creators */
export const loadPacks = () => (dispatch: Dispatch<any>) => {

    /*
    ** Get list of packs from the server 
    ** if the last fetch was more than 10 minutes ago
    */
    // const { lastFetch } = getState().entities.packs;

    // const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    // if (diffInMinutes < PACKS_CACHE_TIME_IN_MINUTES) return;
    const afterSuccessDispatch = i18n.language === "en" ? undefined : translatePacks();

    return dispatch(
        apiCallBegan({
            //url: PACKS_URL,
            url: 'https://cdn.jsdelivr.net/gh/zzorba/marvelsdb-json-data@master/packs.json',
            onStart: packsRequested.type,
            onSuccess: packsReceived.type,
            afterSuccessDispatch: afterSuccessDispatch,
            onError: packsRequestFailed.type
        })
    );
}

export const translatePacks = () => (dispatch: Dispatch<any>) => {
    return dispatch(
        apiCallBegan({
            url: `https://cdn.jsdelivr.net/gh/zzorba/marvelsdb-json-data@master/translations/${i18n.language}/packs.json`,
            onSuccess: packTranslationReceived.type,
            onError: packsRequestFailed.type
        })
    );
}


export const loadPackCards = (packCode: string, packTypeCode: string) => (dispatch: Dispatch<any>) => {
    if( packTypeCode === "scenario" ){
        return dispatch(loadPackCardsEncounter(packCode));
    }
    const afterSuccessDispatch = i18n.language === "en" ? undefined : translateCards(packCode);
    return dispatch(
        apiCallBegan({
            //url: PACK_CARDS_URL + packCode + '.json',
            url: `https://cdn.jsdelivr.net/gh/zzorba/marvelsdb-json-data@master/pack/${packCode}.json`,
            onStart: packCardsRequested.type,
            onStartPayload: packCode,
            onSuccess: [packCardsReceived.type, cardsReceived.type],
            onError: packCardsRequestFailed.type,
            afterSuccessDispatch: afterSuccessDispatch,
            onErrorPayload: packCode
        })
    );
}

export const translateCards = (packCode: string) => (dispatch: Dispatch<any>) => {
    return dispatch(
        apiCallBegan({
            url: `https://cdn.jsdelivr.net/gh/zzorba/marvelsdb-json-data@master/translations/${i18n.language}/pack/${packCode}.json`,
            onSuccess: cardsTranslationsReceived.type,
            onError: cardsTranslationsRequestFailed.type,
            afterSuccessDispatch: loadPackCardsEncounter(packCode),
            onErrorPayload: packCode
        })
    );
}

export const loadPackCardsEncounter = (packCode: string) => (dispatch: Dispatch<any>) => {
    const afterSuccessDispatch = i18n.language === "en" ? undefined : translatePackCardsEncounter(packCode);
    return dispatch(
        apiCallBegan({
            url: `https://cdn.jsdelivr.net/gh/zzorba/marvelsdb-json-data@master/pack/${packCode}_encounter.json`,
            onSuccess: cardsReceived.type,
            onError: packCardsRequestFailed.type,
            onErrorPayload: packCode,
            afterSuccessDispatch: afterSuccessDispatch
        })
    );
}

export const translatePackCardsEncounter = (packCode: string) => (dispatch: Dispatch<any>) => {
    return dispatch(
        apiCallBegan({
            url: `https://cdn.jsdelivr.net/gh/zzorba/marvelsdb-json-data@master/translations/${i18n.language}/packs/${packCode}_encounter.json`,
            onSuccess: cardsTranslationsReceived.type,
            onError: cardsTranslationsRequestFailed.type,
            onErrorPayload: packCode
        })
    );
}


/*
** POST pack and add it to the store if successful
** addPack is a command (what has to be done),
** while packAdded is an event (what has happened)
*/
// export const addPack = (pack: Pack) => apiCallBegan({
//     url: PACKS_URL,
//     method: 'post',
//     data: pack,
//     onSuccess: packAdded.type,
//     onError: packsRequestFailed.type
// });


/* Selectors */
export const selectPackState = (state: RootState) => state.entities.packs;
export const selectAllPacks = createSelector(
    selectPackState,
    (packState: PackSliceState) => packState.list
);

export const selectNumberOfPacks = createSelector(
    selectAllPacks,
    (packs: Pack[]) => packs.length
);

export const selectPackByCode = (packCode: string) => createSelector(
    selectAllPacks,
    (packs: Pack[]) => packs.find((pack: Pack) => pack.code === packCode)
);

export const selectArePacksLoading = createSelector(
    selectPackState,
    (packState: PackSliceState) => packState.loading
);

export const selectLastFetch = createSelector(
    selectPackState,
    (packState: PackSliceState) => packState.lastFetch
);

export const selectPacksError = createSelector(
    selectPackState,
    (packState: PackSliceState) => packState.error
);

export const selectPackStatusByCode = (packCode: string) => createSelector(
    selectPackState,
    (packState: PackSliceState) => packState.packCardLoadByCode[packCode]?.status || "idle"
);

export const selectPackDownloadDateByCode = (packCode: string) => createSelector(
    selectPackState,
    (packState: PackSliceState) => packState.packCardLoadByCode[packCode]?.download_date
);

export const selectIsAnyPackDownloading = createSelector(
    selectPackState,
    (packState: PackSliceState) => Object.values(packState.packCardLoadByCode).some((stateByCode) => stateByCode.status === "downloading")
);

export const selectNumberOfDownloadedPacks = createSelector(
    selectPackState,
    (packState: PackSliceState) => Object.values(packState.packCardLoadByCode).filter((stateByCode) => stateByCode.status === "downloaded").length
);

export const selectPackStatusBootstrapVariant = createSelector(
    selectNumberOfPacks,
    selectNumberOfDownloadedPacks,
    selectIsAnyPackDownloading,
    (numberOfPacks: number, numberOfDownloadedPacks:number, isAnyPackDownloading: boolean) => {
        if (isAnyPackDownloading) return "dark";
        const packRatio = numberOfDownloadedPacks / numberOfPacks;
        if (packRatio === 1) return "success";
        if (packRatio < 0.25) return "danger";
        return "warning";
    }
);

export const selectPackOptions = createSelector(
    selectAllPacks,
    (packs: Pack[]) => packs.map((pack: Pack) => ({ value: pack.code, label:pack.name }))
);
