import "fake-indexeddb/auto";
import fetchMock from "jest-fetch-mock";
import { AppStore, createStore } from "../store/configureStore";
import { cardsReceived, MCCard, removeAllCards, selectAllCards } from "../store/entities/cards";
import { packCardsHydrated, selectPackStatusByCode, unloadPackCards } from "../store/entities/packs";
import { hydratePersistedCards, downloadSelectedPackCards, selectedPackCodesSet, selectSelectedPackCodes } from "../store/ui/selectedPacks";
import { clearPersistedCards, deletePackCards, loadPersistedPacks, savePackCards } from "../store/persistence/cardsDb";

jest.mock("i18next", () => {
    const i18nMock: Record<string, unknown> = {
        t: (key: string) => key,
        use: () => i18nMock,
        init: jest.fn(),
        language: "en"
    };
    return i18nMock;
});

const CARDS_PERSIST_DEBOUNCE_MS = 300;
const waitForDebounce = () => new Promise((resolve) => setTimeout(resolve, CARDS_PERSIST_DEBOUNCE_MS + 200));

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

const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 50));

describe("cardsDb", () => {
    beforeEach(async () => {
        await clearPersistedCards();
    });

    it("should save and load pack cards", async () => {
        const cards = [mockCard("card1", "core"), mockCard("card2", "core")];
        await savePackCards("en", "core", cards);

        const persistedPacks = await loadPersistedPacks("en");
        expect(persistedPacks["core"].cards).toEqual(cards);
        expect(persistedPacks["core"].savedAt).toBeGreaterThan(0);
    });

    it("should not load packs of other languages", async () => {
        await savePackCards("en", "core", [mockCard("card1", "core")]);

        const persistedPacks = await loadPersistedPacks("es");
        expect(Object.keys(persistedPacks)).toHaveLength(0);
    });

    it("should delete a single pack", async () => {
        await savePackCards("en", "core", [mockCard("card1", "core")]);
        await savePackCards("en", "second", [mockCard("card2", "second")]);

        await deletePackCards("en", "core");

        const persistedPacks = await loadPersistedPacks("en");
        expect(persistedPacks["core"]).toBeUndefined();
        expect(persistedPacks["second"]).toBeDefined();
    });
});

describe("persistence middleware", () => {
    let store: AppStore;

    beforeEach(async () => {
        fetchMock.resetMocks();
        fetchMock.enableMocks();
        await clearPersistedCards();
        store = createStore();
    });

    it("should save downloaded cards to IndexedDB after the debounce", async () => {
        // Act
        store.dispatch<any>(cardsReceived([mockCard("card1", "core"), mockCard("card2", "core")]));
        await waitForDebounce();

        // Assert
        const persistedPacks = await loadPersistedPacks("en");
        expect(persistedPacks["core"].cards).toHaveLength(2);
    });

    it("should delete the pack from IndexedDB when it is unloaded", async () => {
        // Arrange
        store.dispatch<any>(cardsReceived([mockCard("card1", "core")]));
        await waitForDebounce();
        expect((await loadPersistedPacks("en"))["core"]).toBeDefined();

        // Act
        store.dispatch<any>(unloadPackCards("core"));
        await flushMicrotasks();

        // Assert
        expect((await loadPersistedPacks("en"))["core"]).toBeUndefined();
    });

    it("should clear IndexedDB when all cards are removed", async () => {
        // Arrange
        store.dispatch<any>(cardsReceived([mockCard("card1", "core")]));
        await waitForDebounce();
        expect((await loadPersistedPacks("en"))["core"]).toBeDefined();

        // Act
        store.dispatch<any>(removeAllCards());
        await flushMicrotasks();

        // Assert
        expect(await loadPersistedPacks("en")).toEqual({});
    });
});

describe("hydratePersistedCards", () => {
    let store: AppStore;

    beforeEach(async () => {
        fetchMock.resetMocks();
        fetchMock.enableMocks();
        await clearPersistedCards();
        store = createStore();
    });

    it("should restore cards and pack statuses from IndexedDB", async () => {
        // Arrange
        const cards = [mockCard("card1", "core"), mockCard("card2", "core")];
        await savePackCards("en", "core", cards);

        // Act
        const hydratedPackCodes = await store.dispatch<any>(hydratePersistedCards());

        // Assert
        expect(hydratedPackCodes).toEqual(["core"]);
        expect(selectAllCards(store.getState())).toEqual(cards);
        expect(selectPackStatusByCode("core")(store.getState())).toBe("downloaded");
    });

    it("should not dispatch anything when IndexedDB is empty", async () => {
        // Act
        const hydratedPackCodes = await store.dispatch<any>(hydratePersistedCards());

        // Assert
        expect(hydratedPackCodes).toEqual([]);
        expect(selectAllCards(store.getState())).toHaveLength(0);
    });
});

describe("downloadSelectedPackCards", () => {
    let store: AppStore;

    beforeEach(async () => {
        fetchMock.resetMocks();
        fetchMock.enableMocks();
        await clearPersistedCards();
    });

    const createStoreWithPacks = (): AppStore => createStore({
        entities: {
            packs: {
                list: [
                    { code: "core", pack_type_code: "core" },
                    { code: "second", pack_type_code: "pack" }
                ],
                loading: false,
                lastFetch: 0,
                error: null,
                packCardLoadByCode: {}
            }
        }
    });

    it("should only download selected packs that are not already downloaded", async () => {
        // Arrange
        store = createStoreWithPacks();
        fetchMock.mockResponse(JSON.stringify([mockCard("card2", "second")]));
        store.dispatch<any>(selectedPackCodesSet(["core", "second"]));
        store.dispatch<any>(packCardsHydrated({ packCode: "core", download_date: 123 }));

        // Act
        store.dispatch<any>(downloadSelectedPackCards());
        await flushMicrotasks();

        // Assert
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining("pack/second.json"),
            expect.anything()
        );
        expect(selectSelectedPackCodes(store.getState())).toEqual(["core", "second"]);
    });

    it("should download every selected pack when the store is empty", async () => {
        // Arrange
        store = createStoreWithPacks();
        fetchMock.mockResponse(JSON.stringify([mockCard("card1", "core")]));
        store.dispatch<any>(selectedPackCodesSet(["core", "second"]));

        // Act
        store.dispatch<any>(downloadSelectedPackCards());
        await flushMicrotasks();

        // Assert
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});
