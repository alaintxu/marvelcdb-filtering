import { useEffect, useState } from "react";
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

const filterPaginatedCards = (filteredCards: MCCard[], paginationStatus: PaginationStatus):MCCard[] => {
  return  filteredCards.slice(
    paginationStatus.visibleFirstCardIndex,
    paginationStatus.visibleLastCardIndex
  )
}

export const changePage = (prev: PaginationStatus, newCurrentPage: number):PaginationStatus => {
  return {
    ...prev,
    currentPage: newCurrentPage,
    visibleFirstCardIndex: (prev.cardsPerPage * (newCurrentPage - 1)),
    visibleLastCardIndex: prev.cardsPerPage * newCurrentPage,
  }
}

const usePaginationStatus = (filteredCards: MCCard[]) => {
  const localStoragePaginationStatusString = localStorage.getItem('pagination_status');
  const initialPaginationStatus = localStoragePaginationStatusString != null ?
    JSON.parse(localStoragePaginationStatusString) as PaginationStatus :
    getInitStatusForCardList(filteredCards, 12);

  const [paginationStatus, setPaginationStatus] = useState<PaginationStatus>(initialPaginationStatus);
  const [paginatedCards, setPaginatedCards] = useState<MCCard[]>(
    filterPaginatedCards(filteredCards, paginationStatus)
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

  useEffect(() => {
    setPaginatedCards(filterPaginatedCards(filteredCards, paginationStatus));
  }, [filteredCards, paginationStatus])

  return { paginationStatus, setPaginationStatus, paginatedCards };
}

export default usePaginationStatus;