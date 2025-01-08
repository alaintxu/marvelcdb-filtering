import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

import { MCCard } from "./useCards";


export type OptionType = {
  value: string
  label: string
}

export type FilterStatus = {
  selected: OptionType[],
  isAnd: boolean
}

export type CardFilter = {
  field: keyof MCCard,
  filterStatus: FilterStatus
}

export type SelectedFilters = {
  [key: string]: string[]
}

// Defines the fields where text will be search on text filter
export const textFilterFields = [
  'name',
  'real_name',
  'text',
  'real_text',
  'back_text',
  'flavor',
  'traits',
  'real_traits'
];

const evaluateCardFiltering = (filter: CardFilter, card: MCCard): boolean => {
  const filterValues = filter.filterStatus.selected.map((option) => option.value);
  const cardValues = card[filter.field as keyof MCCard] as string[];


  const filteredCardValues = filterValues.filter((filterValue) => cardValues?.includes(filterValue));
  if (filter.filterStatus.isAnd)
    return filteredCardValues.length == filterValues.length;
  else
    return filteredCardValues.length > 0;
}

export const filterStatusChanged = (
  filters: CardFilter[],
  setFilters: Dispatch<SetStateAction<CardFilter[]>>,
  field: keyof MCCard,
  newStatus: FilterStatus
) => {
  const tmpFilter = [...filters.filter((f) => f.field !== field)]

  if (newStatus.selected.length == 0) return setFilters(tmpFilter);

  setFilters([
    ...tmpFilter,
    {
      field: field,
      filterStatus: {
        selected: [...newStatus.selected],
        isAnd: newStatus.isAnd
      }
    }
  ])
}

const evaluateCardTextFiltering = (textFilter: CardFilter, card: MCCard): boolean => {
  /*
  ** Evaluate if the given card contains the texts defined in the given
  ** textFilter
  */

  // Fields positivelly evaluated (name, text, flavor )
  const fieldsContainingText = textFilterFields.filter((field) => {
    // The actual value of the field
    const fieldValue = String(card[field as keyof MCCard]).toLowerCase();

    // The texts selected in the filters
    const selectedTexts = textFilter.filterStatus.selected;

    // The selected text found in the fieldValue
    const evaluatedTexts = selectedTexts.filter((selectedText) => fieldValue.includes(selectedText.value.toLowerCase()))

    if (textFilter.filterStatus.isAnd)
      // All selected texts must appear
      return selectedTexts.length == evaluatedTexts.length;
    else
      // At least 1 selected text must appear
      return evaluatedTexts.length > 0;

  });

  // Any field has positive evaluation?
  return fieldsContainingText.length > 0;
}


const filterCards = (cards: MCCard[], filters: CardFilter[]): MCCard[] => {
  return cards.filter((card) => {
    const noTextFilters = filters.filter((filter) => filter.field !== 'text');

    const evaluatedFilters = noTextFilters.filter(
      (filter) => evaluateCardFiltering(filter, card)
    );

    if (evaluatedFilters.length != noTextFilters.length) return false;

    const textFilter = filters.find((filter) => filter.field == 'text');
    if (!textFilter) return true;
    return evaluateCardTextFiltering(textFilter, card);
  });
}

const filterCardsBySelectedFilters = (cards: MCCard[], selectedFilters: SelectedFilters): MCCard[] => {
  return cards.filter((card) => {
    for (const [key, filterValues] of Object.entries(selectedFilters)) {
      if (!card.hasOwnProperty(key)) return false;
      const cardValue = card[key as keyof MCCard];

      switch (typeof cardValue) {
        case 'string':
          console.info(`Filtering by string ${key}: ${cardValue}`);
          if (!filterValues.includes(cardValue.toLowerCase())) return false;
          break;
        case 'number':
          console.info(`Filtering by number ${key}: ${cardValue}`);
          const numberFilterValues = filterValues.map((value) => parseInt(value));
          if (!numberFilterValues.includes(cardValue)) return false;
          break;
        case 'boolean':
          console.info(`Filtering by boolean ${key}: ${cardValue}`);
          const booleanFilterValues = filterValues.map((value) => value == 'true');
          if (!booleanFilterValues.includes(cardValue)) return false;
          break;
        default:
          console.warn(`Unknown type for field ${key}: ${cardValue} (${typeof cardValue})`);
          break;
      }
    }
    return true;
  })
}


const useFilters = (cards: MCCard[]) => {
  // const [filters, setFilters] = useState<CardFilter[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});

  /*const filteredCards = useMemo(
    () => filterCards(cards, filters),
    [cards, filters]
  );*/

  const filteredCards = useMemo(
    () => filterCardsBySelectedFilters(cards, selectedFilters),
    [cards, selectedFilters]
  );

  /*useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    // Foreach key of MCCard class get query Params
    let queryParamSelectedFilters: SelectedFilters = {};
    for (const [key, value] of queryParams.entries()) {
      queryParamSelectedFilters[key] = value.split(",");
      setSelectedFilters(queryParamSelectedFilters);
    }
  }, []);*/

  useEffect(() => {
    let filterString = "";
    for(let [key, values] of Object.entries(selectedFilters)){
      filterString += `${key}=${values.join(",")}&`
    }
    window.history.pushState(null, "", `?${filterString}`);
  }, [selectedFilters]);

  return { /*filters, setFilters,*/ selectedFilters, setSelectedFilters, filteredCards };
}

export default useFilters;