import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { Provider } from "react-redux";
import { createStore } from "../store/configureStore";
import QuickSearchFilter from "../components/Filter/QuickSearchFilter";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: "en" }
    }),
    initReactI18next: { type: "3rdParty", init: jest.fn() }
}));

describe("QuickSearchFilter", () => {
    let container: HTMLDivElement;
    let root: Root;

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
    });

    it("exposes an accessible search field and a labelled clear button", async () => {
        await act(async () => {
            root.render(<Provider store={createStore()}><QuickSearchFilter /></Provider>);
        });

        const input = container.querySelector<HTMLInputElement>("#quick-search-input");
        const clearButton = container.querySelector<HTMLButtonElement>("#quick-search-filter button");

        expect(input?.getAttribute("type")).toBe("search");
        expect(input?.getAttribute("aria-label")).toBe("quick_search");
        expect(clearButton?.getAttribute("aria-label")).toBe("clear_quick_search");
    });

    it("keeps decorative icons out of the accessibility tree", async () => {
        await act(async () => {
            root.render(<Provider store={createStore()}><QuickSearchFilter /></Provider>);
        });

        const icons = container.querySelectorAll("svg");
        expect(icons.length).toBeGreaterThan(0);
        icons.forEach((icon) => {
            expect(icon.getAttribute("aria-hidden")).toBe("true");
        });
    });
});
