import { useState } from "react";
import CardGrid from "./CardGrid";
import { BsFillEyeFill, BsFillEyeSlashFill, BsPhoneFlip } from 'react-icons/bs';
import { useTranslation } from "react-i18next";
import { ReactBSPagination } from "@draperez/react-components";
import usePaginationStatusQuery from "../../hooks/usePaginationStatusQuery";
import { MCCard } from "../../hooks/useCardsQuery";
import { getLanguage } from "../../i18n";


const CardsView = () => {
  const { t, i18n } = useTranslation('global');

  // Status
  const { paginationStatus, setPageMutation, paginatedElements: paginatedCards } = usePaginationStatusQuery<MCCard>(["cards", getLanguage(i18n)]);
  const [showAllCardData, setShowAllCardData] = useState(false);
  const [flipAllCards, setFlipAllCards] = useState(false);

  return (

    <section id="mc-card-list" className='p-3'>
      <span id="mc-card-list-actions">
        <span>{paginationStatus?.elementsPerPage || "?"}</span>
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
      <CardGrid cards={paginatedCards || []} showAllCardData={showAllCardData} flipAllCards={flipAllCards} />

      <div id="pagination-container" className="bg-dark d-flex flex-column justify-content-center align-items-center">
        <ReactBSPagination
          totalPages={paginationStatus?.totalPages || 1}
          currentPage={paginationStatus?.currentPage || 1}
          buttonSize='sm'
          onPageClick={async (pageNumber: number) => await setPageMutation(pageNumber)} />
      </div>
    </section>
  )
}

export default CardsView