import { useTranslation } from "react-i18next"
import { MultiselectFilter } from "."
import { MCCard } from "../Card"
import { FilterStatus, OptionType } from "./MultiselectFilter"

type AllFieldOptions = {
  "pack": OptionType[]
  "type": OptionType[]
  "card_set": OptionType[]
  "faction": OptionType[]
  "card_set_type_name_code": OptionType[]
}

export type CardFilter = {
  field: keyof MCCard,
  filterStatus: FilterStatus
}

type Props = {
  cards: MCCard[],
  filters: CardFilter[],
  filterText: string,
  cardsPerPage: number,
  cardsPerPageChanged: (newCardsPerPage: number) => void,
  onMultiselectFilterChanged: (name: string, newFilterStatus: FilterStatus) => void
  onTextFilterChanged: (text: string) => void,
  onFilterReset?: () => void
}

const getUniqueOptions = (cards: MCCard[], key: keyof MCCard, value: keyof MCCard): OptionType[] => {
  const allOptionTypes: OptionType[] = cards.map((card) => {
    return {
      value: String(card[key]) || `__`,
      label: String(card[value] || `<Sin ${value}>`)
    }
  });

  const uniqueOptionTypes: OptionType[] = allOptionTypes.filter(
    (set, index, self) =>
      index === self.findIndex((t) => (
        t.value === set.value
      ))
  );  // Filter repeated sets

  return uniqueOptionTypes;
}


const Filters = ({
  cards,
  filters,
  filterText,
  cardsPerPage,
  cardsPerPageChanged,
  onMultiselectFilterChanged,
  onTextFilterChanged,
  onFilterReset
}: Props) => {
  const { t } = useTranslation('global');  // 'global' says that we are looking for a file named global.json

  const fieldOptions:AllFieldOptions = {
    "pack": getUniqueOptions(cards, 'pack_code' as keyof MCCard, 'pack_name' as keyof MCCard),
    "type": getUniqueOptions(cards, 'type_code' as keyof MCCard, 'type_name' as keyof MCCard),
    "card_set": getUniqueOptions(cards, 'card_set_code' as keyof MCCard, 'card_set_name' as keyof MCCard),
    "faction": getUniqueOptions(cards, 'faction_code' as keyof MCCard, 'faction_name' as keyof MCCard),
    "card_set_type_name_code": getUniqueOptions(cards, 'card_set_type_name_code' as keyof MCCard, 'card_set_type_name_code' as keyof MCCard)
  }
  const field_keys = Object.keys(fieldOptions);

  return (
    <>

      <div className='row'>
        <div className='col-8 col-md-6 col-xl-3'>
          <div
            className="input-group mt-3"
            key="texto">
            <label
              className="input-group-text bg-dark text-light"
              htmlFor="input-cards-per-page">
              {t('cards_per_page')}
            </label>
            <input
              type="number"
              value={cardsPerPage}
              className='form-control'
              id="input-cards-per-page"
              onChange={(event) => cardsPerPageChanged(parseInt(event.target.value))}
            />
          </div>
        </div>
      </div>
      <h1 className="my-3">{t('filters')}</h1>
      <div className='row'>
        <div className='col-12'>
          <div
            className="input-group"
            key="texto">
            <label
              className="input-group-text bg-dark text-light"
              htmlFor="input-filter-text">
              {t('text')}
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
          const options:OptionType[] = fieldOptions[field_key as keyof AllFieldOptions];
          const currentFilter:CardFilter = filters.filter((filter) => filter.field == field_key)[0] || {
            field: field_key as keyof MCCard,
            filterStatus: {
              selected: [],
              isAnd: false
            }
          };

          return (
            <label className='col-md-6 col-lg-4 text-dark' title={field_key} key={field_key}>
              <span className='filter__label'>{field_key}</span>
              <MultiselectFilter
                title={t(field_key)}
                filterStatus={currentFilter.filterStatus}
                options={options}
                hasAndCheckbox={false}
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
            {t('reset_filters')}
          </button>
        </div>
        {/*
        <pre><code>{JSON.stringify(filterText, undefined, 2)}</code></pre>
        <pre><code>{JSON.stringify(filters, undefined, 2)}</code></pre>
          */}
      </div>
    </>
  )
}

export default Filters