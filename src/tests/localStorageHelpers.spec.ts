import {
    getFromLocalStorage,
    getFromLocalStorageCompressed,
    removeOldLocalStorageItems,
    saveToLocalStorage,
    saveToLocalStorageCompressed,
} from "../LocalStorageHelpers";

beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
});

describe("saveToLocalStorage", () => {
    it("stores arrays and objects as JSON and returns true", () => {
        expect(saveToLocalStorage("codes", ["01001", "02002"])).toBe(true);
        expect(localStorage.getItem("codes")).toBe('["01001","02002"]');

        saveToLocalStorage("decks", { 1001: { name: "Spider Deck" } });
        expect(localStorage.getItem("decks")).toBe('{"1001":{"name":"Spider Deck"}}');
    });

    it("stores numbers and booleans as JSON", () => {
        saveToLocalStorage("perPage", 25);
        saveToLocalStorage("flag", false);

        expect(localStorage.getItem("perPage")).toBe("25");
        expect(localStorage.getItem("flag")).toBe("false");
    });

    it("returns false and logs an error when the value cannot be serialized", () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
        const circular: Record<string, unknown> = {};
        circular.self = circular;

        expect(saveToLocalStorage("circular", circular)).toBe(false);
        expect(localStorage.getItem("circular")).toBeNull();
        expect(consoleError).toHaveBeenCalled();
        consoleError.mockRestore();
    });

    it("returns false and logs an error when the storage write fails", () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
        jest.mocked(localStorage.setItem).mockImplementationOnce(() => {
            throw new Error("QuotaExceededError");
        });

        expect(saveToLocalStorage("codes", ["01001"])).toBe(false);
        expect(consoleError).toHaveBeenCalled();
        consoleError.mockRestore();
    });
});

describe("getFromLocalStorage", () => {
    it("returns undefined when the key does not exist", () => {
        expect(getFromLocalStorage("missing")).toBeUndefined();
    });

    it("parses numbers, including zero", () => {
        localStorage.setItem("perPage", "25");
        localStorage.setItem("zero", "0");

        expect(getFromLocalStorage<number>("perPage")).toBe(25);
        expect(getFromLocalStorage<number>("zero")).toBe(0);
    });

    it("parses arrays and objects", () => {
        localStorage.setItem("codes", '["01001","02002"]');
        localStorage.setItem("decks", '{"1001":{"name":"Spider Deck"}}');

        expect(getFromLocalStorage<string[]>("codes")).toEqual(["01001", "02002"]);
        expect(getFromLocalStorage<Record<string, { name: string }>>("decks")).toEqual({ 1001: { name: "Spider Deck" } });
    });

    it("parses true, false and null", () => {
        localStorage.setItem("on", "true");
        localStorage.setItem("off", "false");
        localStorage.setItem("empty", "null");

        expect(getFromLocalStorage<boolean>("on")).toBe(true);
        expect(getFromLocalStorage<boolean>("off")).toBe(false);
        expect(getFromLocalStorage<null>("empty")).toBeNull();
    });

    it("returns plain text that is not JSON as it is", () => {
        localStorage.setItem("language", "es");

        expect(getFromLocalStorage<string>("language")).toBe("es");
    });

    it("returns undefined and logs an error when the stored JSON is malformed", () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
        localStorage.setItem("broken", "{not json}");

        expect(getFromLocalStorage("broken")).toBeUndefined();
        expect(consoleError).toHaveBeenCalled();
        consoleError.mockRestore();
    });

    it("reads back what saveToLocalStorage wrote", () => {
        const codes = ["01001", "02002"];
        saveToLocalStorage("codes", codes);

        expect(getFromLocalStorage<string[]>("codes")).toEqual(codes);
    });
});

describe("removeOldLocalStorageItems", () => {
    it("removes the legacy cards and packs entries and keeps other keys", () => {
        localStorage.setItem("cards_compressed", "x");
        localStorage.setItem("packs", "x");
        localStorage.setItem("decks_favourites", "{}");

        removeOldLocalStorageItems();

        expect(localStorage.getItem("cards_compressed")).toBeNull();
        expect(localStorage.getItem("packs")).toBeNull();
        expect(localStorage.getItem("decks_favourites")).toBe("{}");
    });
});

describe("compressed helpers with compression disabled", () => {
    it("saves plain JSON and warns that compression is disabled", () => {
        const consoleWarn = jest.spyOn(console, "warn").mockImplementation(() => {});

        expect(saveToLocalStorageCompressed("codes", ["01001"])).toBe(true);
        expect(localStorage.getItem("codes")).toBe('["01001"]');
        expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining("compression is disabled"));
        consoleWarn.mockRestore();
    });

    it("reads plain JSON back", () => {
        const consoleWarn = jest.spyOn(console, "warn").mockImplementation(() => {});
        saveToLocalStorageCompressed("codes", ["01001"]);

        expect(getFromLocalStorageCompressed<string[]>("codes")).toEqual(["01001"]);
        consoleWarn.mockRestore();
    });

    it("returns undefined for a missing key", () => {
        const consoleWarn = jest.spyOn(console, "warn").mockImplementation(() => {});

        expect(getFromLocalStorageCompressed("missing")).toBeUndefined();
        consoleWarn.mockRestore();
    });
});
