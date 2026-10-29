import type { RootState } from "../store/configureStore";
import reducer, {
    bookmarkCurrentDeck,
    Deck,
    MarvelDecksDict,
    MarvelDeck,
    removeCurrentDeck,
    selectAllDeckIds,
    selectCurrentDeckId,
    selectDeckById,
    selectIsCurrentInList,
    selectIsDeckInList,
    setCurrentDeck,
    unbookmarkDeck,
} from "../store/entities/decks";

jest.mock("i18next", () => {
    const i18nMock: Record<string, unknown> = {
        t: (key: string) => (key === "base_path" ? "https://marvelcdb.com" : key),
        use: () => i18nMock,
        init: jest.fn(),
        language: "en"
    };
    return i18nMock;
});

const initialState = reducer(undefined, { type: "@@init" });

const mockDeck = (overrides: Partial<Deck> = {}): Deck => ({
    id: 1001,
    name: "Spider Deck",
    date_creation: "2024-01-01T00:00:00+00:00",
    date_update: "2024-01-02T00:00:00+00:00",
    description_md: "Play [Spider-Man](/card/01001).",
    user_id: 21328,
    hero_code: "01001",
    hero_name: "Spider-Man",
    investigator_code: "01001",
    investigator_name: "Spider-Man",
    slots: { "01001": 1 },
    ignoreDeckLimitSlots: {},
    version: 1,
    meta: '{"aspect":"justice"}',
    tags: "avengers, hero",
    ...overrides,
});

/* Dispatches the API event the way the app does, using the action type string */
const receiveDeck = (deck: Deck, state = initialState) =>
    reducer(state, { type: "decks/deckReceived", payload: deck });

const receivedDeck = (overrides: Partial<Deck> = {}) => receiveDeck(mockDeck(overrides)).currentDeck!;

const stateWith = (decks: MarvelDecksDict = {}, currentDeck: ReturnType<typeof receivedDeck> | null = null) =>
    ({ entities: { decks: { ...initialState, decks, currentDeck } } }) as unknown as RootState;

/* The decks selectors are declared with createSelector<RootState, ...>, whose typings do not
   infer the state argument, so they are called through this helper. */
const runSelector = <T,>(selector: unknown, state: RootState): T => Reflect.apply(selector as never, undefined, [state]) as T;

describe("deckReceived", () => {
    it("sets the current deck and clears loading and error", () => {
        const state = { ...initialState, isDeckLoading: true, deckError: "Network error" };

        const result = receiveDeck(mockDeck(), state);

        expect(result.currentDeck?.id).toBe(1001);
        expect(result.isDeckLoading).toBe(false);
        expect(result.deckError).toBe("");
    });

    it("uses hero_code and hero_name when they are present", () => {
        const deck = receivedDeck({ hero_code: "01001", hero_name: "Spider-Man", investigator_code: "other", investigator_name: "Other" });

        expect(deck.hero_code).toBe("01001");
        expect(deck.hero_name).toBe("Spider-Man");
    });

    it("falls back to the investigator fields when the hero fields are empty", () => {
        const deck = receivedDeck({ hero_code: "", hero_name: "", investigator_code: "01001", investigator_name: "Spider-Man" });

        expect(deck.hero_code).toBe("01001");
        expect(deck.hero_name).toBe("Spider-Man");
    });

    it("removes the investigator fields and splits tags into an array", () => {
        const deck = receivedDeck({ tags: "avengers, hero" });

        expect(deck).not.toHaveProperty("investigator_code");
        expect(deck).not.toHaveProperty("investigator_name");
        expect(deck.tags).toEqual(["avengers", "hero"]);
        expect(deck.tags_str).toBe("avengers, hero");
    });

    it("reads the aspect from the meta JSON", () => {
        expect(receivedDeck({ meta: '{"aspect":"justice"}' }).aspect).toBe("justice");
    });

    it("sets the aspect to undefined and logs an error when meta is not valid JSON", () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

        const deck = receivedDeck({ id: 2002, meta: "not json" });

        expect(deck.aspect).toBeUndefined();
        expect(consoleError).toHaveBeenCalled();
        consoleError.mockRestore();
    });

    it("rewrites card links to the MarvelCDB base path", () => {
        const deck = receivedDeck({ description_md: "Play [Spider-Man](/card/01001)." });

        expect(deck.description_md).toBe("Play [Spider-Man](https://marvelcdb.com/card/01001).");
    });

    it("converts img tags into markdown images", () => {
        const deck = receivedDeck({ description_md: '<img class="x" src="https://example.com/a.png" alt="a">' });

        expect(deck.description_md).toBe("![](https://example.com/a.png)");
    });
});

