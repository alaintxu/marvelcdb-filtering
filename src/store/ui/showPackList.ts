import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'showPackList',
    initialState: false as boolean,
    reducers: {
        showPackListToggled: (showPackList) => {
            showPackList = !showPackList;
            return showPackList;
        },

    }
});

export default slice.reducer;
export const { 
    showPackListToggled
} = slice.actions;