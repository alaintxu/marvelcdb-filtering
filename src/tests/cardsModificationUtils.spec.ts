import { MCCard } from "../store/entities/cards";
import { cleanCards, sortCards } from "../store/entities/cardsModificationUtils";

const mockCard = (overrides: Partial<MCCard> = {}): MCCard => ({
    code: "01001",
    pack_code: "core",
    pack_name: "Core Set",
    name: "Spider-Man",
    real_name: "Spider-Man",
    text: "",
    traits: "Hero.",
    type_code: "hero",
    type_name: "Hero",
    faction_code: "hero",
    faction_name: "Hero",
    set_code: "spiderman",
    card_set_code: "spiderman",
    card_set_name: "Spider-Man",
    card_set_type_name_code: "hero",
    position: 1,
    quantity: 1,
    linked_to_code: "",
    linked_to_name: "",
    ...overrides
});

const codes = (cards: MCCard[]) => cards.map((card) => card.code);

describe("sortCards", () => {
    it("sorts by code ascending by default", () => {
        const cards = [mockCard({ code: "13015" }), mockCard({ code: "01055" }), mockCard({ code: "02002" })];

        expect(codes(sortCards(cards))).toEqual(["01055", "02002", "13015"]);
    });

    it("sorts by a string field using localeCompare", () => {
        const cards = [mockCard({ code: "a", name: "Wolverine" }), mockCard({ code: "b", name: "Captain America" })];

        expect(codes(sortCards(cards, "name"))).toEqual(["b", "a"]);
    });

    it("sorts by a numeric field", () => {
        const cards = [mockCard({ code: "a", position: 10 }), mockCard({ code: "b", position: 2 }), mockCard({ code: "c", position: 7 })];

        expect(codes(sortCards(cards, "position"))).toEqual(["b", "c", "a"]);
    });

    it("sorts false before true for boolean fields", () => {
        const cards = [mockCard({ code: "a", is_unique: true }), mockCard({ code: "b", is_unique: false })];

        expect(codes(sortCards(cards, "is_unique"))).toEqual(["b", "a"]);
    });

    it("keeps the original order of cards with equal boolean values", () => {
        const cards = [
            mockCard({ code: "a", is_unique: true }),
            mockCard({ code: "b", is_unique: true }),
            mockCard({ code: "c", is_unique: false }),
            mockCard({ code: "d", is_unique: false })
        ];

        expect(codes(sortCards(cards, "is_unique"))).toEqual(["c", "d", "a", "b"]);
    });

    it("places cards without a value (null or undefined) before cards with a value", () => {
        const cards = [mockCard({ code: "a", cost: 3 }), mockCard({ code: "b", cost: undefined }), mockCard({ code: "c", cost: 1 })];

        expect(codes(sortCards(cards, "cost"))).toEqual(["b", "c", "a"]);
    });

    it("sorts the array in place and returns the same reference", () => {
        const cards = [mockCard({ code: "02" }), mockCard({ code: "01" })];

        const result = sortCards(cards);

        expect(result).toBe(cards);
        expect(codes(cards)).toEqual(["01", "02"]);
    });
});

describe("cleanCards", () => {
    it("keeps regular cards unchanged", () => {
        const card = mockCard({ code: "01001", type_code: "ally" });

        expect(cleanCards([card])).toEqual([card]);
    });

    it("removes main scheme cards that have no linked card", () => {
        const scheme = mockCard({ code: "09001", type_code: "main_scheme" });

        expect(cleanCards([scheme])).toEqual([]);
    });

    it("keeps main scheme cards that have a linked card", () => {
        const scheme = mockCard({
            code: "09001a",
            type_code: "main_scheme",
            linked_card: mockCard({ code: "09001b", type_code: "villain" })
        });

        expect(codes(cleanCards([scheme]))).toEqual(["09001a"]);
    });

    it("normalizes the raw duplicate_of field into duplicate_of_code", () => {
        const rawDuplicate = { ...mockCard({ code: "13015" }), duplicate_of: "01001" } as MCCard;

        const [result] = cleanCards([rawDuplicate]);

        expect(result.duplicate_of_code).toBe("01001");
        expect(result).not.toHaveProperty("duplicate_of");
    });

    it("updates the image of the Quicksilver linked card without mutating the input", () => {
        const quicksilver = mockCard({
            code: "14001a",
            linked_card: mockCard({ code: "14001b", imagesrc: "/bundles/cards/14001a.png" })
        });
        const input = [quicksilver];

        const [result] = cleanCards(input);

        expect(result.linked_card?.imagesrc).toBe("/bundles/cards/14001b.png");
        expect(quicksilver.linked_card?.imagesrc).toBe("/bundles/cards/14001a.png");
    });

    it("does not fail on a Quicksilver card without a linked card", () => {
        const quicksilver = mockCard({ code: "14001a", type_code: "ally" });

        expect(codes(cleanCards([quicksilver]))).toEqual(["14001a"]);
    });
});
