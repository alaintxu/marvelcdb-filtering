import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../configureStore";

export type NavigationOptionsKey = "download_manager" | "filters" | "card_list";

const slice = createSlice({
    name: 'selectedNavigationOptionKey',
    initialState: "card_list" as NavigationOptionsKey,
    reducers: {
        selectedNavigationOptionKeySet: (selectedNavigationOptionKey, action) => {
            selectedNavigationOptionKey = action.payload;
            return selectedNavigationOptionKey;
        },

    }
});

export const selectSelectedNavigationOptionKey = (state: RootState) => state.ui.selectedNavigationOptionKey;

export default slice.reducer;
export const { 
    selectedNavigationOptionKeySet
} = slice.actions;