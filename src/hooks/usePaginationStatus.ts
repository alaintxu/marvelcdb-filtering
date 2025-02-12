import { useEffect, useMemo, useState } from "react";
import { MCCard } from "./useCards";

export type PaginationStatus = {
  currentPage: number,
  totalPages: number,
  visibleFirstCardIndex: number,
  visibleLastCardIndex: number,
  cardsPerPage: number,
}

const getInitStatusForCardList = (filteredCards: MCCard[], cardsPerPage: number = 12): PaginationStatus => {
  return {
    currentPage: 1,
    totalPages: Math.ceil(filteredCards.length / cardsPerPage),
    visibleFirstCardIndex: 0,
    visibleLastCardIndex: cardsPerPage,
    cardsPerPage: cardsPerPage
  }
}

const filterPaginatedCards = (filteredCards: MCCard[], paginationStatus: PaginationStatus): MCCard[] => {
  return filteredCards.slice(
    paginationStatus.visibleFirstCardIndex,
    paginationStatus.visibleLastCardIndex
  )
}

export const changePage = (prev: PaginationStatus, newCurrentPage: number): PaginationStatus => {
  return {
    ...prev,
    currentPage: newCurrentPage,
    visibleFirstCardIndex: (prev.cardsPerPage * (newCurrentPage - 1)),
    visibleLastCardIndex: prev.cardsPerPage * newCurrentPage,
  }
}

function initializePaginationStatus(filteredCards: MCCard[]): PaginationStatus {
  const localStoragePaginationStatusString = localStorage.getItem('pagination_status');

  if (localStoragePaginationStatusString == null) {
    return getInitStatusForCardList(filteredCards, 12);
  }
  return JSON.parse(localStoragePaginationStatusString) as PaginationStatus;
}

const usePaginationStatus = (filteredCards: MCCard[]) => {
  const [paginationStatus, setPaginationStatus] = useState<PaginationStatus>(initializePaginationStatus(filteredCards));

  const paginatedCards = useMemo(
    () => filterPaginatedCards(filteredCards, paginationStatus)
    , [filteredCards, paginationStatus]
  );

  useEffect(() =>
    setPaginationStatus(
      (prev) => getInitStatusForCardList(filteredCards, prev.cardsPerPage)
    ),
    [filteredCards]
  );

  useEffect(() => {
    localStorage.setItem("pagination_status", JSON.stringify(paginationStatus));
  }, [paginationStatus]);

  return { paginationStatus, setPaginationStatus, paginatedCards };
}

export default usePaginationStatus;