import { useEffect, useState } from "react";
import CardGrid from "./CardGrid";
import { BsFillEyeFill, BsFillEyeSlashFill, BsPhoneFlip } from 'react-icons/bs';
import { useTranslation } from "react-i18next";
import { ReactBSPagination } from "@draperez/react-components";
import { MCCard } from "../../store/cards";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { currentPageUpdated, elementsUpdated } from "../../store/pagination";


const CardsView = () => {
  const { t } = useTranslation('global');

  // Status
  const [showAllCardData, setShowAllCardData] = useState(false);
  const [flipAllCards, setFlipAllCards] = useState(false);
  const [paginatedCards, setPaginatedCards] = useState<MCCard[]>([]);

  const pagination = useSelector((state: RootState) => state.pagination);
  const cards = useSelector((state: RootState) => state.cards);

  //const filters = useSelector((state: RootState) => state.filters);
  
  const dispatch = useDispatch();

  useEffect(() => {
    /* @ToDo: Change cards for filtered cards */
    dispatch(elementsUpdated(cards));
  }, [cards]);

  useEffect(() => {
    /* @ToDo: Change cards for filtered cards */
    setPaginatedCards(cards.slice(
      pagination.visibleFirstElementIndex,
      pagination.visibleLastElementIndex
    ));
  }, [cards, pagination]);

  return (

    <section id="mc-card-list" className='p-3'>
      <span id="mc-card-list-actions">
        <span>{pagination.elementsPerPage || "?"}</span>
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
      <h1>
        {t('card_list')}
      </h1>
      <CardGrid cards={paginatedCards} showAllCardData={showAllCardData} flipAllCards={flipAllCards} />

      <div id="pagination-container" className="bg-dark d-flex flex-column justify-content-center align-items-center">
        <ReactBSPagination
          totalPages={pagination.totalPages || 1}
          currentPage={pagination.currentPage || 1}
          buttonSize='sm'
          onPageClick={(pageNumber: number) => dispatch(currentPageUpdated(pageNumber))}
          />
      </div>
    </section>
  )
}

export default CardsView