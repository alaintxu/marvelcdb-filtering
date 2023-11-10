import { useLocalStorage } from 'usehooks-ts';
import { Card, MCCard } from './Card';
import { useState } from 'react';
import { BsArrowsCollapse, BsArrowsExpand, BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';

import { ReactBSPagination } from '@draperez/react-components';
import { Filters } from './Filter';
import { CardFilter } from './Filter/Filters';

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

const cardsPerPage: number = 12;

type Props = {
  cards: MCCard[],
  filters: CardFilter[],
  filterText: string,
}
const CardList = ({ cards, filters, filterText }: Props) => {

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Status
  const [showAllCardData, setShowAllCardData] = useState(false);

  // Filters

  const filteredCards = cards.filter((card) => {
    for (const filter of filters)
      if (!filter.values.includes(String(card[filter.field])))
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
          <BsFillEyeSlashFill /> Esconder datos
        </> : <>
          <BsFillEyeFill /> Mostrar datos
        </>}
      </button>
      <h1>
        Listado de cartas &nbsp;
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