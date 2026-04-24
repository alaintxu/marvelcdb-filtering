import { createSelector, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { getFromLocalStorage } from '../../LocalStorageHelpers';
import { RootState } from '../configureStore';
import { loadPackCards, Pack, selectAllPacks, selectArePacksLoading, selectPackByCode, unloadPackCards } from '../entities/packs';
import { removeAllCards, selectAllCards } from '../entities/cards';

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
        const batch = packs.slice(i, i + batchSize);
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

export const downloadSelectedPackCards = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const state = getState();
    const arePacksLoading = selectArePacksLoading(state);
    const cards = selectAllCards(state);
    const selectedPackCodes = selectSelectedPackCodes(state);

    if (arePacksLoading || cards.length > 0 || selectedPackCodes.length === 0) return;

    const selectedPacks = selectedPackCodes
        .map((packCode) => selectPackByCode(packCode)(state))
        .filter((pack): pack is Pack => !!pack);

    selectedPacks.forEach((pack) => {
        dispatch(loadPackCards(pack.code, pack.pack_type_code));
    });
};
