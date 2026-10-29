import { FiltersByTypes } from "../store/ui/filters";
import { MCCard } from "../store/entities/cards";
import { filterCards, normalizeString } from "../store/entities/cardsFilterUtils";

const emptyFilters = (): FiltersByTypes => ({
    boolean: {},
    multiselect: {},
    number: {},
    string: {},
    dotted: {},
});

const mockCard = (overrides: Partial<MCCard> = {}): MCCard => ({
    code: "01001",
    name: "Spider-Man",
    ...overrides,
}) as MCCard;

const codesOf = (cards: MCCard[]) => cards.map((card) => card.code);

describe("filterCards", () => {
    const cards = [
        mockCard({ code: "1", cost: 1, permanent: true, traits: "Avenger." }),
        mockCard({ code: "2", cost: 3, traits: "Hero. Villain." }),
        mockCard({ code: "3", traits: "Hero." }),
    ];

    it("should return every card when no filter is set", () => {
        expect(codesOf(filterCards(cards, emptyFilters()))).toEqual(["1", "2", "3"]);
    });

    describe("boolean filters", () => {
        it("should keep only cards that have the field when the filter is true", () => {
            const filters = emptyFilters();
            filters.boolean.permanent = true;
            expect(codesOf(filterCards(cards, filters))).toEqual(["1"]);
        });

        it("should keep only cards that do not have the field when the filter is false", () => {
            const filters = emptyFilters();
            filters.boolean.permanent = false;
            expect(codesOf(filterCards(cards, filters))).toEqual(["2", "3"]);
        });

        it("should ignore the filter when its value is undefined", () => {
            const filters = emptyFilters();
            filters.boolean.permanent = undefined;
            expect(codesOf(filterCards(cards, filters))).toEqual(["1", "2", "3"]);
        });
    });

    describe("number filters", () => {
        it("should keep cards with a lower value when the operator is <", () => {
            const filters = emptyFilters();
            filters.number.cost = { operator: "<", value: 3 };
            expect(codesOf(filterCards(cards, filters))).toEqual(["1"]);
        });

        it("should keep cards with a greater value when the operator is >", () => {
            const filters = emptyFilters();
            filters.number.cost = { operator: ">", value: 1 };
            expect(codesOf(filterCards(cards, filters))).toEqual(["2"]);
        });

        it("should keep cards with the same value when the operator is =", () => {
            const filters = emptyFilters();
            filters.number.cost = { operator: "=", value: 3 };
            expect(codesOf(filterCards(cards, filters))).toEqual(["2"]);
        });

        it("should exclude cards without a numeric value for the field", () => {
            const filters = emptyFilters();
            filters.number.cost = { operator: ">", value: 0 };
            expect(codesOf(filterCards(cards, filters))).not.toContain("3");
        });
    });

    describe("multiselect filters", () => {
        it("should keep cards whose value is one of the selected values", () => {
            const multiCards = [
                mockCard({ code: "1", faction_code: "hero" }),
                mockCard({ code: "2", faction_code: "villain" }),
                mockCard({ code: "3", faction_code: "neutral" }),
            ];
            const filters = emptyFilters();
            filters.multiselect.faction_code = ["hero", "neutral"];
            expect(codesOf(filterCards(multiCards, filters))).toEqual(["1", "3"]);
        });

        it("should compare numeric values using their string representation", () => {
            const filters = emptyFilters();
            filters.multiselect.cost = ["3"];
            expect(codesOf(filterCards(cards, filters))).toEqual(["2"]);
        });

        it("should ignore the filter when no value is selected", () => {
            const filters = emptyFilters();
            filters.multiselect.cost = [];
            expect(codesOf(filterCards(cards, filters))).toEqual(["1", "2", "3"]);
        });

        it("should exclude cards without a value for the field", () => {
            const filters = emptyFilters();
            filters.multiselect.cost = ["1"];
            expect(codesOf(filterCards(cards, filters))).toEqual(["1"]);
        });
    });

    describe("string filters", () => {
        it("should keep cards whose field contains the filter text", () => {
            const filters = emptyFilters();
            filters.string.name = "man";
            expect(codesOf(filterCards([mockCard({ code: "1", name: "Spider-Man" }), mockCard({ code: "2", name: "Iron Man" }), mockCard({ code: "3", name: "Hulk" })], filters)))
                .toEqual(["1", "2"]);
        });

        it("should ignore case and accents", () => {
            const accentCards = [mockCard({ code: "1", name: "Ángel de la Guarda" })];
            const filters = emptyFilters();
            filters.string.name = "angel";
            expect(codesOf(filterCards(accentCards, filters))).toEqual(["1"]);
        });

        it("should keep every card when the filter text is empty", () => {
            const filters = emptyFilters();
            filters.string.name = "";
            expect(codesOf(filterCards(cards, filters))).toEqual(["1", "2", "3"]);
        });

        it("should exclude cards without a value for the field", () => {
            const filters = emptyFilters();
            filters.string.text = "draw";
            expect(codesOf(filterCards(cards, filters))).toEqual([]);
        });
    });

    describe("dotted filters", () => {
        it("should keep cards whose traits include one of the selected traits", () => {
            const filters = emptyFilters();
            filters.dotted.traits = ["villain"];
            expect(codesOf(filterCards(cards, filters))).toEqual(["2"]);
        });

        it("should match traits regardless of case", () => {
            const filters = emptyFilters();
            filters.dotted.traits = ["hero"];
            expect(codesOf(filterCards(cards, filters))).toEqual(["2", "3"]);
        });

        it("should match a trait filter that includes the trailing separator", () => {
            const filters = emptyFilters();
            filters.dotted.traits = ["avenger."];
            expect(codesOf(filterCards(cards, filters))).toEqual(["1"]);
        });

        it("should exclude cards without traits when a trait is selected", () => {
            const filters = emptyFilters();
            filters.dotted.traits = ["hero"];
            expect(codesOf(filterCards([mockCard({ code: "4" })], filters))).toEqual([]);
        });

        it("should ignore an empty dotted filter, keeping cards without that field", () => {
            const filters = emptyFilters();
            filters.dotted.traits = [];
            expect(codesOf(filterCards([...cards, mockCard({ code: "4" })], filters))).toEqual(["1", "2", "3", "4"]);
        });
    });

    it("should only keep cards that match every active filter", () => {
        const filters = emptyFilters();
        filters.dotted.traits = ["hero"];
        filters.number.cost = { operator: ">", value: 2 };
        expect(codesOf(filterCards(cards, filters))).toEqual(["2"]);
    });
});

describe("normalizeString", () => {
    it("should lowercase the value and remove accents", () => {
        expect(normalizeString("Ángel")).toBe("angel");
    });

    it("should return an empty string for empty values", () => {
        expect(normalizeString(undefined)).toBe("");
        expect(normalizeString("")).toBe("");
    });

    it("should convert non-string values to string", () => {
        expect(normalizeString(3)).toBe("3");
    });
});
