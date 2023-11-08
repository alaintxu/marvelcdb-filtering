import { useLocalStorage } from 'usehooks-ts';
import Card, { MCCard } from './Card';
import { useState } from 'react';
import MultiselectFilter from './MultiselectFilter';
import { BsArrowsCollapse, BsArrowsExpand } from 'react-icons/bs';

import { ReactBSPagination } from '@draperez/react-components';

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

type CodeName = {
  code: string,
  name: string
}

type CardFilter = {
  field: keyof MCCard,
  values: string[]
}

const getUniqueCodeNameArray = (cards: MCCard[], key: keyof MCCard, value: keyof MCCard): CodeName[] => {
  const allCodeNames: CodeName[] = cards.map((card) => {
    return {
      code: String(card[key]) || `__`,
      name: String(card[value] || `<Sin ${value}>`)
    }
  });

  const filteredCodeNameArray: CodeName[] = allCodeNames.filter(
    (set, index, self) =>
      index === self.findIndex((t) => (
        t.code === set.code
      ))
  );  // Filter repeated sets

  return filteredCodeNameArray;
}

const cardsPerPage: number = 12;

type FieldsType = {
  "pack": CodeName[]
  "type": CodeName[]
  "card_set": CodeName[]
  "faction": CodeName[]
  "cars_set_type_name": CodeName[]
}

const CardList = () => {
  const [cards] = useLocalStorage<MCCard[]>("cards", []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [filtersVisible, setFiltersVisible] = useState(false);
  const fields:FieldsType = {
    "pack": getUniqueCodeNameArray(cards, 'pack_code' as keyof MCCard, 'pack_name' as keyof MCCard),
    "type": getUniqueCodeNameArray(cards, 'type_code' as keyof MCCard, 'type_name' as keyof MCCard),
    "card_set": getUniqueCodeNameArray(cards, 'card_set_code' as keyof MCCard, 'card_set_name' as keyof MCCard),
    "faction": getUniqueCodeNameArray(cards, 'faction_code' as keyof MCCard, 'faction_name' as keyof MCCard),
    "cars_set_type_name": getUniqueCodeNameArray(cards, 'cars_set_type_name' as keyof MCCard, 'cars_set_type_name' as keyof MCCard)
  }
  const field_keys = Object.keys(fields);
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
        {filtersVisible && <div className='row'>
          <div className='col-12'>
            <div
              className="input-group mb-3"
              key="texto">
              <label
                className="input-group-text bg-dark text-light"
                htmlFor="input-filter-text">
                Texto
              </label>
              <input
                type="text"
                className='form-control'
                id="input-filter-text"
                onChange={(event) => setFilterText(event.target.value.toLowerCase())}
              />
            </div>
          </div>

          {field_keys.map((field_key) => {
            return <>
              <label className='col-md-6 col-lg-4 text-dark' title={field_key}>
                <span className='filter__label'>{field_key}</span>
                <MultiselectFilter
                  title={field_key}
                  options={(fields[field_key as keyof FieldsType]).map((item) => { return { value: item.code, label: item.name } })}
                  onChange={(options) => filterFieldChanged(`${field_key}_code` as keyof MCCard, options)}
                />
              </label>
            </>
          })}
        </div>
        }
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