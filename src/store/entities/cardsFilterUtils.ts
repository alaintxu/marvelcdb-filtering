import { FiltersByTypes } from "../ui/filters";
import { MCCard } from "./cards";

export const normalizeString = (value?: unknown) => {
    if (!value) {
        return "";
    }
    const text = typeof value === 'string' ? value : String(value);
    return text.normalize('NFD')
        .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2")
        .normalize()
        .toLowerCase();
}

export const filterCards = (cards: MCCard[], filters: FiltersByTypes): MCCard[] => {
  return cards.filter((card) => {
    for (const key of Object.keys(filters['boolean'])) {
      const mcKey = key as keyof MCCard;
      const filterValue = filters['boolean'][mcKey];
      const cardValue = card[mcKey];
      if (filterValue !== undefined) {
        const cardHasField = cardValue !== undefined;
        if (cardHasField !== filterValue) {
          return false;
        }
      }
    }
    for (const key of Object.keys(filters['number'])) {
      const mcKey = key as keyof MCCard;
      const filter = filters['number'][mcKey];
      if (filter !== undefined) {
        const cardValue = card[mcKey];
        if (typeof cardValue !== 'number') {
          return false;
        }
        if (filter.operator === '<' && !(cardValue < filter.value)) {
          return false;
        }
        if (filter.operator === '>' && !(cardValue > filter.value)) {
          return false;
        }
        if (filter.operator === '=' && cardValue !== filter.value) {
          return false;
        }
      }
    }
    for (const key of Object.keys(filters['multiselect'])) {
      const mcKey = key as keyof MCCard;
      const filterValues = filters['multiselect'][mcKey];
      const cardValue = card[mcKey]?.toString();
      if (filterValues!==undefined && filterValues.length){
        // Filter is set and has values
        const filterValuesSet = new Set(filterValues);
        if (cardValue === undefined || !filterValuesSet.has(cardValue)) {
          // Card value does not match filter
          return false;
        }
      }
    }
    for (const key of Object.keys(filters['string'])) {
      const mcKey = key as keyof MCCard;
      const filterValue = normalizeString(filters['string'][mcKey]);
      const cardValue = normalizeString(card[mcKey]);
      if (filterValue!==undefined && typeof cardValue === 'string' && cardValue.includes(filterValue) === false) {
        // Card value does not match filter
        return false;
      }
    }
    for (const key of Object.keys(filters['dotted'])) {
      const mcKey = key as keyof MCCard;
      const filterValues = filters['dotted'][mcKey];
      const cardValue = card[mcKey] ? card[mcKey] as string : "";
      if (filterValues?.length && !cardValue) {
        // Card does not have value for this field
        return false;
      } 
      const unifiedCardValue = cardValue.endsWith('.') ? cardValue : cardValue+'.';
      if (filterValues!==undefined && filterValues.length && !filterValues.some(value => unifiedCardValue.toLowerCase().includes(value))) {
        // Card value does not match filter
        return false;
      }
    }
    return true;
  });
};
