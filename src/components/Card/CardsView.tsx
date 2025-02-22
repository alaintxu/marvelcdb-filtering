import { useEffect, useState } from "react";
import CardGrid from "./CardGrid";
import { useTranslation } from "react-i18next";
import { ReactBSPagination } from "@draperez/react-components";
import { MCCard, selectAllCards } from "../../store/entities/cards";
import { useDispatch, useSelector } from "react-redux";
import { paginationCurrentPageUpdated, paginationTotalElementsUpdated, selectPagination } from "../../store/ui/pagination";
import IconForConcept from "../IconForConcept";
import { selectFlipAllCards, selectShowAllCardData } from "../../store/ui/other";
import { selectQuickFilter } from "../../store/ui/filters";
import TopActions from "../TopActions";
import { quickFilterCardList } from "../Filter/QuickSearchFilter";

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


  //const filters = useSelector((state: RootState) => state.filters);
  
  const dispatch = useDispatch();

  useEffect(() => {
    /* @ToDo: Do filter the cards */
    console.warn('Filtering cards is not implemented yet');
    const quickFilteredCards = quickFilterCardList(cards, quickFilter);
    setFilteredCards(quickFilteredCards);
  }, [cards, quickFilter /*, filters*/]);
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