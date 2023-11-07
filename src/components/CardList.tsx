import { useLocalStorage } from 'usehooks-ts';
import Card, { MCCard } from './Card';
import { useState } from 'react';

type CodeName = {
  code: string,
  name: string
}

type CardFilter = {
  field: keyof MCCard,
  value: string
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

const CardList = () => {
  const [cards] = useLocalStorage<MCCard[]>("cards", []);

  // Filters
  const fields = {
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
      if (card[filter.field] != filter.value)
        return false

    const textFilterFields = ['name', 'real_name', 'text', 'real_text', 'flavor', 'traits', 'real_traits'];

    for (const field of textFilterFields)
      if(String(card[field as keyof MCCard]).toLowerCase().includes(filterText))
        return true;
    
    return false;
  });

  const filterFieldChanged = (field: keyof MCCard, value: string) => {
    const tmpFilter = [...filters.filter((f) => f.field !== field)]

    if (value == "all") return setFilters(tmpFilter);

    setFilters([
      ...tmpFilter,
      { field: field, value: value }
    ])
  }

  return (
    <div>
      <section className='container bg-dark text-light py-3'>
        <h3>Filtros</h3>
        <div className='row'>
          {field_keys.map((field_key) => {

            const id = `select-${field_key}`;
            return <>
              <div className='col-md-6 col-lg-4'>
                <div
                  className="input-group mb-3"
                  key={field_key}>
                  <label className="input-group-text" htmlFor={id}>{field_key}</label>
                  <select
                    name={field_key}
                    className="form-select"
                    id={id}
                    onChange={(event) => filterFieldChanged(`${field_key}_code` as keyof MCCard, event.target.value)}>
                    <option value="all">All</option>
                    {fields[field_key].map((item) => <option value={item.code} key={item.code}>{item.name}</option>)}
                  </select>
                </div></div>
            </>
          })}
          <div className='col-md-6 col-lg-4'>
            <div
              className="input-group mb-3"
              key="texto">
              <label className="input-group-text" htmlFor="input-filter-text">Texto</label>
              <input 
                type="text" 
                className='form-control' 
                id="input-filter-text"
                onChange={(event) => setFilterText(event.target.value.toLowerCase())}
              />
            </div></div>
        </div>
      </section>
      <section className='container bg-dark text-light'>
        <h1>Listado de cartas <span className='badge text-dark bg-light'>({filteredCards.length}/{cards.length})</span></h1>
        <div className="card-grid">
          {filteredCards.map((card: MCCard) => <Card card={card} key={card.code} />)}
        </div>
      </section>
    </div>
  )
}

export default CardList