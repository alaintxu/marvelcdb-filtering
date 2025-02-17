import { createSlice } from "@reduxjs/toolkit";
import { getFromLocalStorageCompressed, saveToLocalStorageCompressed } from './helpers';

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

  
// Local Storage
const getCardsFromLocalStorage = (): MCCard[] => {
    // @ToDo: Fix the issue with local storage
    return getFromLocalStorageCompressed<MCCard[]>(`cards`) || [];
    //return [];
}

const saveCardsToLocalStorage = (cards: MCCard[]) => {
    return saveToLocalStorageCompressed<MCCard[]>(`cards`, cards);
}

const slice = createSlice({
    name: 'cards',
    initialState: getCardsFromLocalStorage(),
    reducers: {
        cardsAdded: (cards, action) => {
            cards = [...cards, ...action.payload.newCards];
            saveCardsToLocalStorage(cards);
            return cards;
        },
        packCardsRemoved: (cards, action) => {
            cards = cards.filter(
                (card: MCCard) => card.pack_code !== action.payload
            );
            saveCardsToLocalStorage(cards);
            return cards;
        },
        packCardsAdded: (cards, action) => {
            // Remove old cards of the pack
            cards = cards.filter(
                (card: MCCard) => card.pack_code !== action.payload.packCode
            );
            cards = [...cards, ...action.payload.newCards];
            saveCardsToLocalStorage(cards);
            return cards;
        },
        setCards: (cards, action) => {
            cards = action.payload;
            console.log(`setCards`, cards);
            saveCardsToLocalStorage(cards);
            return cards;

        }
    }
});

export default slice.reducer;
export const { cardsAdded, packCardsRemoved, packCardsAdded, setCards } = slice.actions;

