import { MCCard } from "./cards";


const cleanCards = (cards: MCCard[]): MCCard[] => {
    console.log("Cleaning cards");
    // Update Quicksilver card
    const cards2 = cards.map((card) => {
        if (card.code === "14001a") {
            console.log("Updating Quicksilver card");
            const newCard: MCCard = JSON.parse(JSON.stringify(card));
            if (newCard.linked_card)
                newCard.linked_card.imagesrc = "/bundles/cards/14001b.png";
            return newCard;
        }
        return card;
    });
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

export default cleanCards;