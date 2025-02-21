import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';

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
    lastFetch: Date | null;
    error: string | null;
}

const initialState: PackSliceState = {
    list: [],
    loading: false,
    lastFetch: null,
    error: null
}


const slice = createSlice({
    name: 'packs',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
        error: null
    } as PackSliceState,
    reducers: {
        packsDownloading(state) {
            state = {...initialState, loading: true};
            return state;
        },
        packsDownloaded(state, action: PayloadAction<Pack[]>) {
            state.list = action.payload;
            state.loading = false;
            state.lastFetch = new Date();
            state.error = null;
            return state;
        },
        packsDownloadError(state, action: PayloadAction<Error>) {
            state.loading = false;
            state.error = action.payload.message;
            return state;
        }
    }
});

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

export default slice.reducer;
export const { 
    packsDownloading,
    packsDownloaded,
    packsDownloadError
} = slice.actions;
