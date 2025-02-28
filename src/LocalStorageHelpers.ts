import LZString from "lz-string";

export function removeOldLocalStorageItems(): void {
    localStorage.removeItem("pagination_status");
    localStorage.removeItem("pack_status");
    localStorage.removeItem("cards");
}


export function saveToLocalStorageCompressed<T>(itemName: string, elementToSave: T): boolean {
    // const start = performance.now();
    try {
        const compressed = LZString.compressToUTF16(JSON.stringify(elementToSave));
        localStorage.setItem(itemName, compressed);
        // console.info(`saveToLocalStorageCompressed ${itemName} in ms`, (performance.now() - start));
        return true;
    } catch (e) {
        console.error(`Error compressing cards to local storage`, e);
    }
    return false;
};

export function getFromLocalStorageCompressed<T>(itemName: string): T | undefined {
    // const start = performance.now();
    try {
        const localStorageString = localStorage.getItem(itemName);
        
        if (!localStorageString) return; // no itemName in localStorage

        const decompressed = LZString.decompressFromUTF16(localStorageString);
        const parsed = JSON.parse(decompressed) as T;
        // console.info(`getFromLocalStorageCompressed ${itemName} in ms`, (performance.now() - start));
        return parsed;
    } catch (e) {
        console.error(`Error decompressing cards from local storage`, e);
        return;
    }
};

export function getFromLocalStorage<T>(itemName: string): T | undefined {
    // const start = performance.now();
    try {
        const localStorageString = localStorage.getItem(itemName);
        if (!localStorageString) return; // no itemName in localStorage

        const num = Number(localStorageString);
        if (!isNaN(num)) {
            return num as unknown as T;
        }

        if (
            (localStorageString.startsWith('{') && localStorageString.endsWith('}'))
            ||
            (localStorageString.startsWith('[') && localStorageString.endsWith(']'))
        ) {
            return JSON.parse(localStorageString) as T;
        }

        if (localStorageString === 'true') return true as unknown as T;
        if (localStorageString === 'false') return false as unknown as T;
        if (localStorageString === 'null') return null as unknown as T;

        // console.info(`getFromLocalStorage ${itemName} in ms`, (performance.now() - start));
        return localStorageString as T;
    } catch {
        console.error(`Error getting ${itemName} from local storage`);
        return;
    }

}

export function saveToLocalStorage(itemName: string, elementToSave: number | boolean | string | object ): boolean {
    // const start = performance.now();
    try {
        localStorage.setItem(itemName, JSON.stringify(elementToSave));
        // console.info(`saveToLocalStorage ${itemName} in ms`, (performance.now() - start));
        return true
    } catch (e) {
        console.error(`Error saving ${itemName} to local storage`, e);
    }
    return false;
};