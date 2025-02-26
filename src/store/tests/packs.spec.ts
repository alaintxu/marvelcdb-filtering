import { loadPacks, selectIsAnyPackDownloading, selectPackStatusBootstrapVariant, loadPackCards, Pack } from "../entities/packs";
import { createStore, RootState, StoreType } from "../configureStore";
import fetchMock from "jest-fetch-mock";

const MOCK_BASE_PATH = "http://localhost:3000";
jest.mock("i18next", () => ({
    t: (key: string) => {
        if (key === "base_path") return MOCK_BASE_PATH;
        return key;
    },
    use: jest.fn(),
    init: jest.fn()
}));

let store: StoreType;
const packsUrl: string = `${MOCK_BASE_PATH}/api/public/packs/`
const packCardsBaseUrl: string = `${MOCK_BASE_PATH}/api/public/cards/`;

const packsSlice = (myStore?: StoreType) => (myStore ||store).getState().entities.packs;

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
            await store.dispatch(loadPacks());

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
            await store.dispatch(loadPacks());

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
                            { code: "core", download_status: "downloaded" },
                            { code: "second", download_status: "downloaded" }
                        ],
                        loading: false,
                        lastFetch: 0,
                        error: null
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
                            { code: "core", download_status: "downloaded" },
                            { code: "second", download_status: "downloading" }
                        ],
                        loading: false,
                        lastFetch: 0,
                        error: null
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
                            { code: "core", download_status: "downloaded" },
                            { code: "second", download_status: "downloaded" }
                        ],
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
                            { code: "core", download_status: "unselected" },
                            { code: "second", download_status: "selected" },
                            { code: "third", download_status: "unselected" },
                            { code: "fourth", download_status: "downloaded" },
                            { code: "fifth", download_status: "error" }
                        ],
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
                            { code: "core", download_status: "unselected" },
                            { code: "second", download_status: "selected" },
                            { code: "third", download_status: "unselected" },
                            { code: "fourth", download_status: "downloaded" },
                        ],
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
                            { code: "core", download_status: "unselected" },
                            { code: "second", download_status: "selected" },
                            { code: "third", download_status: "downloading" },
                            { code: "fourth", download_status: "downloaded" },
                            { code: "fourth", download_status: "error" },
                        ],
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
            const testStore: StoreType = createStore({
                entities: {
                    packs: {
                        list: [
                            { code: "core", download_status: "selected" },
                            { code: "second", download_status: "unselected" }
                        ],
                    }
                }
            });
            const packCode = "core";
            const url = `${packCardsBaseUrl}${packCode}.json`;
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
            await testStore.dispatch(loadPackCards("core"));

            // Assert
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith(url, expect.anything());

            const packIndex = (packsSlice(testStore).list).findIndex((pack: Pack) => pack.code === packCode)
            expect(packsSlice(testStore).list[packIndex].download_status).toEqual("downloaded");
        });
    });
});