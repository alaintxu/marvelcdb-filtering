import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { quickFilterSet, selectQuickFilter } from "../../store/ui/filters";
import React, { useCallback, useState } from "react";
import IconForConcept from "../IconForConcept";
import { MCCard } from "../../store/entities/cards";
import { AppDispatch } from "../../store/configureStore";


    /*
        card_set_code: string;
        card_set_name: string;
        card_set_type_name_code: string;
        code: string;
        duplicate_of_code?: string;
        duplicate_of_name?: string;
        faction_code: string;
        faction_name: string;
        flavor?: string;
        linked_card?: MCCard;
        linked_to_code: string;
        linked_to_name: string;
        name: string;
        pack_code: string;
        pack_name: string;
        real_name: string;
        real_text?: string;
        real_traits?: string;
        spoiler?: number;
        subname?: string;
        text?: string;
        traits?: string;
        type_name: string;
    */
export const QUICK_SEARCH_FIELDS: Array<keyof MCCard> = [
    // Strings
    'back_flavor',
    'back_text',
    'card_set_name',
    'faction_name',
    'flavor',
    'name', 
    'real_name',
    'pack_name',
    'subname', 
    'traits', 
    'real_traits', 
    'text', 
    'real_text',
    'type_name',
    // Numbers
    'attack',
    'base_threat',
    'cost',
    'defense',
    'hand_size',
    'health',
    'threat',
    'thwart'
];

export const normalizeString = (value?: any) => {
    if (!value) {
        return "";
    }
    if(typeof value !== 'string') {
        value = value.toString();
    }
    return value.normalize('NFD')
    .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi,"$1$2")
    .normalize()
    .toLowerCase();
}

export const quickFilterCardList = (cards: MCCard[], quickFilter: string) => {
    const numberQuickFilter = parseInt(quickFilter, 10);
    const isNumber = !isNaN(numberQuickFilter);
    const lowerCaseQuickFilter = normalizeString(quickFilter);
    if (!lowerCaseQuickFilter) {
        return cards;
    }
    return cards.filter((card) => {
        return QUICK_SEARCH_FIELDS.some((field) => {
            const value = card[field as keyof MCCard];
            switch (typeof value) {
                case 'string':
                    return normalizeString(value).includes(lowerCaseQuickFilter);
                case 'number':
                    if(isNumber) return value === numberQuickFilter;
            }
            return false;
        });
    });
}

const QuickSearchFilter = () => {
    const { t } = useTranslation("filters");
    const dispatch = useDispatch<AppDispatch>();
    const quickFilter = useSelector(selectQuickFilter);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const [quickFilterValue, setQuickFilterValue] = useState(quickFilter);

    const delayedDispatch = useCallback((value: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            dispatch(quickFilterSet(value));
            timeoutRef.current = null;
        }, 500);
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setQuickFilterValue(inputValue);
        delayedDispatch(inputValue);
    };

    const resetValue = () => {
        setQuickFilterValue("");
        dispatch(quickFilterSet(""));
    };

  return (
    <div className="input-group mx-2" id="quick-search-filter">
        <label htmlFor="quick-search-input" className="input-group-text">
            <IconForConcept concept="search" />
        </label>
        <input
            id="quick-search-input"
            type="text" 
            className="form-control search-input" 
            placeholder={t('quick_search')}
            value={quickFilterValue}
            onChange={handleChange}
            />
        <button className="btn btn-outline-danger" onClick={resetValue} type="button">
            <IconForConcept concept="erase" />
        </button>
    </div>
  )
}

export default QuickSearchFilter