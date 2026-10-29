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
        expect(container.querySelector(".alert-danger")).toBeNull();
    });

    it("shows an error and imports nothing when the file is not a JSON array", async () => {
        await importFile(container, JSON.stringify({ not: "an array" }));

        expect(selectAllCards(store.getState())).toHaveLength(0);
        expect(container.querySelector(".alert-danger")?.textContent).toContain("expected a JSON array of cards");
    });

    it("shows an error when the file is not valid JSON", async () => {
        await importFile(container, "{invalid json");

        expect(selectAllCards(store.getState())).toHaveLength(0);
        expect(container.querySelector(".alert-danger")).not.toBeNull();
    });
});
