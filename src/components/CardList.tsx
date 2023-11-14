import { Card, MCCard } from './Card';
import { useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';

import { ReactBSPagination } from '@draperez/react-components';
import { CardFilter } from './Filter/Filters';
import { useTranslation } from 'react-i18next';

// Defines the fields where text will be search on text filter
const textFilterFields = [
  'name',
  'real_name',
  'text',
  'real_text',
  'back_text',
  'flavor',
  'traits',
  'real_traits'
];

type Props = {
  cards: MCCard[],
  filters: CardFilter[],
  filterText: string,
  cardsPerPage: number
}
const CardList = ({ cards, filters, filterText, cardsPerPage }: Props) => {
  const {t} = useTranslation('global');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Status
  const [showAllCardData, setShowAllCardData] = useState(false);

  // Filters
  const evaluateCarFiltering = (filter:CardFilter, card:MCCard):boolean => {
    const filterValues = filter.filterStatus.selected.map((option) => option.value);
    const cardValues = card[filter.field] as string[];


    const filteredCardValues = filterValues.filter((filterValue) => cardValues.includes(filterValue));
    if(filter.filterStatus.isAnd)
      return filteredCardValues.length == filterValues.length;
    else 
      return filteredCardValues.length > 0;
  }

  const filteredCards = cards.filter((card) => {
    for (const filter of filters)
      if(!evaluateCarFiltering(filter, card))
        return false


    for (const field of textFilterFields)
      if (String(card[field as keyof MCCard]).toLowerCase().includes(filterText))
        return true;

    return false;
  });

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  const visibleFirstCardIndex = (currentPage - 1) * cardsPerPage;
  const visibleLastCardIndex = visibleFirstCardIndex + cardsPerPage;
  const paginatedCards = filteredCards.slice(
    visibleFirstCardIndex,
    visibleLastCardIndex
  )

  return (
    <>
      <button
        className={`position-absolute top-0 end-0 btn btn-${showAllCardData ? 'primary' : 'secondary'}`}
        onClick={() => setShowAllCardData((prev) => !prev)}>
        {showAllCardData ? <>
          <BsFillEyeSlashFill title="Esconder datos"/>
        </> : <>
          <BsFillEyeFill title="Mostrar datos"/>
        </>}
      </button>
      <h1>
        {t('card_list')} &nbsp;
        <span className='badge text-dark bg-light'>
          {visibleFirstCardIndex + 1}-{Math.min(...[visibleLastCardIndex, filteredCards.length])}/{filteredCards.length}
        </span>
      </h1>
      <div className='p-3'>
        <ReactBSPagination
          totalPages={totalPages}
          currentPage={currentPage}
          buttonSize='sm'
          onPageClick={(pageNumber: number) => setCurrentPage(pageNumber)} />
      </div>
      <div className="card-grid">
        {paginatedCards.map((card: MCCard) => <Card showCardData={showAllCardData} card={card} key={card.code} />)}
      </div>
      <div className='p-3'>
        <ReactBSPagination
          totalPages={totalPages}
          currentPage={currentPage}
          buttonSize='sm'
          onPageClick={(pageNumber: number) => setCurrentPage(pageNumber)} />
      </div>
    </>
  )
}

export default CardList