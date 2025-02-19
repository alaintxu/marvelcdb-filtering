/*import LZString from "lz-string";


// Local Storage

export const getFromLocalStorageCompressed = <T>(itemName: string): T | undefined => {
    console.log(`getFromLocalStorage`);
    const compressed = localStorage.getItem(itemName);
    if (!compressed) return;

    try {
        const decompressed = LZString.decompressFromUTF16(compressed);
        console.log(`decompressed`, decompressed);

        return JSON.parse(decompressed) as T;
    } catch (e) {
        console.error(`Error decompressing cards from local storage`, e);
        return;
    }
};

export const saveToLocalStorageCompressed = <T>(itemName: string, elementToSave: T): boolean => {
    try {
        const compressed = LZString.compressToUTF16(JSON.stringify(elementToSave));
        localStorage.setItem(itemName, compressed);
        return true;
    } catch (e) {
        console.error(`Error compressing cards to local storage`, e);
    }
    return false;
};
*/