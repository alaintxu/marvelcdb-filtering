import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../configureStore";
import { MCCard } from "../entities/cards";

export const KEY_VALUE_FILTERS: string[] = [
    "type_", // "type_code" -> "type_name"
    "faction_", // "faction_code" -> "faction_name"
    "pack_", // "pack_code" -> "pack_name"
    "card_set_", // "card_set_code" -> "card_set_name"
    "", // "code" -> "name"
    //"linked_to_", // "linked_to_code" -> "linked_to_name"
    //"duplicate_of_", // "duplicate_of_code" -> "duplicate_of_name"
];

export const NUMBER_FILTERS: string[] = [
    "cost",
    "thwart",
    "attack",
    "defense",
    "threat",
    "hand_size",
    "health",
    "base_threat",
    "quantity",
    "position",
    "set_position",
    //"spoiler",
];

export const BOOLEAN_FILTERS: string[] = [
    "is_unique",
    "permanent",
    "health_per_hero",
    "thwart_star",
    "attack_star",
    "threat_fixed",
    "base_threat_fixed",
    "hidden",
    "double_sided",
    "escalation_threat_fixed",
];

export const DOTTED_FILTERS: string[] = [
    "traits",
    "real_traits",
];

export const STRING_FILTERS: string[] = [
    "name",
    "text",
    "back_text",
    "subname",
    "flavor",
    "back_flavor",
    "illustrator",
    "real_name",
    "real_text",
    "code",
    "octgn_id",
];

export type FieldOption = {
    value: string,
    label: string
}


export type FiltersByTypes = {
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
    "dotted": {
        [key in keyof MCCard]?: string[]
    }
}

type FiltersState = {
    quickFilter: string,
    hideDuplicates: boolean,
    filters: FiltersByTypes,
}

const initialState = {
    quickFilter: "",
    hideDuplicates: true,
    filters: {
        "boolean": {},
        "multiselect": {},
        "number": {},
        "string": {},
        "dotted": {},
    } as FiltersByTypes,
} as FiltersState;

const slice = createSlice({
    name: 'filters',
    initialState: initialState,
    reducers: {
        quickFilterSet: (state: FiltersState, action: PayloadAction<string>) => {
            state.quickFilter = action.payload;
            return state;
        },
        filterUpdated: (
            state: FiltersState, 
            action: PayloadAction<{ 
                filterType: keyof FiltersState["filters"], 
                fieldCode: keyof MCCard, values: boolean | string[] | number | string | undefined
            }>
        ) => {
            const { filterType, fieldCode, values } = action.payload;
            state.filters[filterType][fieldCode] = values;
            return state;
        },
        // filterTraitsUpdated: (state: FiltersState, action: PayloadAction<string[]>) => {
        //     state.traits = action.payload;
        //     return state;
        // },
        resetFilters: (state: FiltersState) => {
            state = initialState;
            return state;
        },
        hideDuplicatesSet: (state: FiltersState, action: PayloadAction<boolean>) => {
            state.hideDuplicates = action.payload;
            return state;
        }
    }
});

const countFilters = (filters: FiltersByTypes, filterType?: keyof FiltersByTypes) => {
    const filterTarget = filterType ? [filterType] : Object.keys(filters) as (keyof FiltersByTypes)[];

    return filterTarget.reduce((total, type) => {
        return total + Object.entries(filters[type]).filter(([, value]) => {
            if (value === undefined) return false;
            if (typeof value === "string" && value === "") return false;
            if (Array.isArray(value) && value.length === 0) return false;
            return true;
        }).length;
    }, 0);
};    


export const selectFiltersSlice = (state: RootState) => state.ui.filters;
export const selectQuickFilter = createSelector(
    selectFiltersSlice,
    (filters) => filters.quickFilter
)
export const selectFilters = createSelector(
    selectFiltersSlice,
    (filters) => filters.filters
)

export const selectNumberOfFilters = createSelector(
    selectFilters,
    (filters) => countFilters(filters)
);
export const selectNumberOfFiltersByType = (filterType: keyof FiltersByTypes) => createSelector(
    selectFilters,
    (filters) => countFilters(filters, filterType)
);

export const selectFilterValues = (type: keyof FiltersState["filters"], field: keyof MCCard) => createSelector(
    selectFilters,
    (filters) => filters[type][field]
);

export const selectTrait = createSelector(
    selectFiltersSlice,
    (filters) => filters.traits
);

export const selectHideDuplicates = createSelector(
    selectFiltersSlice,
    (filters) => filters.hideDuplicates
);

export default slice.reducer;
export const {
    quickFilterSet,
    hideDuplicatesSet,
    filterUpdated,
    resetFilters,
} = slice.actions;