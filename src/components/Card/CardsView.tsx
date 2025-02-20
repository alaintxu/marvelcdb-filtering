import { useEffect, useState } from "react";
import CardGrid from "./CardGrid";
import { BsFillEyeFill, BsFillEyeSlashFill, BsPersonBadge, BsPhoneFlip } from 'react-icons/bs';
import { useTranslation } from "react-i18next";
import { ReactBSPagination } from "@draperez/react-components";
import { MCCard, selectAllCards } from "../../store/entities/cards";
import { useDispatch, useSelector } from "react-redux";
import { paginationCurrentPageUpdated, paginationTotalElementsUpdated, selectPagination } from "../../store/ui/pagination";

const CardsView = () => {
  const { t } = useTranslation('global');

  // Status
  const [showAllCardData, setShowAllCardData] = useState(false);
  const [flipAllCards, setFlipAllCards] = useState(false);
  const [filteredCards, setFilteredCards] = useState<MCCard[]>([]);
  const [paginatedCards, setPaginatedCards] = useState<MCCard[]>([]);

  const pagination = useSelector(selectPagination);
  const cards = useSelector(selectAllCards);

  //const filters = useSelector((state: RootState) => state.filters);
  
  const dispatch = useDispatch();

  useEffect(() => {
    /* @ToDo: Do filter the cards */
    console.warn('Filtering cards is not implemented yet');
    setFilteredCards(cards);
  }, [cards /*, filters*/]);
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

    <section id="mc-card-list" className='p-3 pb-0'>
      <span id="mc-card-list-actions">
        <button
          className={`btn btn-${showAllCardData ? 'primary' : 'secondary'}`}
          onClick={() => setShowAllCardData((prev) => !prev)}>
          {showAllCardData ? <>
            <BsFillEyeSlashFill title="Esconder datos" />
          </> : <>
            <BsFillEyeFill title="Mostrar datos" />
          </>}
        </button>
        <button
          className={`btn btn-${flipAllCards ? 'primary' : 'secondary'}`}
          onClick={() => setFlipAllCards((prev) => !prev)}>
          <BsPhoneFlip />
        </button>
      </span>
      <h1 id="page-title">
        <BsPersonBadge className="me-2"/>
        {t('card_list')}
      </h1>
      <CardGrid cards={paginatedCards} showAllCardData={showAllCardData} flipAllCards={flipAllCards} />

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