import { MCCard } from "../hooks/useCardsQuery";

const initialState = {
    list: localStorage.getItem('cards') ? JSON.parse(localStorage.getItem('cards') as string) : [],
};

// ActionTypes
const CARDS_ADDED = 'cardsAdded';
const PACK_CARDS_ADDED = 'packCardsAdded';
const SET_CARDS = 'setCards';

// Actions
export const cardsAdded = (newCards: MCCard[]) => ({
    type: CARDS_ADDED,
    payload: {
        newCards: newCards
    }
});

export const packCardsAdded = (packCode: string, newCards: MCCard[]) => ({
    type: PACK_CARDS_ADDED,
    payload: {
        packCode: packCode,
        newCards: newCards
    }
});

export const setCards = (cards: MCCard[]) => ({
    type: SET_CARDS,
    payload: {
        cards: cards
    }
});


// Reducer
export default function reducer(state: any = initialState, action: any) {
    // Reducers have to be "PURE FUNCTIONS"!!!
    switch (action.type) {
        case CARDS_ADDED:
            return {
                ...state,
                list: [...state.list, ...action.payload.newCards]
            };
        case PACK_CARDS_ADDED:
            // Remove old cards of the pack
            const previousCards = state.list.filter(
                (card: MCCard) => card.pack_code !== action.payload.packId
            );
            return {
                ...state,
                list: [...previousCards, ...action.payload.newCards]
            };
        case SET_CARDS:
            return {
                ...state,
                list: action.payload.cards
            };
        default:
            return state;
    }
}