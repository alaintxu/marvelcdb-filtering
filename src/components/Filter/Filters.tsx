import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MultiselectFilter } from ".";
import { MCCard } from "../../hooks/useCards";
import { CardFilter, FilterStatus, OptionType, textFilterFields } from "../../hooks/useFilters";

type Props = {
  cards: MCCard[],
  filters: CardFilter[],
  cardsPerPage: number,
  cardsPerPageChanged: (newCardsPerPage: number) => void,
  onMultiselectFilterChanged: (name: string, newFilterStatus: FilterStatus) => void
  onFilterReset?: () => void
}

const getUniqueOptions = (cards: MCCard[], key: keyof MCCard, value: keyof MCCard): OptionType[] => {
  // All value-label elements for a type
  const allOptionTypes: OptionType[] = cards.map((card) => {
    return {
      value: String(card[key]) || `__`,
      label: String(card[value] || `<Sin ${value}>`)
    }
  });

  // Remove repeated options
  const uniqueOptionTypes: OptionType[] = allOptionTypes.filter(
    (set, index, self) =>
      index === self.findIndex((t) => (
        t.value === set.value
      ))
  );

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
  const { t } = useTranslation('global');

  const fieldOptions: Map<string, OptionType[]> = useMemo(() => {
    const map = new Map<string, OptionType[]>();
    map.set("pack_code", getUniqueOptions(cards, 'pack_code' as keyof MCCard, 'pack_name' as keyof MCCard));
    map.set("type_code", getUniqueOptions(cards, 'type_code' as keyof MCCard, 'type_name' as keyof MCCard));
    map.set("card_set_code", getUniqueOptions(cards, 'card_set_code' as keyof MCCard, 'card_set_name' as keyof MCCard));
    map.set("faction_code", getUniqueOptions(cards, 'faction_code' as keyof MCCard, 'faction_name' as keyof MCCard));
    map.set("card_set_type_name_code", getUniqueOptions(cards, 'card_set_type_name_code' as keyof MCCard, 'card_set_type_name_code' as keyof MCCard));
    map.set("illustrator", getUniqueOptions(cards, 'illustrator' as keyof MCCard, 'illustrator' as keyof MCCard));
    return map;
  }, [cards]);
  const field_keys = fieldOptions.keys();

  const multiTextFilter: CardFilter = useMemo(
    () => filters.find((filter) => filter.field == 'text') || {
      field: "text" as keyof MCCard,
      filterStatus: {
        selected: [],
        isAnd: false
      }
    }, [filters]);

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
          min="1"
          step="1"
          onChange={(event) => cardsPerPageChanged(parseInt(event.target.value))}
        />
      </div>
      <h1 className="my-3">{t('filters')}</h1>
      <label
        className='text-dark'
        title={`${t('title.text_will_be_search_in_fields')}: ${textFilterFields.join(", ")}`}>
        <span
          className='filter__label'>
          {t('text')}
        </span>
        <MultiselectFilter
          title={t('field.text') + "*"}
          filterStatus={multiTextFilter.filterStatus}
          options={multiTextFilter.filterStatus.selected}
          hasAndCheckbox={true}
          allowCreate={true}
          onChange={(options) => onMultiselectFilterChanged(`text`, options)}
        />
      </label>

      {[...field_keys].map((field_key) => {
        const options: OptionType[] = fieldOptions.get(field_key) || [];
        const currentFilter: CardFilter = filters.find((filter) => filter.field == field_key) || {
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
              title={t(`field.${field_key}`)}
              filterStatus={currentFilter.filterStatus}
              options={options}
              hasAndCheckbox={false}
              onChange={(options) => onMultiselectFilterChanged(`${field_key}`, options)}
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