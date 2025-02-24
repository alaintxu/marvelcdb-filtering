import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';
import { apiCallBegan } from '../api';
import moment from 'moment';
import { Dispatch } from '@reduxjs/toolkit';

const PACKS_URL = '/packs/';
const PACKS_CACHE_TIME_IN_MINUTES = 10;

export type Pack = {
    name: string;
    code: string;
    position: number;
    available: string;
    known: number;
    total: number;
    url: string;
    id: number;
}

export type PackSliceState = {
    list: Pack[];
    loading: boolean;
    lastFetch: number | null;
    error: string | null;
}

const initialState: PackSliceState = {
    list: [],
    loading: false,
    lastFetch: null,
    error: null
}

/* Reducer */
const slice = createSlice({
    name: 'packs',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
        error: null
    } as PackSliceState,
    reducers: {
        packsRequested(state) {
            state = {...initialState, loading: true};
            return state;
        },
        packsReceived(state, action: PayloadAction<Pack[]>) {
            state.list = action.payload;
            state.loading = false;
            state.lastFetch = Date.now();
            state.error = null;
            return state;
        },
        packAdded(state, action: PayloadAction<Pack>) {
            state.list.push(action.payload);
            return state;
        },
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
    packAdded,
    packsReceived,
    packsRequestFailed
} = slice.actions; // Do not export, as they are events and not commands. Events should be internal.


/* Action creators */
export const loadPacks = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    /*
    ** Get list of packs from the server 
    ** if the last fetch was more than 10 minutes ago
    */
    const { lastFetch } = getState().entities.packs;

    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < PACKS_CACHE_TIME_IN_MINUTES) return;
    dispatch(
        apiCallBegan({
            url: PACKS_URL,
            onStart: packsRequested.type,
            onSuccess: packsReceived.type,
            onError: packsRequestFailed.type
        })
    );
}

/*
** POST pack and add it to the store if successful
** addPack is a command (what has to be done),
** while packAdded is an event (what has happened)
*/
export const addPack = (pack: Pack) => apiCallBegan({
    url: PACKS_URL,
    method: 'post',
    data: pack,
    onSuccess: packAdded.type,
    onError: packsRequestFailed.type
});


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
