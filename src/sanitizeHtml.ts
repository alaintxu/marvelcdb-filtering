type SanitizingElement = HTMLElement & { setHTML?: (html: string) => void };

/**
 * Writes untrusted HTML into `element`.
 * Uses the Sanitizer API when the browser supports it, otherwise loads DOMPurify
 * on demand so the dependency is never shipped to browsers with native support.
 */
export const setSanitizedHtml = async (element: SanitizingElement, html: string): Promise<void> => {
    if (typeof element.setHTML === "function") {
        element.setHTML(html);
        return;
    }
    const { default: DOMPurify } = await import("dompurify");
    element.innerHTML = DOMPurify.sanitize(html);
};
