import 'jest-localstorage-mock';

// jsdom does not implement structuredClone, required by fake-indexeddb.
if (typeof globalThis.structuredClone !== 'function') {
    globalThis.structuredClone = ((value: unknown) => JSON.parse(JSON.stringify(value))) as typeof structuredClone;
}

// jsdom does not implement the native modal dialog API used by @astryxdesign/core Dialog.
if (typeof HTMLDialogElement !== 'undefined') {
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
        this.open = true;
        this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.show ??= function (this: HTMLDialogElement) {
        this.open = true;
        this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
        this.open = false;
        this.removeAttribute('open');
    };
}

// jsdom's selector engine does not support the :modal pseudo-class used by @astryxdesign/core.
const nativeMatches = Element.prototype.matches;
Element.prototype.matches = function (this: Element, selector: string) {
    if (selector.includes(':modal')) {
        const withoutModal = selector.replace(/:modal/g, '').trim();
        const isOpenDialog = this instanceof HTMLDialogElement && this.open;
        return isOpenDialog && (withoutModal === '' || nativeMatches.call(this, withoutModal));
    }
    return nativeMatches.call(this, selector);
};

// jsdom lacks the CSS object, required by @astryxdesign/core Dialog (CSS.escape).
if (typeof globalThis.CSS === 'undefined') {
    globalThis.CSS = {
        escape: (value: string) => value.replace(/[^a-zA-Z0-9_\u00A0-\uFFFF-]/g, (char) => `\\${char}`),
    } as unknown as typeof CSS;
}

// jsdom lacks these browser APIs, also required by @astryxdesign/core components.
if (typeof window.matchMedia !== 'function') {
    window.matchMedia = ((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false,
    })) as typeof window.matchMedia;
}

if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
        observe() { /* noop */ }
        unobserve() { /* noop */ }
        disconnect() { /* noop */ }
    } as unknown as typeof ResizeObserver;
}