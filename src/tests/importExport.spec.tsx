import "fake-indexeddb/auto";
import { enableMapSet } from "immer";
import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { Provider } from "react-redux";
import { AppStore, createStore } from "../store/configureStore";
import { MCCard, selectAllCards } from "../store/entities/cards";
import { selectPackStatusByCode } from "../store/entities/packs";
import { selectSelectedPackCodes } from "../store/ui/selectedPacks";
import ImportExportSection from "../components/DownloadManager/ImportExport/ImportExportSection";
import DeckImportExportSection from "../components/DownloadManager/ImportExport/DeckImportExportSection";
import { selectDeckSlice } from "../store/entities/decks";
import fetchMock from "jest-fetch-mock";

enableMapSet();

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

jest.mock("i18next", () => {
    const i18nMock: Record<string, unknown> = {
        t: (key: string) => key,
        use: () => i18nMock,
        init: jest.fn(),
        language: "en"
    };
    return i18nMock;
});

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: "en", on: jest.fn(), off: jest.fn(), changeLanguage: jest.fn() }
    }),
    initReactI18next: { type: "3rdParty", init: jest.fn() }
}));

const makeCard = (code: string, packCode: string): MCCard => ({
    code,
    name: `Card ${code}`,
    real_name: `Card ${code}`,
    pack_code: packCode,
    pack_name: packCode,
    card_set_code: code,
    card_set_name: code,
    card_set_type_name_code: "",
    set_code: code,
    faction_code: "hero",
    faction_name: "Hero",
    linked_to_code: "",
    linked_to_name: "",
    position: 1,
    type_code: "ally",
    type_name: "Ally",
});

const importFile = async (container: HTMLElement, content: string) => {
    const input = container.querySelector<HTMLInputElement>("#importFileInput")!;
    // jsdom's File does not implement text(), which the importer uses to read the file
    const file = { name: "cards.json", text: () => Promise.resolve(content) };
    Object.defineProperty(input, "files", { value: [file], configurable: true });
    await act(async () => {
        input.dispatchEvent(new Event("change", { bubbles: true }));
        await new Promise((resolve) => setTimeout(resolve, 50));
    });
};

const importDeckIds = async (container: HTMLElement, content: string) => {
    const input = container.querySelector<HTMLInputElement>("#importDeckIdsFileInput")!;
    const file = { name: "decks.json", text: () => Promise.resolve(content) };
    Object.defineProperty(input, "files", { value: [file], configurable: true });
    await act(async () => {
        input.dispatchEvent(new Event("change", { bubbles: true }));
        await new Promise((resolve) => setTimeout(resolve, 50));
    });
};

describe("ImportExportSection import", () => {
    let container: HTMLDivElement;
    let root: Root;
    let store: AppStore;

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
        store = createStore();
        root = createRoot(container);
        act(() => {
            root.render(
                <Provider store={store}>
                    <ImportExportSection />
                </Provider>
            );
        });
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
    });

    it("adds imported cards, selects their packs and marks them as loaded", async () => {
        const cards = [makeCard("01001a", "core"), makeCard("01002a", "core"), makeCard("02001a", "nova")];

        await importFile(container, JSON.stringify(cards));

        expect(selectAllCards(store.getState()).map((card: MCCard) => card.code)).toEqual(
            expect.arrayContaining(["01001a", "01002a", "02001a"])
        );
        expect(selectSelectedPackCodes(store.getState())).toEqual(expect.arrayContaining(["core", "nova"]));
        expect(selectPackStatusByCode("core")(store.getState())).toBe("downloaded");
        expect(selectPackStatusByCode("nova")(store.getState())).toBe("downloaded");
        expect(container.querySelector("[data-variant='danger']")).toBeNull();
    });

    it("shows an error and imports nothing when the file is not a JSON array", async () => {
        await importFile(container, JSON.stringify({ not: "an array" }));

        expect(selectAllCards(store.getState())).toHaveLength(0);
        expect(container.querySelector("[data-variant='danger']")?.textContent).toContain("expected a JSON array of cards");
    });

    it("shows an error when the file is not valid JSON", async () => {
        await importFile(container, "{invalid json");

        expect(selectAllCards(store.getState())).toHaveLength(0);
        expect(container.querySelector("[data-variant='danger']")).not.toBeNull();
    });
});

describe("DeckImportExportSection import", () => {
    let container: HTMLDivElement;
    let root: Root;
    let store: AppStore;

    const deckResponse = (id: number) => ({
        id,
        name: `Deck ${id}`,
        slots: {},
        hero_code: "01001a",
        date_creation: "2020-01-01T00:00:00Z",
        date_update: "2020-01-01T00:00:00Z",
        description_md: "",
        meta: '{"aspect":"aggression"}',
        tags: "",
        version: "1.0",
        cards: [],
        hero_name: "Hero",
        investigator_name: "Hero",
    });

    const bookmarkedDeckIds = () => Object.keys(selectDeckSlice(store.getState()).decks).map(Number);

    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.enableMocks();
        fetchMock.mockResponse((req) => {
            const id = Number(req.url.split("/").pop());
            return Promise.resolve(JSON.stringify(deckResponse(id)));
        });
        container = document.createElement("div");
        document.body.appendChild(container);
        store = createStore();
        root = createRoot(container);
        act(() => {
            root.render(
                <Provider store={store}>
                    <DeckImportExportSection />
                </Provider>
            );
        });
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
    });

    it("bookmarks only the deck IDs that are not already bookmarked", async () => {
        await importDeckIds(container, "[100]");
        fetchMock.mockClear();

        await importDeckIds(container, "[100, 200, 200]");

        expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([expect.stringContaining("/decklist/200")]);
        expect(bookmarkedDeckIds()).toEqual(expect.arrayContaining([100, 200]));
        expect(container.querySelector("[data-variant='danger']")).toBeNull();
    });

    it("shows an error and bookmarks nothing when the file is not an array of IDs", async () => {
        await importDeckIds(container, '["abc"]');

        expect(fetchMock).not.toHaveBeenCalled();
        expect(bookmarkedDeckIds()).toHaveLength(0);
        expect(container.querySelector("[data-variant='danger']")?.textContent).toContain("expected a JSON array of deck IDs");
    });
});
