import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const defaultElementsPerPage: number = 12;

export type PaginationStatus = {
  currentPage: number,
  totalPages: number,
  visibleFirstElementIndex: number,
  visibleLastElementIndex: number,
  elementsPerPage: number,
}

/* Hook */
const usePaginationStatusQuery = <T>(typeQueryKey: string[]) => {
  /* queryKeys */
  const queryClient = useQueryClient();
  const statusQueryKey = [...typeQueryKey, "pagination_status"];
  const paginatedQueryKey = [...typeQueryKey, "paginated"];

  /* Queries */
  //const { data: filteredCards } = useQuery<MCCard[], Error>({ queryKey: ["filtered_cards"] });
  const { data: elements } = useQuery<T[], Error>({ queryKey: typeQueryKey });

  const { data: paginationStatus, error: paginationStatusError, isLoading: isPaginationStatusLoading } = useQuery<PaginationStatus, Error>({
    queryKey: statusQueryKey,
    queryFn: () => initializePaginationStatus(elements || []),
  });

  const { data: paginatedElements, error: paginatedElementsError, isLoading: arePaginatedElementsLoading } = useQuery<T[], Error>({
    queryKey: paginatedQueryKey,
    queryFn: () => getPaginatedElements(elements, paginationStatus),
  });


  /* Methods */
  const getInitStatusForElementList = (elements: T[], elementsPerPage: number = defaultElementsPerPage): PaginationStatus => {
    return {
      currentPage: 1,
      totalPages: Math.ceil(elements.length / elementsPerPage),
      visibleFirstElementIndex: 0,
      visibleLastElementIndex: elementsPerPage,
      elementsPerPage: elementsPerPage
    }
  }

  const getPaginatedElements = (
    elements: T[] | undefined, 
    paginationStatus: PaginationStatus | undefined
  ): T[] => {
    if (!elements || !paginationStatus) return [];
    return elements.slice(
      paginationStatus.visibleFirstElementIndex,
      paginationStatus.visibleLastElementIndex
    )
  }

  const changePage = (prev: PaginationStatus, newCurrentPage: number): PaginationStatus => {
    return {
      ...prev,
      currentPage: newCurrentPage,
      visibleFirstElementIndex: (prev.elementsPerPage * (newCurrentPage - 1)),
      visibleLastElementIndex: prev.elementsPerPage * newCurrentPage,
    }
  }
  const initializePaginationStatus = (elements: T[]): PaginationStatus => {
    const localStoragePaginationStatusString = localStorage.getItem(`${statusQueryKey.join("-")}`);

    if (localStoragePaginationStatusString == null) {
      return getInitStatusForElementList(elements);
    }
    return JSON.parse(localStoragePaginationStatusString) as PaginationStatus;
  }

  const savePaginationStatus = (paginationStatus: PaginationStatus) => {
    try{
      localStorage.setItem(`${statusQueryKey.join("-")}`, JSON.stringify(paginationStatus));
    }
    catch(e) {
      console.error("Error saving pagination status to local storage", e);
    }

    queryClient.invalidateQueries({ queryKey: statusQueryKey });
    queryClient.invalidateQueries({ queryKey: paginatedQueryKey });
  }

  /* Mutations */
  const { mutateAsync: setPageMutation } = useMutation<PaginationStatus, Error, number>({
    mutationFn: async (newPage: number) => {
      if(!paginationStatus) throw new Error("Pagination status not loaded");
      return changePage(paginationStatus, newPage);
    },
    onSuccess: (newPaginationStatus) => {
      savePaginationStatus(newPaginationStatus);
    }
  });

  const { mutateAsync: setElementsPerPageMutation} = useMutation<PaginationStatus, Error, number>({
    mutationFn: async (newElementsPerPage: number) => {
      if(!paginationStatus) throw new Error("Pagination status not loaded");
      const elementsLength = elements?.length || 0;
      const newTotalPages = Math.ceil(elementsLength / newElementsPerPage);
      const newCurrentPage = Math.floor(paginationStatus.visibleFirstElementIndex / newElementsPerPage) + 1;
      const newVisibleLastCardIndex = paginationStatus.visibleFirstElementIndex + newElementsPerPage;
      return {
        ...paginationStatus,
        totalPages: newTotalPages,
        elementsPerPage: newElementsPerPage,
        currentPage: newCurrentPage,
        visibleLastCardIndex: newVisibleLastCardIndex
      }
    },
    onSuccess: (newPaginationStatus) => {
      savePaginationStatus(newPaginationStatus);
    }
  });
  
  return { 
    paginationStatus, 
    paginationStatusError, 
    isPaginationStatusLoading, 
    paginatedElements, 
    paginatedElementsError, 
    arePaginatedElementsLoading,
    setPageMutation,
    setElementsPerPageMutation
  };

}

export default usePaginationStatusQuery;