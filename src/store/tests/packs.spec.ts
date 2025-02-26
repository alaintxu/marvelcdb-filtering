import { loadPacks } from "../entities/packs";
import store from "../configureStore";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();
jest.mock("i18next", () => ({
    t: (key: string) => {
        if (key === "base_path") return "http://localhost:3000";
        return key;
    },
    use: jest.fn(),
    init: jest.fn()
}));

describe("packsSlice", () => {
    describe("loadPacks", () => {
        it("should handle ok response", async () => {
            const expectedPacks = [
                {
                    "code": "core",
                    "name": "Core Set",
                    "position": 1,
                    "cycle_position": 1,
                    "available": true,
                    "known": 1,
                    "total": 1,
                    "url": "https://ringsdb.com/set/core"
                },
                {
                    "code": "second",
                    "name": "Second pack",
                    "position": 2,
                    "cycle_position": 2,
                    "available": true,
                    "known": 10,
                    "total": 11,
                    "url": "https://ringsdb.com/set/second"
                }
            ];
            fetchMock.mockResponseOnce(
                JSON.stringify([...expectedPacks]),
                { status: 200 }
            );

            await store.dispatch(loadPacks());
            //await Promise.resolve();
            expect(store.getState().entities.packs.list).toHaveLength(expectedPacks.length);
            expect(store.getState().entities.packs.list).toEqual(expectedPacks);
            expect(store.getState().entities.packs.error).toBeNull();
            expect(store.getState().entities.packs.loading).toBe(false);
        });
        it("should handle error response", async () => {
            const currentStoreListLength = store.getState().entities.packs.list.length;
            const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
            fetchMock.mockResponseOnce(
                JSON.stringify([]),
                { status: 500 }
            );
            await store.dispatch(loadPacks());
            expect(consoleSpy).toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith("Error fetching data", "500: Internal Server Error");
            expect(store.getState().entities.packs.error).not.toBeNull();
            expect(store.getState().entities.packs.list).toHaveLength(currentStoreListLength);
            expect(store.getState().entities.packs.loading).toBe(false);
        });
    });
});