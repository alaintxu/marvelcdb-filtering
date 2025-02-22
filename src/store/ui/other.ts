import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../configureStore";

type OtherState = {
    navigationOptionKey: NavigationOptionsKey,
    showPackList: boolean,
    showDeckList: boolean,
    showAllCardData: boolean,
    flipAllCards: boolean,
    clickedCardCodes: Set<string>
}

export type NavigationOptionsKey = "download_manager" | "filters" | "card_list";

const slice = createSlice({
    name: 'other',
    initialState: {
        navigationOptionKey: "card_list" as NavigationOptionsKey,
        showPackList: false,
        showDeckList: false,
        showAllCardData: false,
        flipAllCards: false,
        clickedCardCodes: new Set<string>()
    } as OtherState,
    reducers: {
        navigationOptionKeySet: (state: OtherState, action: PayloadAction<NavigationOptionsKey>) => {
            state.navigationOptionKey = action.payload;
            return state;
        },
        showPackListToggled: (state: OtherState) => {
            state.showPackList = !state.showPackList;
            return state;
        },
        showDeckListToggled: (state: OtherState) => {
            state.showDeckList = !state.showDeckList;
            return state;
        },
        showAllCardDataToggled: (state: OtherState) => {
            state.showAllCardData = !state.showAllCardData;
            return state;
        },
        flipAllCardsToggled: (state: OtherState) => {
            state.flipAllCards = !state.flipAllCards;
            return state;
        },
        cardCodeClicked: (state: OtherState, action: PayloadAction<string>) => {
            const cardCode: string = action.payload;
            state.clickedCardCodes.add(cardCode);
            return state;
        },
        /*cardCodeUnclicked: (state: OtherState, action: PayloadAction<string>) => {
            const cardCode = action.payload;
            state.clickedCardCodes.delete(cardCode);
            return state;
        },*/
        cardCodeAllUnclicked: (state: OtherState) => {
            state.clickedCardCodes.clear();
            return state;
        }
    }
});

export const selectOtherSlice = (state: RootState) => state.ui.other;
export const selectNavigationOptionKey = createSelector(
    selectOtherSlice,
    (other) => other.navigationOptionKey
);
export const selectShowPackList = createSelector(
    selectOtherSlice,
    (other) => other.showPackList
);
export const selectShowDeckList = createSelector(
    selectOtherSlice,
    (other) => other.showDeckList
);
export const selectShowAllCardData = createSelector(
    selectOtherSlice,
    (other) => other.showAllCardData
);
export const selectFlipAllCards = createSelector(
    selectOtherSlice,
    (other) => other.flipAllCards
);
export const selectClickedCardCodes = createSelector(
    selectOtherSlice,
    (other) => other.clickedCardCodes
);
export const selectClickedCardCodesArray = createSelector(
    selectClickedCardCodes,
    (clickedCardCodes) => Array.from(clickedCardCodes)
);
export const selectIsCardCodeClicked = (cardCode: string) => createSelector(
    selectClickedCardCodes,
    (clickedCardCodes) => clickedCardCodes.has(cardCode)
);

export default slice.reducer;
export const {
    navigationOptionKeySet,
    showPackListToggled,
    showDeckListToggled,
    showAllCardDataToggled,
    flipAllCardsToggled,
    cardCodeClicked,
    cardCodeAllUnclicked
} = slice.actions;