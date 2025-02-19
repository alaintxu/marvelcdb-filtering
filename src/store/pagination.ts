import { createSlice } from "@reduxjs/toolkit";

export const defaultElementsPerPage = 12;

type PaginationState = {
    currentPage: number,
    elementsPerPage: number,
    totalElements: number,
    totalPages: number,
    visibleFirstElementIndex: number,
    visibleLastElementIndex: number,
}


const pageNumberUpdated = (state: PaginationState, currentPage:number) => {
    if (currentPage < 1 || currentPage > state.totalPages) return state;
    state.currentPage = currentPage;
    state.visibleFirstElementIndex = (state.elementsPerPage * (state.currentPage - 1));
    state.visibleLastElementIndex = Math.min(state.totalElements, state.elementsPerPage * state.currentPage);
    return state;
}


const slice = createSlice({
    name: 'cards',
    initialState: {
        currentPage: 1,
        elementsPerPage: defaultElementsPerPage,
        totalElements: 0,
        totalPages: 1,
        visibleFirstElementIndex: 0,
        visibleLastElementIndex: 1,
    },
    reducers: {
        paginationElementsUpdated: (state, action) => {
            state.totalElements = action.payload.lenght;
            state.totalPages = Math.ceil(state.totalElements / state.elementsPerPage);
            return pageNumberUpdated(state, state.currentPage);
        },
        paginationElementsPerPageUpdated: (state, action) => {
            state.elementsPerPage = action.payload;
            state.totalPages = Math.ceil(state.totalElements / state.elementsPerPage);
            return pageNumberUpdated(state, 1);
        },
        paginationCurrentPageUpdated: (state, action) => {
            const currentPage = action.payload;
            return pageNumberUpdated(state, currentPage);
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

export default slice.reducer;
export const { 
    paginationElementsUpdated, 
    paginationElementsPerPageUpdated, 
    paginationCurrentPageUpdated 
} = slice.actions;