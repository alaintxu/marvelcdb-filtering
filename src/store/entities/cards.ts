import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { RootState } from "../configureStore";
//import { getFromLocalStorageCompressed, saveToLocalStorageCompressed } from './helpers';

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

/*  
// Local Storage
const getCardsFromLocalStorage = (): MCCard[] => {
    // @ToDo: Fix the issue with local storage
    return getFromLocalStorageCompressed<MCCard[]>(`cards`) || [];
    //return [];
}
*/

// const saveCardsToLocalStorage = (cards: MCCard[]) => {
//     return saveToLocalStorageCompressed<MCCard[]>(`cards`, cards);
// }

const slice = createSlice({
    name: 'cards',
    initialState: [] as MCCard[], //getCardsFromLocalStorage(),
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

        }
    }
});

export const selectAllCards = (state: RootState) => state.entities.cards;
export const selectNumberOfCards = createSelector(
    (state: RootState) => state.entities.cards,
    (cards) => cards.length
)

export const cardByCodeSelector = (cardCode: string) => createSelector(
    [(state: RootState) => state.entities.cards],
    (cards) => cards.find(card => card.code === cardCode)
);

export const cardsByPackSelector = (packCode: string) => createSelector(
    (state: RootState) => state.entities.cards,
    (cards) => cards.filter(card => card.pack_code === packCode)
);

export const totalNumberOfCardsSelector = createSelector(
    (state: RootState) => state.entities.cards,
    (cards) => cards.length
);

export default slice.reducer;
export const { 
    cardsAdded, 
    cardPackRemoved,
    cardPackAdded,
    cardsSet
} = slice.actions;

