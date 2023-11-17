import { Dispatch, SetStateAction, /*useEffect,*/ useState } from "react";
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

export const evaluateCardFiltering = (filter: CardFilter, card: MCCard): boolean => {
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


const useFilters = () => {
  const [filters, setFilters] = useState<CardFilter[]>(
    /*JSON.parse(localStorage.getItem('filters') || "[]") as CardFilter[]*/
    []
  );



  /*useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);*/

  return { filters, setFilters };
}

export default useFilters;