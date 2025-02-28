import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../configureStore";
import { getFromLocalStorage } from "../../LocalStorageHelpers";

export const DEFAULT_ELEMENTS_PER_PAGE = 12;
export const LOCAL_STORAGE_ELEMENTS_PER_PAGE_KEY = "elements_per_page";

type PaginationState = {
    currentPage: number,
    elementsPerPage: number,
    totalElements: number,
    totalPages: number,
    visibleFirstElementIndex: number,
    visibleLastElementIndex: number,
}


const recalculatePagination = (state: PaginationState) => {
    if (state.currentPage < 1 || state.currentPage > state.totalPages) state.currentPage = 1;

    state.totalPages = Math.ceil(state.totalElements / (state.elementsPerPage || DEFAULT_ELEMENTS_PER_PAGE));

    state.visibleFirstElementIndex = state.elementsPerPage * (state.currentPage - 1);
    state.visibleLastElementIndex = Math.min(
        state.totalElements, 
        state.elementsPerPage * state.currentPage
    );

    return state;
}


const slice = createSlice({
    name: 'pagination',
    initialState: {
        currentPage: 1,
        elementsPerPage: getFromLocalStorage<number>(LOCAL_STORAGE_ELEMENTS_PER_PAGE_KEY) || DEFAULT_ELEMENTS_PER_PAGE,
        totalElements: 0,
        totalPages: 1,
        visibleFirstElementIndex: 0,
        visibleLastElementIndex: 1,
    } as PaginationState,
    reducers: {
        paginationTotalElementsUpdated: (state, action) => {
            const newTotalElements: number = action.payload;
            state.totalElements = newTotalElements;
            return recalculatePagination(state);
        },
        paginationElementsPerPageUpdated: (state, action) => {
            const newElementsPerPage: number = action.payload;
            state.elementsPerPage = newElementsPerPage;
            state.currentPage = 1;
            return recalculatePagination(state);
        },
        paginationCurrentPageUpdated: (state, action) => {
            const newCurrentPage: number = action.payload;
            state.currentPage = newCurrentPage;
            return recalculatePagination(state);
        },
        /*paginationNextPageClicked: (state) => {
            const currentPage = state.currentPage + 1;
            return pageNumberUpdated(state, currentPage);
        },
        paginationPreviousPageClicked: (state) => {
            const currentPage = state.currentPage - 1;
            return pageNumberUpdated(state, currentPage);
        },
        paginationFirstPageClicked: (state) => {
            return pageNumberUpdated(state, 1);
        },
        paginationLastPageClicked: (state) => {
            return pageNumberUpdated(state, state.totalPages);
        }*/

    }
});

export const selectPagination = (state: RootState) => state.ui.pagination;
export const selectPaginationElementsPerPage = (state: RootState) => state.ui.pagination.elementsPerPage;

export default slice.reducer;
export const { 
    paginationTotalElementsUpdated, 
    paginationElementsPerPageUpdated, 
    paginationCurrentPageUpdated 
} = slice.actions;