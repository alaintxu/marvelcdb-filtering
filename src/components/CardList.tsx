import { useLocalStorage } from 'usehooks-ts';
import { Card, MCCard } from './Card';
import { useState } from 'react';
import { BsArrowsCollapse, BsArrowsExpand } from 'react-icons/bs';

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

const CardList = () => {
  const [cards] = useLocalStorage<MCCard[]>("cards", []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<CardFilter[]>([]);
  const [filterText, setFilterText] = useState("");

  const filteredCards = cards.filter((card) => {
    for (const filter of filters)
      if (!filter.values.includes(String(card[filter.field])))
        return false


    for (const field of textFilterFields)
      if (String(card[field as keyof MCCard]).toLowerCase().includes(filterText))
        return true;

    return false;
  });

  const filterFieldChanged = (field: keyof MCCard, values: string[]) => {
    const tmpFilter = [...filters.filter((f) => f.field !== field)]

    if (values.length == 0) return setFilters(tmpFilter);

    setFilters([
      ...tmpFilter,
      { field: field, values: [...values] }
    ])
  }

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  const visibleFirstCardIndex = (currentPage - 1) * cardsPerPage;
  const visibleLastCardIndex = visibleFirstCardIndex + cardsPerPage;
  const paginatedCards = filteredCards.slice(
    visibleFirstCardIndex,
    visibleLastCardIndex
  )

  return (
    <div>
      <section className='container bg-dark text-light py-3'>
        <h3 onClick={() => setFiltersVisible((prev) => !prev)} role='button'>
          Filtros {filtersVisible ? <BsArrowsCollapse /> : <BsArrowsExpand />}
          &nbsp;
          <span className='badge text-dark bg-light'>({filteredCards.length}/{cards.length})</span>
        </h3>
        {filtersVisible && <>
          <Filters
            cards={cards}
            filters={filters}
            filterText={filterText}
            onTextFilterChanged={(text) => setFilterText(text)} 
            onMultiselectFilterChanged={(name, options) => filterFieldChanged(name as keyof MCCard, options)}/>
        </>}
      </section>
      <section className='container bg-dark text-light'>
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
            onPageClick={(pageNumber: number) => setCurrentPage(pageNumber)} />
        </div>
        <div className="card-grid">
          {paginatedCards.map((card: MCCard) => <Card card={card} key={card.code} />)}
        </div>
        <div className='p-3'>
          <ReactBSPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageClick={(pageNumber: number) => setCurrentPage(pageNumber)} />
        </div>
      </section>
    </div>
  )
}

export default CardList