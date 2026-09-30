import 'jest-localstorage-mock';

// jsdom does not implement structuredClone, required by fake-indexeddb.
if (typeof globalThis.structuredClone !== 'function') {
    globalThis.structuredClone = ((value: unknown) => JSON.parse(JSON.stringify(value))) as typeof structuredClone;
}