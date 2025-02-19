import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from './configureStore';

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

/*export type PackDict = {
    [pack_code: string]: Pack;
}*/


const slice = createSlice({
    name: 'packs',
    initialState: [] as Pack[],
    reducers: {
        packsDownloading(packs: Pack[]) {
            packs = [];
            return packs;
        },
        packsSet(packs: Pack[], action) {
            const newPacks: Pack[] = action.payload;
            packs = newPacks;
            return packs;
        }
    }
});

export const selectAllPacks = (state: RootState) => state.entities.packs;

export default slice.reducer;
export const { 
    packsDownloading,
    packsSet
} = slice.actions;
