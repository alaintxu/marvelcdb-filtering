import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { setSanitizedHtml } from "../sanitizeHtml";
import SanitizedHtml from "../components/SanitizedHtml/SanitizedHtml";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("setSanitizedHtml", () => {
    it("removes scripts and event handlers with DOMPurify when the Sanitizer API is missing", async () => {
        const element = document.createElement("div");
        expect(typeof (element as unknown as { setHTML?: unknown }).setHTML).not.toBe("function");

        await setSanitizedHtml(element, '<b>bold</b><img src="x" onerror="alert(1)"><script>alert(2)</script>');

        expect(element.innerHTML).toContain("<b>bold</b>");
        expect(element.innerHTML).not.toContain("script");
        expect(element.innerHTML).not.toContain("onerror");
    });

    it("uses the Sanitizer API when the browser provides it", async () => {
        const element = document.createElement("div");
        const setHTML = jest.fn();
        (element as unknown as { setHTML: (html: string) => void }).setHTML = setHTML;

        await setSanitizedHtml(element, "<b>bold</b>");

        expect(setHTML).toHaveBeenCalledWith("<b>bold</b>");
        expect(element.innerHTML).toBe("");
    });
});

describe("SanitizedHtml", () => {
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

    it("renders sanitized markup into the wrapper element", async () => {
        await act(async () => {
            root.render(<SanitizedHtml html='<b>bold</b><script>alert(1)</script>' className="text" title="Text" />);
        });

        const wrapper = container.querySelector("div.text");
        expect(wrapper?.innerHTML).toContain("<b>bold</b>");
        expect(wrapper?.innerHTML).not.toContain("script");
        expect(wrapper?.getAttribute("title")).toBe("Text");
    });

    it("can render an italic wrapper", async () => {
        await act(async () => {
            root.render(<SanitizedHtml as="i" html="<b>bold</b>" />);
        });

        expect(container.querySelector("i")?.innerHTML).toContain("<b>bold</b>");
    });
});
