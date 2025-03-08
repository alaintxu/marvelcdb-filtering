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
import { normalizeString, quickFilterCardList } from "../Filter/QuickSearchFilter";
import { sortCards } from "../../store/entities/cardsModificationUtils";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";

const filterDuplicates = (cards: MCCard[], hideDuplicates: boolean=true): MCCard[] => {
  if (!hideDuplicates) return cards;
  let uniqueCards: MCCard[] = [];
  cards.forEach((card) => {
    const existingCard = uniqueCards.find((uniqueCard) => {
      if (uniqueCard.code === card.code) return true;
      if (uniqueCard.duplicate_of_code && uniqueCard.duplicate_of_code === card.code) return true;
      if (card.duplicate_of_code && uniqueCard.code === card.duplicate_of_code) return true;
      if (card.duplicate_of_code && uniqueCard.duplicate_of_code && uniqueCard.duplicate_of_code === card.duplicate_of_code) return true;
      return false;
    });

    const newQuantity = existingCard ? (card.quantity || 1) + (existingCard.quantity || 1) : card.quantity || 1;

    if (!existingCard) {
      uniqueCards.push({
        ...card,
        quantity: newQuantity
      });
    } else {
      if (card.code === existingCard.duplicate_of_code) {
        uniqueCards = uniqueCards.filter((uniqueCard) => uniqueCard.code !== existingCard.code);
        uniqueCards.push({
          ...card,
          quantity: newQuantity}
        );
      }
      // update quantity
      existingCard.quantity = newQuantity;
    }
  });
  return uniqueCards;
}


const filterCards = (cards: MCCard[], filters: FiltersByTypes): MCCard[] => {
  return cards.filter((card) => {
    for (const key of Object.keys(filters['boolean'])) {
      const mcKey = key as keyof MCCard;
      const filterValue = filters['boolean'][mcKey];
      const cardValue = card[mcKey];
      if (filterValue!==undefined && cardValue !== filterValue) {
        return false
      }
    }
    for (const key of Object.keys(filters['number'])) {
      const mcKey = key as keyof MCCard;
      const filterValue = filters['number'][mcKey];
      const cardValue = card[mcKey];
      if (filterValue!==undefined && cardValue !== filterValue) {
        // Card value does not match filter
        return false;
      }
    }
    for (const key of Object.keys(filters['multiselect'])) {
      const mcKey = key as keyof MCCard;
      const filterValues = filters['multiselect'][mcKey];
      const cardValue = card[mcKey]?.toString();
      if (filterValues!==undefined && filterValues.length){
        // Filter is set and has values
        if (cardValue === undefined || filterValues.includes(cardValue) === false) {
          // Card value does not match filter
          return false;
        }
      }
    }
    for (const key of Object.keys(filters['string'])) {
      const mcKey = key as keyof MCCard;
      const filterValue = normalizeString(filters['string'][mcKey]);
      const cardValue = normalizeString(card[mcKey]);
      if (filterValue!==undefined && typeof cardValue === 'string' && cardValue.includes(filterValue) === false) {
        // Card value does not match filter
        return false;
      }
    }
    for (const key of Object.keys(filters['dotted'])) {
      const mcKey = key as keyof MCCard;
      const filterValues = filters['dotted'][mcKey];
      const cardValue = card[mcKey] ? card[mcKey] as string : "";
      if (filterValues!==undefined && !cardValue) {
        // Card does not have value for this field
        return false;
      } 
      const unifiedCardValue = cardValue.endsWith('.') ? cardValue : cardValue+'.';
      if (filterValues!==undefined && filterValues.length && !filterValues.some(value => unifiedCardValue.toLowerCase().includes(value))) {
        // Card value does not match filter
        return false;
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
    const filteredCards = filterCards(cards, filters);
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