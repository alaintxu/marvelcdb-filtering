import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../configureStore";
import { MCCard } from "../entities/cards";

export const MULTISELEC_VALUE_MAPPING = {
    "faction_code": "faction_name",
    "card_set_code": "card_set_name",
    "code": "name",
    "pack_code": "pack_name",
    "type_code": "type_name"
}



type FiltersState = {
    quickFilter: string,
    filters: {
        "boolean": {
            [key in keyof MCCard]?: boolean
        },
        "multiselect": {
            [key in keyof MCCard]?: string[]
        },
        "number": {
            [key in keyof MCCard]?: number
        },
        "string": {
            [key in keyof MCCard]?: string
        },
    },
    traits: string[]
}

const slice = createSlice({
    name: 'filters',
    initialState: {
        quickFilter: "",
        filters: {
            "boolean": {},
            "multiselect": {},
            "number": {},
            "string": {},
        },
        traits: [],
    } as FiltersState,
    reducers: {
        quickFilterSet: (state: FiltersState, action: PayloadAction<string>) => {
            state.quickFilter = action.payload;
            return state;
        },
        filterUpdated: (state: FiltersState, action: PayloadAction<{ filterType: keyof FiltersState["filters"], fieldName: keyof MCCard, values: any }>) => {
            const { filterType, fieldName, values } = action.payload;
            state.filters[filterType][fieldName] = values;
            return state;
        },
        filterTraitsUpdated: (state: FiltersState, action: PayloadAction<string[]>) => {
            state.traits = action.payload;
            return state;
        }
    }
});


export const selectFiltersSlice = (state: RootState) => state.ui.filters;
export const selectQuickFilter = createSelector(
    selectFiltersSlice,
    (filters) => filters.quickFilter
)
export const selectFilters = createSelector(
    selectFiltersSlice,
    (filters) => filters.filters
)

export const selectFilterValues = (type: keyof FiltersState["filters"], field: keyof MCCard) => createSelector(
    selectFilters,
    (filters) => filters[type][field]
);

export const selectTrait = createSelector(
    selectFiltersSlice,
    (filters) => filters.traits
)

export default slice.reducer;
export const {
    quickFilterSet,
    filterUpdated
} = slice.actions;