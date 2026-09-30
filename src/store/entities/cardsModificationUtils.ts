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
    const cards3 = normalizeDuplicateOfField(cards2);
    return removeDuplicatedMainSchemes(cards3);
}

/* The API returns duplicated cards as bare entries with a raw "duplicate_of"
   field pointing to the code of the original card
   (e.g. { code: "13015", duplicate_of: "01055" }).
   The app expects that code in "duplicate_of_code". */
export const normalizeDuplicateOfField = (cards: MCCard[]): MCCard[] => {
    return cards.map((card) => {
        const rawDuplicateOf = (card as MCCard & { duplicate_of?: string }).duplicate_of;
        if (rawDuplicateOf === undefined) return card;
        const { duplicate_of, ...cardWithoutRawField } = card as MCCard & { duplicate_of?: string };
        return {
            ...cardWithoutRawField,
            duplicate_of_code: card.duplicate_of_code || duplicate_of
        };
    });
}

/* Fills duplicated cards with the data of the original card they duplicate
   (name, text, image, ...), keeping their own code, pack, position and quantity. */
export const resolveDuplicateCards = (cards: MCCard[]): MCCard[] => {
    const cardsByCode = new Map(cards.map((card) => [card.code, card]));
    return cards.map((card) => {
        if (!card.duplicate_of_code) return card;
        const originalCard = cardsByCode.get(card.duplicate_of_code);
        if (!originalCard) return card;
        return {
            ...originalCard,
            ...card,
            duplicate_of_name: card.duplicate_of_name || originalCard.name
        };
    });
}

/* Removes duplicated cards (re-releases of cards from other packs),
   merging their quantity into the original card. */
export const filterDuplicates = (cards: MCCard[], hideDuplicates: boolean = true): MCCard[] => {
    if (!hideDuplicates) return cards;
    let uniqueCards: MCCard[] = [];
    cards.forEach((card) => {
        const existingCard = uniqueCards.find((uniqueCard) => {
            if (uniqueCard.code === card.code) return true;
            if (uniqueCard.duplicate_of_code && uniqueCard.duplicate_of_code === card.code) return true;
            if (card.duplicate_of_code && uniqueCard.code === card.duplicate_of_code) return true;
            if (card.duplicate_of_code && uniqueCard.duplicate_of_code && uniqueCard.duplicate_of_code === card.duplicate_of_code) return true;
            return false;
        });

        const newQuantity = existingCard ? (card.quantity || 1) + (existingCard.quantity || 1) : card.quantity || 1;

        if (!existingCard) {
            uniqueCards.push({
                ...card,
                quantity: newQuantity
            });
        } else {
            if (card.code === existingCard.duplicate_of_code) {
                uniqueCards = uniqueCards.filter((uniqueCard) => uniqueCard.code !== existingCard.code);
                uniqueCards.push({
                    ...card,
                    quantity: newQuantity
                });
            }
            // update quantity
            existingCard.quantity = newQuantity;
        }
    });
    return uniqueCards;
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