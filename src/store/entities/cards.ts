import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { RootState } from "../configureStore";
import { getFromLocalStorageCompressed } from "../../LocalStorageHelpers";
import {cleanCards} from "./cardsModificationUtils";
import { FieldOption } from "../ui/filters";

export const LOCAL_STORAGE_CARDS_KEY = "cards_compressed";
export const CARD_PACK_URL = '/cards/';

export type MCCard = {
    key?: string;
    attack?: number;
    attack_star?: boolean;
    back_flavor?: string;
    back_text?: string;
    backimagesrc?: string;
    base_threat?: number;
    base_threat_fixed?: boolean;
    card_set_code: string;
    card_set_name: string;
    card_set_type_name_code: string;
    code: string;
    cost?: number;
    defense?: number;
    double_sided?: boolean;
    duplicate_of_code?: string;
    duplicate_of_name?: string;
    escalation_threat_fixed?: boolean;
    faction_code: string;
    faction_name: string;
    flavor?: string;
    hand_size?: number;
    health?: number;
    health_per_hero?: boolean;
    hidden?: boolean;
    imagesrc?: string;
    is_unique?: boolean;
    linked_card?: MCCard;
    linked_to_code: string;
    linked_to_name: string;
    meta?: {
      colors?: string[];
      offset?: string;
    };
    name: string;
    octgn_id?: string;
    pack_code: string;
    pack_name: string;
    permanent?: boolean;
    position: number;
    quantity?: number;
    real_name: string;
    real_text?: string;
    real_traits?: string;
    set_position?: number;
    spoiler?: number;
    subname?: string;
    text?: string;
    threat?: number;
    threat_fixed?: boolean;
    thwart?: number;
    thwart_star?: boolean;
    traits?: string;
    type_code: string;
    type_name: string;
    url?: string;
};

const initialState: MCCard[] = getFromLocalStorageCompressed<MCCard[]>(LOCAL_STORAGE_CARDS_KEY) || [] as MCCard[];

/* Reducer */
const slice = createSlice({
    name: 'cards',
    initialState: initialState, //getCardsFromLocalStorage(),
    reducers: {
        removeAllCards: (cards: MCCard[]) => {
            cards = [];
            return cards;
        },
        cardPackRemoved: (cards: MCCard[], action: PayloadAction<string>) => {
            const packCode = action.payload
            cards = cards.filter(
                (card: MCCard) => card.pack_code !== packCode
            );
            // saveCardsToLocalStorage(cards);
            return cards;
        },
        cardsReceived: (cards: MCCard[], action: PayloadAction<MCCard[]>) => {
            const newCards: MCCard[] = action.payload;
            if (newCards.length === 0) return cards;
            cards = cards.filter(
                (card: MCCard) => card.pack_code !== newCards[0].pack_code
            );
            cards = [...cards, ...cleanCards(newCards)];
            //cards = [...sortCards(cards, "code")];
            return cards;
        },
    }
});

/* Reducer exports */
export default slice.reducer;
export const { 
    cardPackRemoved,
    cardsReceived,
    removeAllCards,
} = slice.actions;


/* Selectors */
export const selectAllCards = (state: RootState) => state.entities.cards;
export const selectNumberOfCards = createSelector(
    selectAllCards,
    (cards) => cards.length
)

export const selectCardByCode = (cardCode: string) => createSelector(
    selectAllCards,
    (cards) => cards.find((card: MCCard) => card.code === cardCode)
);

export const selectCardsByCodes = (cardCodes: string[]) => createSelector(
    selectAllCards,
    (cards) => cards.filter((card: MCCard) => cardCodes.includes(card.code))
);

export const selectCardsByPack = (packCode: string) => createSelector(
    selectAllCards,
    (cards) => cards.filter((card: MCCard) => card.pack_code === packCode)
);

export const selectUniqueFieldValues = (fieldName: keyof MCCard) => createSelector(
    selectAllCards,
    (cards) => {
        const values = new Set<string>();
        cards.forEach((card: MCCard) => {
            if (card[fieldName]) {
                values.add(card[fieldName] as string);
            }
        });
        return Array.from(values);
    }
);

export const selectUniqueFieldOptions = (fieldCode: keyof MCCard, fieldName: keyof MCCard) => createSelector(
    selectAllCards,
    (cards) => {
        const foundCodes = new Set<string>();
        const values: FieldOption[] = [];
        cards.forEach((card: MCCard) => {
            if (card[fieldCode] && !foundCodes.has(card[fieldCode] as string) && card[fieldName]) {
                values.push({ value: card[fieldCode] as string, label: card[fieldName] as string });
                foundCodes.add(card[fieldCode] as string);0
            }
        }
        );
        return values.sort((a, b) => a.label.localeCompare(b.label));
    }
);

export const selectUniqueDottedFieldOptions = (fieldCode: keyof MCCard) => createSelector(
    selectAllCards,
    (cards) => {
        const foundCodes = new Set<string>();
        const values: FieldOption[] = [];
        cards.forEach((card: MCCard) => {
            if (card[fieldCode]) {
                const fullString = card[fieldCode] as string;
                const splitString = fullString.split(". ");
                for(const uncleanString of splitString) {
                    // Add a dot if it does not end with it
                    const label = uncleanString.endsWith(".") ? uncleanString : uncleanString + "."
                    const value = label.toLocaleLowerCase();
                    if (!foundCodes.has(value)) {
                        values.push({ value: value, label: label });
                        foundCodes.add(value);
                    }
                }
            }
        });
        return values.sort((a, b) => a.label.localeCompare(b.label));
    }
);

export const selectFieldOption = (fieldCode: keyof MCCard, fieldCodeValue: any, fieldName?: keyof MCCard): ((state: RootState) => FieldOption | undefined) => createSelector(
    selectAllCards,
    (cards) => {
        if (!fieldName) fieldName = fieldCode.replace("code", "name") as keyof MCCard;
        const card: MCCard | undefined = cards.find((card: MCCard) => card[fieldCode] && card[fieldCode] === fieldCodeValue);
        if (!card) return undefined;
        return { value: card[fieldCode] as string, label: card[fieldName] as string };
    }
);


