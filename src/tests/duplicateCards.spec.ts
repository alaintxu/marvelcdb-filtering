import reducer, {
    cardsReceived,
    cardsRestored,
    MCCard
} from "../store/entities/cards";
import {
    filterDuplicates,
    normalizeDuplicateOfField,
    resolveDuplicateCards
} from "../store/entities/cardsModificationUtils";

const mockCard = (overrides: Partial<MCCard> = {}): MCCard => ({
    code: "01055",
    pack_code: "core",
    pack_name: "Core Set",
    name: "The Power of Aggression",
    real_name: "The Power of Aggression",
    text: "Max 2 per deck.",
    traits: "Weapon.",
    type_code: "resource",
    type_name: "Resource",
    faction_code: "aggression",
    faction_name: "Aggression",
    set_code: "core",
    card_set_code: "core_hero",
    card_set_name: "Core Heroes",
    card_set_type_name_code: "hero",
    position: 55,
    quantity: 2,
    linked_to_code: "",
    linked_to_name: "",
    ...overrides
});

/* Bare duplicate entry as returned by the API */
const mockRawDuplicate = (overrides: Partial<MCCard> = {}): MCCard => ({
    code: "13015",
    duplicate_of: "01055",
    pack_code: "wsp",
    pack_name: "Wasp",
    position: 15,
    quantity: 2,
    ...overrides
} as MCCard);

describe("normalizeDuplicateOfField", () => {
    it("should map the raw duplicate_of field to duplicate_of_code", () => {
        const cards = normalizeDuplicateOfField([mockRawDuplicate()]);
        expect(cards[0].duplicate_of_code).toBe("01055");
        expect((cards[0] as MCCard & { duplicate_of?: string }).duplicate_of).toBeUndefined();
    });

    it("should keep cards without the raw duplicate_of field untouched", () => {
        const card = mockCard();
        const cards = normalizeDuplicateOfField([card]);
        expect(cards[0]).toBe(card);
    });

    it("should not override an existing duplicate_of_code", () => {
        const cards = normalizeDuplicateOfField([
            mockRawDuplicate({ duplicate_of_code: "09999" })
        ]);
        expect(cards[0].duplicate_of_code).toBe("09999");
    });
});

describe("resolveDuplicateCards", () => {
    it("should fill the duplicate card with the data of the original card", () => {
        const original = mockCard();
        const duplicate = mockRawDuplicate({ duplicate_of_code: "01055" });
        const resolved = resolveDuplicateCards([original, duplicate]);

        const resolvedDuplicate = resolved.find((card) => card.code === "13015")!;
        expect(resolvedDuplicate.name).toBe(original.name);
        expect(resolvedDuplicate.text).toBe(original.text);
        expect(resolvedDuplicate.traits).toBe(original.traits);
        expect(resolvedDuplicate.type_code).toBe(original.type_code);
        expect(resolvedDuplicate.faction_code).toBe(original.faction_code);
        expect(resolvedDuplicate.duplicate_of_name).toBe(original.name);
    });

    it("should keep the duplicate identity fields", () => {
        const original = mockCard();
        const duplicate = mockRawDuplicate({ duplicate_of_code: "01055" });
        const resolved = resolveDuplicateCards([original, duplicate]);

        const resolvedDuplicate = resolved.find((card) => card.code === "13015")!;
        expect(resolvedDuplicate.code).toBe("13015");
        expect(resolvedDuplicate.pack_code).toBe("wsp");
        expect(resolvedDuplicate.position).toBe(15);
        expect(resolvedDuplicate.quantity).toBe(2);
        expect(resolvedDuplicate.duplicate_of_code).toBe("01055");
    });

    it("should keep the duplicate own data over the original data", () => {
        const original = mockCard();
        const duplicate = mockRawDuplicate({ duplicate_of_code: "01055", name: "Translated name" });
        const resolved = resolveDuplicateCards([original, duplicate]);

        const resolvedDuplicate = resolved.find((card) => card.code === "13015")!;
        expect(resolvedDuplicate.name).toBe("Translated name");
    });

    it("should not modify cards without duplicate_of_code", () => {
        const card = mockCard();
        const resolved = resolveDuplicateCards([card]);
        expect(resolved[0]).toBe(card);
    });

    it("should leave the duplicate untouched when the original card is not loaded", () => {
        const duplicate = mockRawDuplicate({ duplicate_of_code: "01055" });
        const resolved = resolveDuplicateCards([duplicate]);
        expect(resolved[0]).toBe(duplicate);
    });
});

describe("filterDuplicates", () => {
    const original = mockCard();
    const duplicate = mockRawDuplicate({ duplicate_of_code: "01055" });

    it("should hide the duplicate and merge quantities when hiding duplicates", () => {
        const filtered = filterDuplicates([original, duplicate], true);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].code).toBe("01055");
        expect(filtered[0].quantity).toBe(4);
    });

    it("should hide the duplicate when it comes before the original", () => {
        const filtered = filterDuplicates([duplicate, original], true);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].code).toBe("01055");
        expect(filtered[0].quantity).toBe(4);
    });

    it("should keep the duplicate when the original card is not in the list", () => {
        const filtered = filterDuplicates([duplicate], true);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].code).toBe("13015");
    });

    it("should keep every card when showing duplicates", () => {
        const filtered = filterDuplicates([original, duplicate], false);
        expect(filtered).toHaveLength(2);
    });
});

describe("cards reducer with duplicate cards", () => {
    it("should normalize the duplicate_of field when cards are received", () => {
        const state = reducer([], cardsReceived([mockRawDuplicate()]));
        expect(state[0].duplicate_of_code).toBe("01055");
        expect((state[0] as MCCard & { duplicate_of?: string }).duplicate_of).toBeUndefined();
    });

    it("should normalize the duplicate_of field when cards are restored", () => {
        const received = reducer([], cardsReceived([mockRawDuplicate()]));
        const state = reducer([], cardsRestored(received));
        expect(state).toHaveLength(1);
        expect(state[0].duplicate_of_code).toBe("01055");
        expect((state[0] as MCCard & { duplicate_of?: string }).duplicate_of).toBeUndefined();
    });
});
