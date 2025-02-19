import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from "reselect";

import { RootState } from "./configureStore";
// import { getFromLocalStorageCompressed, saveToLocalStorageCompressed } from './helpers';

export type PackStatus = {
    pack_code: string,
    download_date: number,
    download_status: "unselected" | "selected" | "downloading" | "downloaded",
    number_of_cards: number,
}

export type PackStatusDict = {
    [pack_code: string]: PackStatus;
}

// const getPackStatusDictFromLocalStorage = ():PackStatusDict => {
//     // @ToDo: Fix the issue with local storage
//     return getFromLocalStorageCompressed<PackStatusDict>(`pack_status_list`) || {};
//     //return {};
// }

// const savePackStatusDictToLocalStorage = (packStatusDict: PackStatusDict): boolean => {
//     return saveToLocalStorageCompressed<PackStatusDict>(`pack_status_list`, packStatusDict);
// }

const slice = createSlice({
    name: 'packStatus',
    initialState: {} as PackStatusDict, //getPackStatusDictFromLocalStorage(),
    reducers: {
        packStatusDictSet: (packStatusDict, action) => {
            const newPackStatusDict: PackStatusDict = action.payload;
            packStatusDict = newPackStatusDict;
            //savePackStatusDictToLocalStorage(packStatusDict);
            return packStatusDict;
        },
        packStatusSet: (packStatusDict, action) => {
            const newPackStatus: PackStatus = action.payload;
            packStatusDict[newPackStatus.pack_code] = newPackStatus;
            //savePackStatusDictToLocalStorage(packStatusDict);
            return packStatusDict;
        },
        packStatusNewPacksAdded: (packStatusDict, action) => {
            const newPacksIds: string[] = action.payload;

            newPacksIds.forEach((newPackId: string) => {
                if (!packStatusDict[newPackId]) {
                    packStatusDict[newPackId] = {
                        pack_code: newPackId,
                        download_date: 0,
                        download_status: "unselected",
                        number_of_cards: 0,
                    };
                }
            });
            return packStatusDict;
        },
        packStatusPackDownloadStatusSet: (packStatusDict, action) => {
            const packCode: string = action.payload.packCode;
            const downloadStatus: "unselected" | "selected" | "downloading" | "downloaded" = action.payload.downloadStatus;
            packStatusDict[packCode].download_status = downloadStatus;
            //savePackStatusDictToLocalStorage(packStatusDict);
            return packStatusDict;
        },
        packStatusPackRemoved: (packStatusDict, action) => {
            const packCode: string = action.payload;
            delete packStatusDict[packCode];
            //savePackStatusDictToLocalStorage(packStatusDict);
            return packStatusDict;
        }
    }
});

export const selectPackStatusById = (packCode: string) => createSelector(
    (state: RootState) => state.ui.packStatusDict,
    (packStatusDict) => packStatusDict[packCode]
);

export const selectNumberOfPackStatusByDownloadStatus = (downloadStatus: "unselected" | "selected" | "downloading" | "downloaded") => createSelector(
    (state: RootState) => state.ui.packStatusDict,
    (packStatusDict) => Object.values(packStatusDict).filter(
        packStatus => packStatus.download_status === downloadStatus
    ).length
);

export const selectIsAnyPackDownloading = createSelector(
    (state: RootState) => state.ui.packStatusDict,
    (packStatusDict) => Object.values(packStatusDict).some(
        packStatus => packStatus.download_status === "downloading"
    )
);

export default slice.reducer;
export const {
    packStatusDictSet,
    packStatusSet,
    packStatusPackDownloadStatusSet,
    packStatusPackRemoved,
    packStatusNewPacksAdded,
} = slice.actions;
