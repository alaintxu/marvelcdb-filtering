import { createSlice } from '@reduxjs/toolkit';
import { getFromLocalStorageCompressed, saveToLocalStorageCompressed } from './helpers';


export interface Pack {
    name: string;
    code: string;
    position: number;
    available: string;
    known: number;
    total: number;
    url: string;
    id: number;
}

export type PackStatus = {
    pack_code: string,
    download_date: number,
    download_status: string,
    number_of_cards: number,
}

export type PackStatusDict = {
    [pack_code: string]: PackStatus;
}

const getPackStatusDictFromLocalStorage = ():PackStatusDict => {
    // @ToDo: Fix the issue with local storage
    return getFromLocalStorageCompressed<PackStatusDict>(`pack_status_list`) || {};
    //return {};
}

const savePackStatusDictToLocalStorage = (packStatusDict: PackStatusDict): boolean => {
    return saveToLocalStorageCompressed<PackStatusDict>(`pack_status_list`, packStatusDict);
}

const slice = createSlice({
    name: 'packs',
    initialState: {
        numberOfPacks: 0,
        packStatusDict: getPackStatusDictFromLocalStorage(),
    },
    reducers: {
        numberOfPacksChanged: (packs, action) => {
            packs.numberOfPacks = action.payload.numberOfPacks;
        },
        packStatusDictChanged: (packs, action) => {
            packs.packStatusDict = action.payload.packStatusDict;
            savePackStatusDictToLocalStorage(packs.packStatusDict);
            return packs;
        },
        packStatusChanged: (packs, action) => {
            packs.packStatusDict[action.payload.packStatus.pack_code] = action.payload.packStatus;
            savePackStatusDictToLocalStorage(packs.packStatusDict);
            return packs;
        },
        packDownloaded: (packs, action) => {
            packs.packStatusDict[action.payload.pack_code] = {
                pack_code: action.payload.pack_code,
                download_date: Date.now(),
                download_status: "downloaded",
                number_of_cards: action.payload.number_of_cards,
            };
            savePackStatusDictToLocalStorage(packs.packStatusDict);
            return packs;
        },
        packDownloading: (packs, action) => {
            packs.packStatusDict[action.payload.pack_code] = {
                pack_code: action.payload.pack_code,
                download_date: 0,
                download_status: "downloading",
                number_of_cards: 0,
            };
            // Downloading status is not saved to local storage
            // savePackStatusDictToLocalStorage(packs.packStatusDict);
            return packs;
        },
        packRemoved: (packs, action) => {
            delete packs.packStatusDict[action.payload.pack_code];
            savePackStatusDictToLocalStorage(packs.packStatusDict);
            return packs;
        }
    }
});

export default slice.reducer;
export const { 
    numberOfPacksChanged, 
    packStatusDictChanged,
    packStatusChanged,
    packDownloaded,
    packDownloading,
    packRemoved,
} = slice.actions;
