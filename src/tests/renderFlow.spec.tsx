import "fake-indexeddb/auto";
import { enableMapSet } from "immer";
import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { Provider } from "react-redux";
import fetchMock from "jest-fetch-mock";
import { AppStore, createStore } from "../store/configureStore";
import { selectedPackCodesSet } from "../store/ui/selectedPacks";
import { clearPersistedCards, savePackCards } from "../store/persistence/cardsDb";
import { MCCard } from "../store/entities/cards";
import MainLayout from "../components/MainLayout";

enableMapSet();

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
        i18n: {
            language: "en",
            on: jest.fn(),
            off: jest.fn(),
            changeLanguage: jest.fn()
        }
    }),
    initReactI18next: { type: "3rdParty", init: jest.fn() }
}));

// react-markdown is ESM-only, not transformable by ts-jest in jsdom tests
jest.mock("react-markdown", () => ({
    __esModule: true,
    default: () => null
}));

// react-lazy-load-image-component requires browser APIs jsdom does not implement
jest.mock("react-lazy-load-image-component", () => ({
    __esModule: true,
    LazyLoadImage: () => null
}));

// jsdom lacks IntersectionObserver, required by react-lazy-load-image-component
class MockIntersectionObserver {
    observe() { /* noop */ }
    unobserve() { /* noop */ }
    disconnect() { /* noop */ }
    takeRecords() { return []; }
}
if (typeof globalThis.IntersectionObserver === "undefined") {
    (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = MockIntersectionObserver;
}

const mockCard = (code: string, packCode: string): MCCard => ({
    code,
    pack_code: packCode,
    pack_name: "Core Set",
    name: `Card ${code}`,
    real_name: `Card ${code}`,
    type_code: "hero",
    type_name: "Hero",
    faction_code: "justice",
    faction_name: "Justice",
    set_code: "core",
    card_set_code: "core_hero",
    card_set_name: "Core Heroes",
    card_set_type_name_code: "hero",
    position: 1,
    linked_to_code: "",
    linked_to_name: ""
});

const MOCK_PACKS = [
    { code: "core", name: "Core Set", pack_type_code: "core", position: 1, size: 206, date_release: "2019-08-30", cgdb_id: 1, octgn_id: "" },
    { code: "w01", name: "The Wings of Niflheim", pack_type_code: "pack", position: 2, size: 57, date_release: "2019-11-08", cgdb_id: 2, octgn_id: "" },
    { code: "green_goblin", name: "Green Goblin", pack_type_code: "scenario", position: 3, size: 57, date_release: "2019-09-12", cgdb_id: 3, octgn_id: "" },
    { code: "rhino", name: "Rhino", pack_type_code: "scenario", position: 4, size: 46, date_release: "2019-08-30", cgdb_id: 4, octgn_id: "" }
];

const MOCK_PACK_CARDS: Record<string, MCCard[]> = {
    core: [mockCard("corecard1", "core"), mockCard("corecard2", "core")],
    w01: [mockCard("w01card1", "w01")]
};

const MOCK_PACK_ENCOUNTER_CARDS: Record<string, MCCard[]> = {
    core: [mockCard("coreenc1", "core")],
    green_goblin: [mockCard("ggenc1", "green_goblin"), mockCard("ggenc2", "green_goblin")],
    rhino: [mockCard("rhenc1", "rhino")]
};

const mockResponseFor = (url: string): { status: number; body: string } => {
    if (/packs\.json$/.test(url)) {
        return { status: 200, body: JSON.stringify(MOCK_PACKS) };
    }
    const packMatch = url.match(/pack\/([\w-]+?)(_encounter)?\.json$/);
    if (packMatch) {
        const [, packCode, isEncounter] = packMatch;
        const cards = isEncounter
            ? (MOCK_PACK_ENCOUNTER_CARDS[packCode] ?? [])
            : (MOCK_PACK_CARDS[packCode] ?? []);
        return { status: 200, body: JSON.stringify(cards) };
    }
    if (/\/translations\//.test(url)) {
        return { status: 404, body: "not found" };
    }
    // factions.json, types.json, sets.json from the local API
    return { status: 200, body: JSON.stringify([]) };
};

describe("MainLayout render flow", () => {
    let container: HTMLElement;
    let root: Root;
    let store: AppStore;
    let consoleErrors: string[][];
    let consoleErrorSpy: jest.SpyInstance;

    const renderLayout = async () => {
        await act(async () => {
            root.render(<Provider store={store}><MainLayout /></Provider>);
        });
    };

    const flush = async (ms: number) => {
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, ms));
        });
    };

    beforeEach(async () => {
        fetchMock.resetMocks();
        fetchMock.enableMocks();
        await clearPersistedCards();

        consoleErrors = [];
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
            consoleErrors.push(args.map(String));
        });

        container = document.createElement("div");
        document.body.appendChild(container);
        (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
        root = createRoot(container);

        // Route every request through a single mock implementation
        // (jest-fetch-mock's mockIf replaces previous matchers instead of accumulating them).
        fetchMock.mockResponse(async (req) => {
            const { status, body } = mockResponseFor(req.url);
            return { status, body };
        });
    });

    afterEach(async () => {
        consoleErrorSpy.mockRestore();
        await act(async () => { root.unmount(); });
        container.remove();
        await clearPersistedCards();
    });

    it("should not enter an update loop when restoring persisted cards", async () => {
        // Arrange: a previous session downloaded the core pack
        await savePackCards("en", "core", [mockCard("corecard1", "core"), mockCard("corecard2", "core")]);
        store = createStore();

        // Act: mount (hydration), then select the pack as a returning user would have it
        await renderLayout();
        await flush(100);
        await act(async () => {
            store.dispatch(selectedPackCodesSet(["core"]));
        });
        await flush(1500);

        // Assert: no React update loop errors
        const depthErrors = consoleErrors.filter(args => args.join(" ").includes("Maximum update depth"));
        expect(depthErrors).toEqual([]);

        // Assert: no runaway refetching of pack data
        const packFetches = fetchMock.mock.calls.filter(([url]) => String(url).includes("/pack/core"));
        expect(packFetches.length).toBeLessThanOrEqual(4);
    }, 20000);

    it("should not enter an update loop on first visit (empty IndexedDB)", async () => {
        store = createStore();

        await renderLayout();
        await flush(100);
        await act(async () => {
            store.dispatch(selectedPackCodesSet(["core"]));
        });
        await flush(1500);

        const depthErrors = consoleErrors.filter(args => args.join(" ").includes("Maximum update depth"));
        expect(depthErrors).toEqual([]);

        const packFetches = fetchMock.mock.calls.filter(([url]) => String(url).includes("/pack/core"));
        expect(packFetches.length).toBeLessThanOrEqual(4);
    }, 20000);

    it("should download a scenario pack only once", async () => {
        store = createStore();

        await renderLayout();
        await flush(100);
        await act(async () => {
            store.dispatch(selectedPackCodesSet(["green_goblin"]));
        });
        await flush(1500);

        const depthErrors = consoleErrors.filter(args => args.join(" ").includes("Maximum update depth"));
        expect(depthErrors).toEqual([]);

        const encounterFetches = fetchMock.mock.calls.filter(([url]) => String(url).includes("green_goblin_encounter"));
        expect(encounterFetches.length).toBeLessThanOrEqual(2);
    }, 20000);

    it("should not refetch packs when downloading several at once", async () => {
        store = createStore();

        await renderLayout();
        await flush(100);
        await act(async () => {
            store.dispatch(selectedPackCodesSet(["core", "w01", "green_goblin", "rhino"]));
        });
        await flush(2500);

        const depthErrors = consoleErrors.filter(args => args.join(" ").includes("Maximum update depth"));
        expect(depthErrors).toEqual([]);

        // Each pack (including scenario packs) must be fetched at most twice
        // (initial attempt + at most one effect-triggered retry while in flight).
        const countFetches = (pattern: RegExp) =>
            fetchMock.mock.calls.filter(([url]) => pattern.test(String(url))).length;
        expect(countFetches(/green_goblin_encounter/)).toBeLessThanOrEqual(2);
        expect(countFetches(/rhino_encounter/)).toBeLessThanOrEqual(2);
        expect(countFetches(/pack\/core\.json/)).toBeLessThanOrEqual(2);
        expect(countFetches(/pack\/w01\.json/)).toBeLessThanOrEqual(2);

        // Scenario packs must reach the downloaded status so they are never re-dispatched.
        const packStates = store.getState().entities.packs.packCardLoadByCode;
        expect(packStates["green_goblin"]?.status).toBe("downloaded");
        expect(packStates["rhino"]?.status).toBe("downloaded");
    }, 20000);
});
