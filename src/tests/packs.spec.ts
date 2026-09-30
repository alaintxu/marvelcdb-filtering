import { loadPacks, selectIsAnyPackDownloading, selectPackStatusBootstrapVariant, loadPackCards } from "../store/entities/packs";
import { createStore, RootState, AppStore, /*StoreType*/ } from "../store/configureStore";
import fetchMock from "jest-fetch-mock";

const JSDELIVR_PACK_CARDS_BASE_URL = "https://cdn.jsdelivr.net/gh/zzorba/marvelsdb-json-data@master/pack/";
jest.mock("i18next", () => {
    const i18nMock: Record<string, unknown> = {
        t: (key: string) => {
            if (key === "base_path") return "http://localhost:3000";
            return key;
        },
        use: () => i18nMock,
        init: jest.fn(),
        language: "en"
    };
    return i18nMock;
});

let store: AppStore;
const packsUrl: string = "https://cdn.jsdelivr.net/gh/zzorba/marvelsdb-json-data@master/packs.json";

const packsSlice = (myStore?: AppStore) => (myStore ||store).getState().entities.packs;

describe("packsSlice", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.enableMocks();
        store = createStore();
    });
    describe("loadPacks", () => {
        it("should handle ok response", async () => {
            // Arrange
            const expectedPacks = [
                {"code": "core"},
                {"code": "second"}
            ];
            fetchMock.mockIf(
                packsUrl,
                JSON.stringify([...expectedPacks]),
                { status: 200 }
            );

            // Act
            await store.dispatch<any>(loadPacks());

            // Assert
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith(packsUrl, expect.anything());

            expect(packsSlice().list).toHaveLength(expectedPacks.length);
            expect(packsSlice().list).toEqual(expectedPacks);
            expect(packsSlice().error).toBeNull();
            expect(packsSlice().loading).toBe(false);
        });
        it("should handle error response", async () => {
            // Arrange
            const currentStoreListLength = store.getState().entities.packs.list.length;
            const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
            fetchMock.mockIf(
                packsUrl,
                JSON.stringify([]),
                { status: 500 }
            );

            // Act
            await store.dispatch<any>(loadPacks());

            // Assert
            expect(consoleSpy).toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith("Error fetching data", "500: Internal Server Error");

            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith(packsUrl, expect.anything());

            expect(packsSlice().error).not.toBeNull();
            expect(packsSlice().list).toHaveLength(currentStoreListLength);
            expect(packsSlice().loading).toBe(false);
        });
    });
    describe("selectIsAnyPackDownloading", () => {
        it("should return false if no pack is downloading", () => {
            const mockState: RootState = {
                entities: {
                    packs: {
                        list: [
                            { code: "core" },
                            { code: "second" }
                        ],
                        loading: false,
                        lastFetch: 0,
                        error: null,
                        packCardLoadByCode: {
                            core: { status: "downloaded" },
                            second: { status: "downloaded" }
                        }
                    }
                }
            };
            const result = selectIsAnyPackDownloading(mockState);

            expect(result).toBe(false);
        });
        it("should return true if any pack is downloading", () => {
            const mockState: RootState = {
                entities: {
                    packs: {
                        list: [
                            { code: "core" },
                            { code: "second" }
                        ],
                        loading: false,
                        lastFetch: 0,
                        error: null,
                        packCardLoadByCode: {
                            core: { status: "downloaded" },
                            second: { status: "downloading" }
                        }
                    }
                }
            };
            const result = selectIsAnyPackDownloading(mockState);

            expect(result).toBe(true);
        });
    });
    describe("selectPackStatusBootstrapVariant", () => {
        it("should return 'success' if all packs are downloaded", () => {
            const mockState: RootState = {
                entities: {
                    packs: {
                        list: [
                            { code: "core" },
                            { code: "second" }
                        ],
                        loading: false,
                        lastFetch: 0,
                        error: null,
                        packCardLoadByCode: {
                            core: { status: "downloaded" },
                            second: { status: "downloaded" }
                        }
                    }
                }
            };
            const result = selectPackStatusBootstrapVariant(mockState);

            expect(result).toBe("success");
        });
        it("should return 'danger' if less than 25% of packs are downloaded", () => {
            const mockState: RootState = {
                entities: {
                    packs: {
                        list: [
                            { code: "core" },
                            { code: "second" },
                            { code: "third" },
                            { code: "fourth" },
                            { code: "fifth" }
                        ],
                        loading: false,
                        lastFetch: 0,
                        error: null,
                        packCardLoadByCode: {
                            core: { status: "idle" },
                            second: { status: "idle" },
                            third: { status: "idle" },
                            fourth: { status: "downloaded" },
                            fifth: { status: "error" }
                        }
                    }
                }
            };
            const result = selectPackStatusBootstrapVariant(mockState);

            expect(result).toBe("danger");
        });
        it("should return 'warning' if more than 25% but less than 100% of packs are downloaded", () => {
            const mockState: RootState = {
                entities: {
                    packs: {
                        list: [
                            { code: "core" },
                            { code: "second" },
                            { code: "third" },
                            { code: "fourth" }
                        ],
                        loading: false,
                        lastFetch: 0,
                        error: null,
                        packCardLoadByCode: {
                            core: { status: "idle" },
                            second: { status: "idle" },
                            third: { status: "idle" },
                            fourth: { status: "downloaded" }
                        }
                    }
                }
            };
            const result = selectPackStatusBootstrapVariant(mockState);

            expect(result).toBe("warning");
        });
        it("should return 'dark' if any pack is downloading", () => {
            const mockState: RootState = {
                entities: {
                    packs: {
                        list: [
                            { code: "core" },
                            { code: "second" },
                            { code: "third" },
                            { code: "fourth" },
                            { code: "fifth" }
                        ],
                        loading: false,
                        lastFetch: 0,
                        error: null,
                        packCardLoadByCode: {
                            core: { status: "idle" },
                            second: { status: "idle" },
                            third: { status: "downloading" },
                            fourth: { status: "downloaded" },
                            fifth: { status: "error" }
                        }
                    }
                }
            };
            const result = selectPackStatusBootstrapVariant(mockState);

            expect(result).toBe("dark");
        });
    });
    describe("loadPackCards", () => {
        it("should handle ok response", async () => {
            // Arrange
            const testStore: AppStore = createStore({
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
            const packCode = "core";
            const url = `${JSDELIVR_PACK_CARDS_BASE_URL}${packCode}.json`;
            const expectedPackCards = [
                {"code": "card1", pack_code: packCode},
                {"code": "card2", pack_code: packCode}
            ];
            fetchMock.mockIf(
                url,
                JSON.stringify(expectedPackCards),
                { status: 200 }
            );

            // Act
            await testStore.dispatch<any>(loadPackCards("core", "core"));

            // Assert
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith(url, expect.anything());

            expect(packsSlice(testStore).packCardLoadByCode[packCode].status).toEqual("downloaded");
        });
    });
});