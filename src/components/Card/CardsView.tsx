import { useEffect, useState } from "react";
import CardGrid from "./CardGrid";
import { useTranslation } from "react-i18next";
import { ReactBSPagination } from "@draperez/react-components";
import { MCCard, selectAllCards } from "../../store/entities/cards";

import { paginationCurrentPageUpdated, paginationTotalElementsUpdated, selectPagination } from "../../store/ui/pagination";
import IconForConcept from "../IconForConcept";
import { selectFlipAllCards, selectShowAllCardData } from "../../store/ui/other";
import { FiltersByTypes, selectFilters, selectHideDuplicates, selectQuickFilter } from "../../store/ui/filters";
import TopActions from "../TopActions";
import { quickFilterCardList } from "../Filter/QuickSearchFilter";
import { sortCards, filterDuplicates, resolveDuplicateCards } from "../../store/entities/cardsModificationUtils";
import { filterCards } from "../../store/entities/cardsFilterUtils";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";

const CardsView = () => {
  const { t } = useTranslation('global');

  // Status
  const [filteredCards, setFilteredCards] = useState<MCCard[]>([]);
  const [paginatedCards, setPaginatedCards] = useState<MCCard[]>([]);

  const pagination = useAppSelector(selectPagination);
  const cards = useAppSelector(selectAllCards);

  const showAllCardData = useAppSelector(selectShowAllCardData);
  const flipAllCards = useAppSelector(selectFlipAllCards);
  const quickFilter = useAppSelector(selectQuickFilter);
  const hideDuplicates = useAppSelector(selectHideDuplicates);
  const filters: FiltersByTypes = useAppSelector(selectFilters);


  //const filters = useAppSelector((state: RootState) => state.filters);
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Duplicated cards are bare entries: fill them with the data
    // of the original card so name, text and images are shown.
    const resolvedCards = resolveDuplicateCards(cards);
    const filteredCards = filterCards(resolvedCards, filters);
    const quickFilteredCards = quickFilterCardList(filteredCards, quickFilter);
    const uniqueCards = filterDuplicates(quickFilteredCards, hideDuplicates);
    const sortedCards = sortCards(uniqueCards);
    setFilteredCards(sortedCards);
  }, [cards, quickFilter, filters, hideDuplicates]);

  useEffect(() => {
    dispatch(paginationTotalElementsUpdated(filteredCards?.length || 0));
  }, [filteredCards]);

  useEffect(() => {
    setPaginatedCards(filteredCards.slice(
      pagination.visibleFirstElementIndex,
      pagination.visibleLastElementIndex
    ));
  }, [pagination, filteredCards]);

  return (
    <section id="mc-card-list" className='p-0 d-flex flex-column'>
      <TopActions />
      <h1 id="page-title" className="px-4 py-2">
        <IconForConcept concept="cardList" className="me-2"/>
        {t('card_list')}
      </h1>
      <div className="flex-grow-1 p-4">
        <CardGrid
          cards={paginatedCards} 
          showAllCardData={showAllCardData} 
          flipAllCards={flipAllCards}
      />
      </div>

      <div id="pagination-container" className="bg-dark d-flex flex-column justify-content-center align-items-center mt-3">
        <ReactBSPagination
          totalPages={pagination.totalPages || 1}
          currentPage={pagination.currentPage || 1}
          buttonSize='sm'
          onPageClick={(pageNumber: number) => {
            document.getElementById('page-title')?.scrollIntoView({ behavior: 'instant' });
            dispatch(paginationCurrentPageUpdated(pageNumber));
          }}
          />
      </div>
    </section>
  )
}

export default CardsView