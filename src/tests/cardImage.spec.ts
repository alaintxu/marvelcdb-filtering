import { getCardImageSrc } from "../components/Card/SingleCard/CardImage";
import { MCCard } from "../store/entities/cards";

const mockCard = (overrides: Partial<MCCard> = {}): MCCard => ({
    code: "01001a",
    pack_code: "core",
    pack_name: "Core Set",
    name: "Spider-Man",
    real_name: "Peter Parker",
    type_code: "hero",
    type_name: "Hero",
    faction_code: "spider-man",
    faction_name: "Spider-Man",
    set_code: "core",
    card_set_code: "core_hero",
    card_set_name: "Core Heroes",
    card_set_type_name_code: "hero",
    position: 1,
    linked_to_code: "",
    linked_to_name: "",
    imagesrc: "/bundles/cards/01001a.png",
    ...overrides
});

const OCR_BASEPATH = "https://cdn.jsdelivr.net/gh/alaintxu/mc-ocr@main/images/accepted/";
const ES_BASEPATH = "https://es.marvelcdb.com";
const ENGLISH_BASEPATH = "https://marvelcdb.com";

describe("getCardImageSrc", () => {
    it("should return the translated OCR image as primary for Spanish cards", () => {
        const card = mockCard();
        const src = getCardImageSrc(card, false, "es", "primary");
        expect(src).toBe(OCR_BASEPATH + "01001a.webp");
    });

    it("should fall back to the English image for Spanish cards in the english stage", () => {
        const card = mockCard();
        const src = getCardImageSrc(card, false, "es", "english");
        expect(src).toBe(ENGLISH_BASEPATH + "/bundles/cards/01001a.png");
    });

    it("should return the localized marvelcdb image as primary for non-Spanish languages", () => {
        const card = mockCard();
        const src = getCardImageSrc(card, false, "en", "primary");
        expect(src).toBe(ES_BASEPATH + "/bundles/cards/01001a.png");
    });

    it("should fall back to the English image for non-Spanish languages in the english stage", () => {
        const card = mockCard();
        const src = getCardImageSrc(card, false, "en", "english");
        expect(src).toBe(ENGLISH_BASEPATH + "/bundles/cards/01001a.png");
    });

    it("should use the guessed bundle path when the card has no image source", () => {
        const card = mockCard({ imagesrc: undefined });
        const src = getCardImageSrc(card, false, "en", "english");
        expect(src).toBe(ENGLISH_BASEPATH + "/bundles/cards/01001a.png");
    });

    it("should use the duplicate card code when the card is a duplicate", () => {
        const card = mockCard({ code: "01001b", duplicate_of_code: "01001a", imagesrc: undefined });
        const src = getCardImageSrc(card, false, "en", "english");
        expect(src).toBe(ENGLISH_BASEPATH + "/bundles/cards/01001a.png");
    });

    it("should translate the back image for Spanish cards", () => {
        const card = mockCard({ backimagesrc: "/bundles/cards/01001b.png" });
        const src = getCardImageSrc(card, true, "es", "primary");
        expect(src).toBe(OCR_BASEPATH + "01001b.webp");
    });

    it("should fall back to the English back image for Spanish cards", () => {
        const card = mockCard({ backimagesrc: "/bundles/cards/01001b.png" });
        const src = getCardImageSrc(card, true, "es", "english");
        expect(src).toBe(ENGLISH_BASEPATH + "/bundles/cards/01001b.png");
    });

    it("should keep the OCR back graphic as fallback when there is no English alternative", () => {
        const card = mockCard({
            type_code: "main_scheme",
            linked_card: mockCard({ code: "01002b", type_code: "main_scheme", imagesrc: undefined })
        });
        const primarySrc = getCardImageSrc(card, true, "es", "primary");
        const englishSrc = getCardImageSrc(card, true, "es", "english");
        expect(primarySrc).toBe(OCR_BASEPATH + "01002b.webp");
        expect(englishSrc).toBe(primarySrc);
    });
});
