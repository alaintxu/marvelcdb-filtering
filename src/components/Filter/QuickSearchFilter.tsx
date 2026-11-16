import { useTranslation } from "react-i18next";

import { quickFilterSet, selectQuickFilter } from "../../store/ui/filters";
import React, { useState } from "react";
import IconForConcept from "../IconForConcept";
import { MCCard } from "../../store/entities/cards";
import { normalizeString } from "../../store/entities/cardsFilterUtils";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import * as stylex from '@stylexjs/stylex';
import { ui } from "../../styles/ui";
import { InputGroup } from "@astryxdesign/core/InputGroup";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Button } from "@astryxdesign/core/Button";


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
                    if (isNumber) return value === numberQuickFilter;
            }
            return false;
        });
    });
}

const QuickSearchFilter = () => {
    const { t } = useTranslation("filters");
    const dispatch = useAppDispatch();
    const quickFilter = useAppSelector(selectQuickFilter);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const [quickFilterValue, setQuickFilterValue] = useState(quickFilter);

    const delayedDispatch = (value: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            dispatch(quickFilterSet(value));
            timeoutRef.current = null;
        }, 500);
    };

    const handleChange = (inputValue: string) => {
        setQuickFilterValue(inputValue);
        delayedDispatch(inputValue);
    };

    const resetValue = () => {
        setQuickFilterValue("");
        dispatch(quickFilterSet(""));
    };

    return (
        <div {...stylex.props(ui.mx2)} id="quick-search-filter">
            <InputGroup label={t('quick_search')} isLabelHidden size="lg">
                <TextInput
                    id="quick-search-input"
                    type="search"
                    label={t('quick_search')}
                    aria-label={t('quick_search')}
                    isLabelHidden
                    startIcon={<IconForConcept concept="search" />}
                    placeholder={t('quick_search')}
                    value={quickFilterValue}
                    onChange={handleChange}
                />
                <Button
                    label={t('clear_quick_search')}
                    isIconOnly
                    variant="destructive"
                    icon={<IconForConcept concept="erase" />}
                    onClick={resetValue}
                />
            </InputGroup>
        </div>
    )
}

export default QuickSearchFilter