import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from "reselect";

import { RootState } from "../configureStore";
import { selectNumberOfPacks } from '../entities/packs';
import { getFromLocalStorage } from '../../LocalStorageHelpers';

export const LOCAL_STORAGE_PACK_STATUS_KEY = "pack_status_v2";

export type OldPackStatus = {
    code: string,
    lastDownload: string,
    numberOfCards: number,
}

export type PackStatus = {
    pack_code: string,
    download_date: number,
    download_status: "unselected" | "selected" | "downloading" | "downloaded",
    number_of_cards: number,
}

export type PackStatusDict = {
    [pack_code: string]: PackStatus;
}

const slice = createSlice({
    name: 'packStatus',
    initialState: getFromLocalStorage<PackStatusDict>(LOCAL_STORAGE_PACK_STATUS_KEY) || {},
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
            if (!packStatusDict[packCode]) {
                packStatusDict[packCode] = {
                    pack_code: packCode,
                    download_date: 0,
                    download_status: downloadStatus,
                    number_of_cards: 0,
                };
                return packStatusDict;
            }
            packStatusDict[packCode].download_status = downloadStatus;
            return packStatusDict;
        },
        packStatusPackRemoved: (packStatusDict, action) => {
            const packCode: string = action.payload;
            delete packStatusDict[packCode];
            return packStatusDict;
        },
        packStatusPackCardsDownloaded: (packStatusDict, action) => {
            const packCode: string = action.payload.packCode;
            const numberOfCards: number = action.payload.numberOfCards;
            packStatusDict[packCode] = {
                pack_code: packCode,
                download_date: Date.now(),
                download_status: "downloaded",
                number_of_cards: numberOfCards,
            }
            return packStatusDict;
        }
    }
});

export const selectPackStatusDict = (state: RootState) => state.ui.packStatusDict;

export const selectPackStatusById = (packCode: string) => createSelector(
    (state: RootState) => state.ui.packStatusDict,
    (packStatusDict) => packStatusDict[packCode]
);

export const selectNumberOfPackStatusByDownloadStatus = (downloadStatus: "unselected" | "selected" | "downloading" | "downloaded") => createSelector(
    selectPackStatusDict,
    (packStatusDict) => Object.values(packStatusDict).filter(
        packStatus => packStatus.download_status === downloadStatus
    ).length
);

export const selectIsAnyPackDownloading = createSelector(
    selectPackStatusDict,
    (packStatusDict) => Object.values(packStatusDict).some(
        packStatus => packStatus.download_status === "downloading"
    )
);

export const selectPackStatusBootstrapVariant = createSelector(
    selectNumberOfPacks,
    selectNumberOfPackStatusByDownloadStatus("downloaded"),
    selectIsAnyPackDownloading,
    (numberOfPacks: number, numberOfDownloadedPacks: number, isAnyPackDownloading: boolean) => {
        if( isAnyPackDownloading ) return "dark";

        const packStatusRatio = numberOfDownloadedPacks / numberOfPacks;
        if (packStatusRatio === 1) return "success";
        if (packStatusRatio < 0.25) return "danger";
        
        return "warning";
      }
)

export default slice.reducer;
export const {
    packStatusDictSet,
    packStatusSet,
    packStatusPackDownloadStatusSet,
    packStatusPackRemoved,
    packStatusPackCardsDownloaded,
    packStatusNewPacksAdded,
} = slice.actions;
