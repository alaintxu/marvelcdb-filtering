import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../configureStore";


type filtersState = {
    quickFilter: string,
}

const slice = createSlice({
    name: 'filters',
    initialState: {
        quickFilter: ""
    } as filtersState,
    reducers: {
        quickFilterSet: (state: filtersState, action: PayloadAction<string>) => {
            state.quickFilter = action.payload;
            return state;
        }
    }
});


export const selectFiltersSlice = (state: RootState) => state.ui.filters;
export const selectQuickFilter = createSelector(
    selectFiltersSlice,
    (filters) => filters.quickFilter
)

export default slice.reducer;
export const {
    quickFilterSet
} = slice.actions;