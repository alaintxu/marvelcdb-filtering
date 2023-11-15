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
  cardsPerPage: number,
  cardsPerPageChanged: (newCardsPerPage: number) => void,
  onMultiselectFilterChanged: (name: string, newFilterStatus: FilterStatus) => void
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
  cardsPerPage,
  cardsPerPageChanged,
  onMultiselectFilterChanged,
  onFilterReset
}: Props) => {
  const debug = false;
  const { t } = useTranslation('global');  // 'global' says that we are looking for a file named global.json

  const fieldOptions: AllFieldOptions = {
    "pack": getUniqueOptions(cards, 'pack_code' as keyof MCCard, 'pack_name' as keyof MCCard),
    "type": getUniqueOptions(cards, 'type_code' as keyof MCCard, 'type_name' as keyof MCCard),
    "card_set": getUniqueOptions(cards, 'card_set_code' as keyof MCCard, 'card_set_name' as keyof MCCard),
    "faction": getUniqueOptions(cards, 'faction_code' as keyof MCCard, 'faction_name' as keyof MCCard),
    "card_set_type_name_code": getUniqueOptions(cards, 'card_set_type_name_code' as keyof MCCard, 'card_set_type_name_code' as keyof MCCard)
  }
  const field_keys = Object.keys(fieldOptions);

  const multiTextFilter: CardFilter = filters.filter((filter) => filter.field == 'text')[0] || {
    field: "text" as keyof MCCard,
    filterStatus: {
      selected: [],
      isAnd: false
    }
  };

  return (
    <section id="filters" className="bg-dark shadow d-flex flex-column p-3">
      <div className="input-group">
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
      <h1 className="my-3">{t('filters')}</h1>
      <label className='text-dark'>
        <span className='filter__label'>{t('text')}</span>
        <MultiselectFilter
          title={t('text')}
          filterStatus={multiTextFilter.filterStatus}
          options={multiTextFilter.filterStatus.selected}
          hasAndCheckbox={true}
          allowCreate={true}
          onChange={(options) => onMultiselectFilterChanged(`text`, options)}
        />
      </label>

      {field_keys.map((field_key) => {
        const options: OptionType[] = fieldOptions[field_key as keyof AllFieldOptions];
        const currentFilter: CardFilter = filters.filter((filter) => filter.field == field_key)[0] || {
          field: field_key as keyof MCCard,
          filterStatus: {
            selected: [],
            isAnd: false
          }
        };

        return (
          <label className='text-dark' title={field_key} key={field_key}>
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
      <button
        className="btn btn-danger mt-4"
        onClick={() => {
          if (onFilterReset) onFilterReset();
        }}>
        {t('reset_filters')}
      </button>

      {debug &&
        <div className="accordion accordion-flush mt-3" id="accordionFlushExample">
          <div className="accordion-item bg-dark text-light">
            <h2 className="accordion-header">
              <button className="accordion-button bg-secondary text-light collapsed rounded" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                Raw data
              </button>
            </h2>
            <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <pre className="accordion-body bg-light text-dark">
                <code>{JSON.stringify(filters, undefined, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      }
    </section>
  )
}

export default Filters