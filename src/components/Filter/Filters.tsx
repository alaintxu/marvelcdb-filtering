import { MultiselectFilter } from "."
import { MCCard } from "../Card"

type CodeName = {
  code: string,
  name: string
}

type FieldsType = {
  "pack": CodeName[]
  "type": CodeName[]
  "card_set": CodeName[]
  "faction": CodeName[]
  "cars_set_type_name": CodeName[]
}

export type CardFilter = {
  field: keyof MCCard,
  values: string[]
}

type Props = {
  cards: MCCard[],
  filters: CardFilter[],
  filterText: string,
  onMultiselectFilterChanged: (name: string, selected: string[]) => void
  onTextFilterChanged: (text: string) => void,
  onFilterReset?: () => void
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

const Filters = ({
  cards,
  filters,
  filterText,
  onMultiselectFilterChanged,
  onTextFilterChanged,
  onFilterReset
}: Props) => {
  const fields: FieldsType = {
    "pack": getUniqueCodeNameArray(cards, 'pack_code' as keyof MCCard, 'pack_name' as keyof MCCard),
    "type": getUniqueCodeNameArray(cards, 'type_code' as keyof MCCard, 'type_name' as keyof MCCard),
    "card_set": getUniqueCodeNameArray(cards, 'card_set_code' as keyof MCCard, 'card_set_name' as keyof MCCard),
    "faction": getUniqueCodeNameArray(cards, 'faction_code' as keyof MCCard, 'faction_name' as keyof MCCard),
    "cars_set_type_name": getUniqueCodeNameArray(cards, 'cars_set_type_name' as keyof MCCard, 'cars_set_type_name' as keyof MCCard)
  }

  const field_keys = Object.keys(fields);

  return (
    <>
      <h1 className="my-3">Filtros</h1>
      <div className='row'>
        <div className='col-12'>
          <div
            className="input-group"
            key="texto">
            <label
              className="input-group-text bg-dark text-light"
              htmlFor="input-filter-text">
              Texto
            </label>
            <input
              type="text"
              value={filterText}
              className='form-control'
              id="input-filter-text"
              onChange={(event) => onTextFilterChanged(event.target.value.toLowerCase())}
            />
          </div>
        </div>

        {field_keys.map((field_key) => {
          const selected: CardFilter = filters.filter(
            (filter) => `${field_key}_code` == filter.field
          )[0];  // @ToDo: This is not removed.
          return (
            <label className='col-md-6 col-lg-4 text-dark' title={field_key} key={field_key}>
              <span className='filter__label'>{field_key}</span>
              <MultiselectFilter
                title={field_key}
                selected={selected}
                options={(fields[field_key as keyof FieldsType]).map((item) => { return { value: item.code, label: item.name } })}
                onChange={(options) => onMultiselectFilterChanged(`${field_key}_code`, options)}
              />
            </label>
          )
        })}
        <div className='col-12'>
          <button
            className="btn btn-danger mt-4"
            onClick={() => {
              if (onFilterReset) onFilterReset();
            }}>
            Borrar filtros
          </button>
        </div>
      </div>
    </>
  )
}

export default Filters