describe("deck request events", () => {
    it("marks the deck as loading when a request starts", () => {
        const result = reducer(initialState, { type: "decks/deckRequested" });

        expect(result.isDeckLoading).toBe(true);
    });

    it("stores the error and stops loading when a request fails", () => {
        const loading = { ...initialState, isDeckLoading: true };

        const result = reducer(loading, { type: "decks/deckRequestFailed", payload: "Not found" });

        expect(result.deckError).toBe("Not found");
        expect(result.isDeckLoading).toBe(false);
    });
});

describe("setCurrentDeck", () => {
    it("selects a bookmarked deck as the current deck", () => {
        const bookmarked = receivedDeck();
        const state = { ...initialState, decks: { [bookmarked.id]: bookmarked } };

        expect(reducer(state, setCurrentDeck(bookmarked.id)).currentDeck).toEqual(bookmarked);
    });

    it("clears the current deck when the id is not bookmarked", () => {
        const state = { ...initialState, currentDeck: receivedDeck() };

        expect(reducer(state, setCurrentDeck(9999)).currentDeck).toBeNull();
    });
});

describe("bookmarkCurrentDeck", () => {
    it("adds the current deck to the bookmarked decks", () => {
        const current = receivedDeck();
        const state = { ...initialState, currentDeck: current };

        const result = reducer(state, bookmarkCurrentDeck());

        expect(result.decks[current.id]).toEqual(current);
    });

    it("does nothing when there is no current deck", () => {
        const result = reducer(initialState, bookmarkCurrentDeck());

        expect(result.decks).toEqual({});
    });
});

describe("unbookmarkDeck", () => {
    it("removes the deck from the bookmarked decks and keeps it as the current deck", () => {
        const bookmarked = receivedDeck();
        const state = { ...initialState, decks: { [bookmarked.id]: bookmarked } };

        const result = reducer(state, unbookmarkDeck(bookmarked.id));

        expect(result.decks).not.toHaveProperty(String(bookmarked.id));
        expect(result.currentDeck).toEqual(bookmarked);
    });

    it("ignores ids that are not bookmarked", () => {
        const state = { ...initialState, currentDeck: null };

        const result = reducer(state, unbookmarkDeck(9999));

        expect(result.currentDeck).toBeNull();
        expect(result.decks).toEqual({});
    });
});

describe("removeCurrentDeck", () => {
    it("clears the current deck without removing bookmarks", () => {
        const bookmarked = receivedDeck();
        const state = { ...initialState, currentDeck: bookmarked, decks: { [bookmarked.id]: bookmarked } };

        const result = reducer(state, removeCurrentDeck());

        expect(result.currentDeck).toBeNull();
        expect(result.decks[bookmarked.id]).toEqual(bookmarked);
    });
});

describe("decks selectors", () => {
    const bookmarked = receivedDeck({ id: 1001 });

    it("selects the current deck id", () => {
        expect(runSelector<number | undefined>(selectCurrentDeckId, stateWith({}, bookmarked))).toBe(1001);
        expect(runSelector<number | undefined>(selectCurrentDeckId, stateWith())).toBeUndefined();
    });

    it("lists the bookmarked deck ids as numbers", () => {
        expect(runSelector<number[]>(selectAllDeckIds, stateWith({ [bookmarked.id]: bookmarked }))).toEqual([1001]);
    });

    it("finds a bookmarked deck by id", () => {
        const state = stateWith({ [bookmarked.id]: bookmarked });

        expect(runSelector<MarvelDeck | undefined>(selectDeckById(1001), state)).toEqual(bookmarked);
        expect(runSelector<MarvelDeck | undefined>(selectDeckById(9999), state)).toBeUndefined();
    });

    it("tells whether a deck is in the bookmarked list", () => {
        const state = stateWith({ [bookmarked.id]: bookmarked });

        expect(runSelector<boolean>(selectIsDeckInList(1001), state)).toBe(true);
        expect(runSelector<boolean>(selectIsDeckInList(9999), state)).toBe(false);
    });

    it("tells whether the current deck is in the bookmarked list", () => {
        expect(runSelector<boolean>(selectIsCurrentInList, stateWith({ [bookmarked.id]: bookmarked }, bookmarked))).toBe(true);
        expect(runSelector<boolean>(selectIsCurrentInList, stateWith({}, bookmarked))).toBe(false);
        expect(runSelector<boolean>(selectIsCurrentInList, stateWith({ [bookmarked.id]: bookmarked }, null))).toBe(false);
    });
});
