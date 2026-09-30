import { createSelector, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { getFromLocalStorage } from '../../LocalStorageHelpers';
import { RootState } from '../configureStore';
import { loadPackCards, Pack, packCardsHydrated, selectAllPacks, selectArePacksLoading, selectPackByCode, selectPackStatusByCode, unloadPackCards } from '../entities/packs';
import { cardsRestored, MCCard, removeAllCards } from '../entities/cards';
import { loadPersistedPacks } from '../persistence/cardsDb';
import i18n from '../../i18n';

export const LOCAL_STORAGE_SELECTED_PACK_CODES_KEY = 'selected_pack_codes';

type SelectedPacksState = {
    codes: string[];
}

const initialState: SelectedPacksState = {
    codes: getFromLocalStorage<string[]>(LOCAL_STORAGE_SELECTED_PACK_CODES_KEY) || []
};

const slice = createSlice({
    name: 'selectedPacks',
    initialState,
    reducers: {
        packCodeSelected(state, action: PayloadAction<string>) {
            const code = action.payload;
            if (!state.codes.includes(code)) {
                state.codes.push(code);
            }
            return state;
        },
        packCodeUnselected(state, action: PayloadAction<string>) {
            const code = action.payload;
            state.codes = state.codes.filter((packCode) => packCode !== code);
            return state;
        },
        selectedPackCodesSet(state, action: PayloadAction<string[]>) {
            state.codes = [...new Set(action.payload)];
            return state;
        },
        selectedPackCodesCleared(state) {
            state.codes = [];
            return state;
        }
    }
});

export default slice.reducer;
export const {
    packCodeSelected,
    packCodeUnselected,
    selectedPackCodesSet,
    selectedPackCodesCleared
} = slice.actions;

export const selectSelectedPacksState = (state: RootState) => state.ui.selectedPacks;

export const selectSelectedPackCodes = createSelector(
    selectSelectedPacksState,
    (selectedPacksState: SelectedPacksState) => selectedPacksState.codes
);

export const selectNumberOfSelectedPacks = createSelector(
    selectSelectedPackCodes,
    (codes: string[]) => codes.length
);

export const selectIsPackCodeSelected = (packCode: string) => createSelector(
    selectSelectedPackCodes,
    (codes: string[]) => codes.includes(packCode)
);

export const selectPackCodeAndDownload = (packCode: string) => async (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(packCodeSelected(packCode));

    const pack = selectPackByCode(packCode)(getState());
    if (!pack) return;

    return dispatch(loadPackCards(pack.code, pack.pack_type_code));
};

export const unselectPackCodeAndUnload = (packCode: string) => (dispatch: Dispatch<any>) => {
    dispatch(packCodeUnselected(packCode));
    dispatch(unloadPackCards(packCode));
};

export const togglePackCodeSelection = (packCode: string) => async (dispatch: Dispatch<any>, getState: () => RootState) => {
    const isSelected = selectIsPackCodeSelected(packCode)(getState());

    if (isSelected) {
        dispatch(unselectPackCodeAndUnload(packCode));
        return;
    }

    await dispatch(selectPackCodeAndDownload(packCode));
};

export const selectAllPackCodesAndDownload = () => async (dispatch: Dispatch<any>, getState: () => RootState) => {
    const packs: Pack[] = selectAllPacks(getState());
    if (!packs.length) return;

    dispatch(selectedPackCodesSet(packs.map((pack) => pack.code)));

    const batchSize = 500;
    for (let i = 0; i < packs.length; i += batchSize) {
        const batch = packs
            .slice(i, i + batchSize)
            .filter((pack) => selectPackStatusByCode(pack.code)(getState()) === 'idle');
        await Promise.all(
            batch.map((pack) => dispatch(loadPackCards(pack.code, pack.pack_type_code)))
        );
    }
};

export const clearSelectedPacksAndCards = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const selectedCodes = selectSelectedPackCodes(getState());

    for (const code of selectedCodes) {
        dispatch(unloadPackCards(code));
    }

    dispatch(selectedPackCodesCleared());
    dispatch(removeAllCards());
};

/* Restores previously downloaded packs from IndexedDB.
   Returns the hydrated pack codes (empty if there was nothing to restore). */
export const hydratePersistedCards = () => async (dispatch: Dispatch<any>): Promise<string[]> => {
    const persistedPacks = await loadPersistedPacks(i18n.language || 'en');
    const packCodes = Object.keys(persistedPacks);
    if (packCodes.length === 0) return [];

    const restoredCards: MCCard[] = [];
    for (const packCode of packCodes) {
        const persistedPack = persistedPacks[packCode];
        restoredCards.push(...persistedPack.cards);
        dispatch(packCardsHydrated({ packCode, download_date: persistedPack.savedAt }));
    }
    dispatch(cardsRestored(restoredCards));
    return packCodes;
};

export const downloadSelectedPackCards = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const state = getState();
    const arePacksLoading = selectArePacksLoading(state);
    const selectedPackCodes = selectSelectedPackCodes(state);

    if (arePacksLoading || selectedPackCodes.length === 0) return;

    const selectedPacks = selectedPackCodes
        .map((packCode) => selectPackByCode(packCode)(state))
        .filter((pack): pack is Pack => !!pack);

    // Only fetch packs that are not already in the store or IndexedDB.
    for (const pack of selectedPacks) {
        const packStatus = selectPackStatusByCode(pack.code)(state);
        if (packStatus === 'idle') {
            dispatch(loadPackCards(pack.code, pack.pack_type_code));
        }
    }
};
