import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { RootState } from "../configureStore";
import { getFromLocalStorageCompressed } from "../../LocalStorageHelpers";

export type MCCard = {
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

const slice = createSlice({
    name: 'cards',
    initialState: getFromLocalStorageCompressed<MCCard[]>("cards_compressed") || [], //getCardsFromLocalStorage(),
    reducers: {
        cardsAdded: (cards: MCCard[], action) => {
            const newCards: MCCard[] = action.payload;
            cards = [...cards, ...newCards];
            // saveCardsToLocalStorage(cards);
            return cards;
        },
        cardPackRemoved: (cards: MCCard[], action) => {
            const packCode = action.payload
            cards = cards.filter(
                (card: MCCard) => card.pack_code !== packCode
            );
            // saveCardsToLocalStorage(cards);
            return cards;
        },
        cardPackAdded: (cards:MCCard[], action) => {
            const packCode = action.payload.packCode;
            const newCards: MCCard[] = action.payload.newCards;
            // Remove old cards of the pack
            cards = cards.filter(
                (card: MCCard) => card.pack_code !== packCode
            );
            cards = [...cards, ...newCards];
            // saveCardsToLocalStorage(cards);
            return cards;
        },
        cardsSet: (cards: MCCard[], action) => {
            const newCards: MCCard[] = action.payload;
            cards = newCards;
            // saveCardsToLocalStorage(cards);
            return cards;

        },
        cardsSorted: (cards: MCCard[], action) => {
            const fieldName: keyof MCCard = action.payload;
            cards = cards.sort((a, b) => {
                const aValue = a[fieldName];
                const bValue = b[fieldName];
                if (typeof aValue === "string" && typeof bValue === "string") {
                    return aValue.localeCompare(bValue);
                } else if (typeof aValue === "number" && typeof bValue === "number") {
                    return aValue - bValue;
                } else if (typeof aValue === "boolean" && typeof bValue === "boolean") {
                    return aValue ? 1 : -1;
                } else if (aValue == null && bValue == null) {
                    return 0;
                } else if (aValue == null) {
                    return -1;
                } else if (bValue == null) {
                    return 1;
                }
                return 0;
            })
        }
    }
});

export const selectAllCards = (state: RootState) => state.entities.cards;
export const selectNumberOfCards = createSelector(
    selectAllCards,
    (cards) => cards.length
)

export const cardByCodeSelector = (cardCode: string) => createSelector(
    selectAllCards,
    (cards) => cards.find(card => card.code === cardCode)
);

export const cardsByCodeSelector = (cardCodes: string[]) => createSelector(
    selectAllCards,
    (cards) => cards.filter(card => cardCodes.includes(card.code))
);

export const cardsByPackSelector = (packCode: string) => createSelector(
    selectAllCards,
    (cards) => cards.filter(card => card.pack_code === packCode)
);

export default slice.reducer;
export const { 
    cardsAdded, 
    cardPackRemoved,
    cardPackAdded,
    cardsSet,
    cardsSorted
} = slice.actions;

