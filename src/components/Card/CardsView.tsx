import { useEffect, useState } from "react";
import CardGrid from "./CardGrid";
import { useTranslation } from "react-i18next";
import { ReactBSPagination } from "@draperez/react-components";
import { MCCard, selectAllCards } from "../../store/entities/cards";
import { useDispatch, useSelector } from "react-redux";
import { paginationCurrentPageUpdated, paginationTotalElementsUpdated, selectPagination } from "../../store/ui/pagination";
import IconForConcept from "../IconForConcept";
import { selectFlipAllCards, selectShowAllCardData } from "../../store/ui/other";
import { FiltersByTypes, selectFilters, selectQuickFilter } from "../../store/ui/filters";
import TopActions from "../TopActions";
import { normalizeString, quickFilterCardList } from "../Filter/QuickSearchFilter";
import { AppDispatch } from "../../store/configureStore";
import { sortCards } from "../../store/entities/cardsModificationUtils";


const filterCards = (cards: MCCard[], filters: FiltersByTypes): MCCard[] => {
  // @ToDo: add multiselect filters
  console.warn('multiselect filters not implemented yet');
  return cards.filter((card) => {
    for (const key of Object.keys(filters['number'])) {
      const mcKey = key as keyof MCCard;
      const value = filters['number'][mcKey];
      if (value!==undefined && card[mcKey] !== value) {
        return false;
      }
    }
    for (const key of Object.keys(filters['string'])) {
      const mcKey = key as keyof MCCard;
      const value = normalizeString(filters['string'][mcKey]);
      const cardValue = normalizeString(card[mcKey]);
      if (value!==undefined && typeof cardValue === 'string' && cardValue.includes(value) === false) {
        return false;
      }
    }
    for (const key of Object.keys(filters['boolean'])) {
      const mcKey = key as keyof MCCard;
      const value = filters['boolean'][mcKey];
      if (value!==undefined && card[mcKey] !== value) {
        return false
      }
    }
    return true;
  });
};
const CardsView = () => {
  const { t } = useTranslation('global');

  // Status
  const [filteredCards, setFilteredCards] = useState<MCCard[]>([]);
  const [paginatedCards, setPaginatedCards] = useState<MCCard[]>([]);

  const pagination = useSelector(selectPagination);
  const cards = useSelector(selectAllCards);

  const showAllCardData = useSelector(selectShowAllCardData);
  const flipAllCards = useSelector(selectFlipAllCards);
  const quickFilter = useSelector(selectQuickFilter);
  const filters: FiltersByTypes = useSelector(selectFilters);


  //const filters = useSelector((state: RootState) => state.filters);
  
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const filteredCards = filterCards(cards, filters);
    const quickFilteredCards = quickFilterCardList(filteredCards, quickFilter);
    const sortedCards = sortCards(quickFilteredCards);
    setFilteredCards(sortedCards);
  }, [cards, quickFilter, filters]);

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