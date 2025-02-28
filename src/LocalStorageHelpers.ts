import * as jsonpack from 'jsonpack';

export function removeOldLocalStorageItems(): void {
    localStorage.removeItem("pagination_status");
    localStorage.removeItem("pack_status");
    localStorage.removeItem("cards");
}

const COMPRESSION_ENABLED = true;

function compress<T>(elementToCompress: T): string {
    return jsonpack.pack(elementToCompress as object);
}

function decompress<T>(compressed: string): T {
    return jsonpack.unpack(compressed) as T;
}


export function saveToLocalStorageCompressed<T>(itemName: string, elementToSave: T): boolean {
    if (!COMPRESSION_ENABLED && elementToSave){
        console.warn(`compression is disabled (${itemName})`);
        return saveToLocalStorage(itemName, elementToSave);
    }
    const start = performance.now();
    try {
        const compressed = compress(elementToSave);
        localStorage.setItem(itemName, compressed);
        console.info(`saveToLocalStorageCompressed ${itemName} in ms`, (performance.now() - start));
        console.info(`Local storage size in KB`, localStorageSize());
        return true;
    } catch (e) {
        console.error(`Error compressing cards to local storage`, e);
    }
    return false;
};

export function getFromLocalStorageCompressed<T>(itemName: string): T | undefined {
    if (!COMPRESSION_ENABLED){
        console.warn(`compression is disabled (${itemName})`);
        return getFromLocalStorage(itemName);
    }
    const start = performance.now();
    try {
        const localStorageString = localStorage.getItem(itemName);
        
        if (!localStorageString){
            console.warn(`getFromLocalStorageCompressed ${itemName} not found`);
            return; // no itemName in localStorage
        }

        const decompressed = decompress<T>(localStorageString);

        console.info(`getFromLocalStorageCompressed ${itemName} in ms`, (performance.now() - start));
        console.info(`Local storage size in KB`, localStorageSize());
        //return parsed;
        return decompressed as T;
    } catch (e) {
        console.error(`Error decompressing cards from local storage`, e);
        return;
    }
};

export function getFromLocalStorage<T>(itemName: string): T | undefined {
    const start = performance.now();
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

        console.info(`getFromLocalStorage ${itemName} in ms`, (performance.now() - start));
        console.info(`Local storage size in KB`, localStorageSize());
        return localStorageString as T;
    } catch {
        console.error(`Error getting ${itemName} from local storage`);
        return;
    }

}

export function saveToLocalStorage(itemName: string, elementToSave: number | boolean | string | object ): boolean {
    const start = performance.now();
    try {
        localStorage.setItem(itemName, JSON.stringify(elementToSave));
        console.info(`saveToLocalStorage ${itemName} in ms`, (performance.now() - start));
        console.info(`Local storage size in KB`, localStorageSize());
        return true
    } catch (e) {
        console.error(`Error saving ${itemName} to local storage`, e);
    }
    return false;
};

let localStorageSize = function () {
    let _lsTotal = 0,_xLen, _x;
    for (_x in localStorage) {
    if (!localStorage.hasOwnProperty(_x)) continue;
        _xLen = (localStorage[_x].length + _x.length) * 2;
        _lsTotal += _xLen;
    }
  return  (_lsTotal / 1024).toFixed(2);
 }