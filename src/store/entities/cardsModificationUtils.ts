import { MCCard } from "./cards";

export const sortCards = (cards: MCCard[], fieldName: keyof MCCard="code"): MCCard[] => {
    return cards.sort((a, b) => {
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
    });
}

export const cleanCards = (cards: MCCard[]): MCCard[] => {
    // Update Quicksilver card
    const cards2 = cards.map(updateQuicksilverCard);
    return removeDuplicatedMainSchemes(cards2);
}

const removeDuplicatedMainSchemes = (cards: MCCard[]):MCCard[] => {
    let cleanCards: MCCard[] = [];
    for (const card of cards) {
        if (card.type_code !== "main_scheme") {
            cleanCards.push(card);
        } else {
            if (card.linked_card) {
                cleanCards.push(card);
            }
        }
    }
    return cleanCards;
}

const updateQuicksilverCard = (card: MCCard): MCCard => {
    if (card.code === "14001a") {
        const newCard: MCCard = JSON.parse(JSON.stringify(card));
        if (newCard.linked_card)
            newCard.linked_card.imagesrc = "/bundles/cards/14001b.png";
        return newCard;
    }
    return card;
}