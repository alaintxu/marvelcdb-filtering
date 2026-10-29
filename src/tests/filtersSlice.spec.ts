import type { RootState } from "../store/configureStore";
import reducer, {
    FiltersByTypes,
    filterUpdated,
    hideDuplicatesSet,
    quickFilterSet,
    resetFilters,
    selectFilterValues,
    selectHideDuplicates,
    selectNumberOfFilters,
    selectNumberOfFiltersByType,
    selectQuickFilter,
} from "../store/ui/filters";

const initialState = reducer(undefined, { type: "@@init" });

const stateWith = (filtersState: ReturnType<typeof reducer>) =>
    ({ ui: { filters: filtersState } }) as unknown as RootState;

describe("filters slice reducer", () => {
    it("should start with no filters, no quick filter and hiding duplicates", () => {
        expect(initialState.quickFilter).toBe("");
        expect(initialState.hideDuplicates).toBe(true);
        expect(initialState.filters).toEqual({
            boolean: {},
            multiselect: {},
            number: {},
            string: {},
            dotted: {},
        });
    });

    it("should set the quick filter", () => {
        const state = reducer(initialState, quickFilterSet("spider"));
        expect(state.quickFilter).toBe("spider");
    });

    it("should set the hide duplicates option", () => {
        const state = reducer(initialState, hideDuplicatesSet(false));
        expect(state.hideDuplicates).toBe(false);
    });

    describe("filterUpdated", () => {
        it("should store the value under the filter type and field", () => {
            const state = reducer(initialState, filterUpdated({
                filterType: "multiselect",
                fieldCode: "faction_code",
                values: ["hero", "neutral"],
            }));
            expect(state.filters.multiselect.faction_code).toEqual(["hero", "neutral"]);
        });

        it("should keep the other filters when a new one is updated", () => {
            let state = reducer(initialState, filterUpdated({
                filterType: "boolean",
                fieldCode: "permanent",
                values: true,
            }));
            state = reducer(state, filterUpdated({
                filterType: "string",
                fieldCode: "name",
                values: "spider",
            }));
            expect(state.filters.boolean.permanent).toBe(true);
            expect(state.filters.string.name).toBe("spider");
        });

        it("should replace the previous value of the same field", () => {
            let state = reducer(initialState, filterUpdated({
                filterType: "number",
                fieldCode: "cost",
                values: { operator: "<", value: 2 },
            }));
            state = reducer(state, filterUpdated({
                filterType: "number",
                fieldCode: "cost",
                values: { operator: ">", value: 4 },
            }));
            expect(state.filters.number.cost).toEqual({ operator: ">", value: 4 });
        });

        it("should store undefined to clear a filter", () => {
            let state = reducer(initialState, filterUpdated({
                filterType: "dotted",
                fieldCode: "traits",
                values: ["hero"],
            }));
            state = reducer(state, filterUpdated({
                filterType: "dotted",
                fieldCode: "traits",
                values: undefined,
            }));
            expect(state.filters.dotted.traits).toBeUndefined();
        });
    });

    describe("resetFilters", () => {
        it("should restore the initial state after changes", () => {
            let state = reducer(initialState, quickFilterSet("spider"));
            state = reducer(state, hideDuplicatesSet(false));
            state = reducer(state, filterUpdated({
                filterType: "string",
                fieldCode: "name",
                values: "spider",
            }));
            state = reducer(state, resetFilters());
            expect(state).toEqual(initialState);
        });

        it("should not leave the initial state modified for later resets", () => {
            let state = reducer(initialState, resetFilters());
            state = reducer(state, filterUpdated({
                filterType: "boolean",
                fieldCode: "hidden",
                values: false,
            }));
            state = reducer(state, resetFilters());
            expect(state.filters.boolean).toEqual({});
            expect(initialState.filters.boolean).toEqual({});
        });
    });
});

describe("filters slice selectors", () => {
    const filtersWithValues = (): FiltersByTypes => ({
        boolean: { permanent: true, hidden: false },
        multiselect: { faction_code: ["hero"], pack_code: [] },
        number: { cost: { operator: "<", value: 3 } },
        string: { name: "", text: "draw" },
        dotted: { traits: undefined },
    });

    it("should select the quick filter and the hide duplicates option", () => {
        const state = stateWith({ ...initialState, quickFilter: "spider", hideDuplicates: false });
        expect(selectQuickFilter(state)).toBe("spider");
        expect(selectHideDuplicates(state)).toBe(false);
    });

    it("should select the value of a field for its filter type", () => {
        const state = stateWith({ ...initialState, filters: filtersWithValues() });
        expect(selectFilterValues("number", "cost")(state)).toEqual({ operator: "<", value: 3 });
        expect(selectFilterValues("string", "text")(state)).toBe("draw");
    });

    it("should count no active filters when nothing is set", () => {
        expect(selectNumberOfFilters(stateWith(initialState))).toBe(0);
    });

    it("should count every filter that has a value across all types", () => {
        const state = stateWith({ ...initialState, filters: filtersWithValues() });
        // permanent, hidden (false is still a value), faction_code, cost, text
        expect(selectNumberOfFilters(state)).toBe(5);
    });

    it("should ignore undefined, empty strings and empty arrays", () => {
        const state = stateWith({
            ...initialState,
            filters: {
                boolean: { permanent: undefined },
                multiselect: { faction_code: [] },
                number: {},
                string: { name: "" },
                dotted: { traits: undefined },
            },
        });
        expect(selectNumberOfFilters(state)).toBe(0);
    });

    it("should count the active filters of a single type", () => {
        const state = stateWith({ ...initialState, filters: filtersWithValues() });
        expect(selectNumberOfFiltersByType("boolean")(state)).toBe(2);
        expect(selectNumberOfFiltersByType("multiselect")(state)).toBe(1);
        expect(selectNumberOfFiltersByType("dotted")(state)).toBe(0);
    });
});
