import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';
import { apiCallBegan } from '../api';
//import moment from 'moment';
import { Dispatch } from '@reduxjs/toolkit';
import { getFromLocalStorage } from '../../LocalStorageHelpers';
import { cardsReceived, MCCard } from './cards';

const PACKS_URL = '/packs/';
const PACK_CARDS_URL = '/cards/';
//const PACKS_CACHE_TIME_IN_MINUTES = 10;
export const LOCAL_STORAGE_PACKS_KEY = "packs";

export type Pack = {
    name: string;
    code: string;
    position: number;
    available: string;
    known: number;
    total: number;
    url: string;
    id: number;
    // Additional fields
    download_date?: number;
    download_status?: "unselected" | "selected" | "downloading" | "downloaded" | "error";
}

export type PackSliceState = {
    list: Pack[];
    loading: boolean;
    lastFetch: number;
    error: string | null;
}

const initialState: PackSliceState = {
    list: [],
    loading: false,
    lastFetch: 0,
    error: null
}

/* Reducer */
const slice = createSlice({
    name: 'packs',
    initialState: getFromLocalStorage<PackSliceState>(LOCAL_STORAGE_PACKS_KEY) || {...initialState, list: [...initialState.list]} as PackSliceState,
    reducers: {
        unloadPackCards: (state, action: PayloadAction<string>) => {
            const packCode = action.payload;
            const pack = state.list.find((pack: Pack) => pack.code === packCode);
            if (pack) {
                pack.download_status = "unselected";
                pack.download_date = 0;
            }
            // @ToDo: Remove cards from store
            return state;
        },
        packCardsRequested: (state, action: PayloadAction<string>) => {
            const packCode = action.payload;
            const pack = state.list.find((pack: Pack) => pack.code === packCode);
            if (pack) {
                pack.download_status = "downloading";
                pack.download_date = Date.now();
            }
            return state;
        },
        packCardsReceived: (state, action: PayloadAction<MCCard[]>) => {
            const cards: MCCard[] = action.payload;
            if (cards.length === 0) return state;

            const packCode = cards[0].pack_code;
            const index = state.list.findIndex((pack: Pack) => pack.code === packCode);
            if (index !== -1) {
                state.list[index].download_status = "downloaded";
                state.list[index].download_date = Date.now();
                // @ToDo: Remove old cards and add new cards to store
            }
            return state;
        },
        packCardsRequestFailed: (state, action: PayloadAction<string>) => {
            const packCode = action.payload;
            const index = state.list.findIndex((pack: Pack) => pack.code === packCode);
            if (index !== -1) {
                state.list[index].download_status = "error";
                state.list[index].download_date = Date.now();
            }
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
                    state.list[index] = {
                        ...newPack,
                        download_date: state.list[index].download_date,
                        download_status: state.list[index].download_status
                    }
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
    packCardsRequestFailed
} = slice.actions; // Do not export, as they are events and not commands. Events should be internal.

export const {
    unloadPackCards
} = slice.actions;


/* Action creators */
export const loadPacks = () => (dispatch: Dispatch<any>/*, getState: () => RootState*/): Promise<any> => {

    /*
    ** Get list of packs from the server 
    ** if the last fetch was more than 10 minutes ago
    */
    // const { lastFetch } = getState().entities.packs;

    // const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    // if (diffInMinutes < PACKS_CACHE_TIME_IN_MINUTES) return;
    return dispatch(
        apiCallBegan({
            url: PACKS_URL,
            onStart: packsRequested.type,
            onSuccess: packsReceived.type,
            onError: packsRequestFailed.type
        })
    ) as any;
}

export const loadPackCards = (packCode: string) => (dispatch: Dispatch<any>) => {
    return dispatch(
        apiCallBegan({
            url: PACK_CARDS_URL + packCode + '.json',
            onStart: packCardsRequested(packCode).type,
            onSuccess: [packCardsReceived.type, cardsReceived.type],
            onError: packCardsRequestFailed(packCode).type
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
    selectPackByCode(packCode),
    (pack: Pack | undefined) => pack?.download_status
);

export const selectIsAnyPackDownloading = createSelector(
    selectAllPacks,
    (packs: Pack[]) => packs.some((pack: Pack) => pack.download_status === "downloading")
);

export const selectNumberOfDownloadedPacks = createSelector(
    selectAllPacks,
    (packs: Pack[]) => packs.filter((pack: Pack) => pack.download_status === "downloaded").length
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
