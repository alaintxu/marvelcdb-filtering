import { MarvelDeck } from "../../store/entities/decks"
import DeckDataCard from "./DeckDataCard"
import { useEffect, useState } from "react"
import { MCCard, selectCardsByCodes } from "../../store/entities/cards"
import CardGrid from "../Card/CardGrid"
import { useSelector } from "react-redux"
import { t } from "i18next"



type Props = {
    deck: MarvelDeck
}

function getFactionCodeWeight(factionCode: string): number {
  switch (factionCode) {
    case "hero":
      return 2;
    case "basic":
      return 0;
    default:
      return 1;
  }
}

const DeckView = ({ deck }: Props) => {
  console.log("deck", deck);
  const deckCardsUnique: MCCard[] = useSelector(selectCardsByCodes(Object.keys(deck.slots)));
  const [deckCards, setDeckCards] = useState<{[typeCode: string]: MCCard[]}>({});
  const [notFoundCardCodes, setNotFoundCardCodes] = useState<string[]>([]);

  useEffect(() => {
    console.log("Filter deck cards", Object.keys(deck.slots), deckCardsUnique)
    const cardsTmp: {[typeCode: string]: MCCard[]} = {};
    const notFoundCardCodesTmp: string[] = [];

    // Get cards
    Object.keys(deck.slots).forEach((cardCode) => {
      for (let i = 0; i < deck.slots[cardCode]; i++) {
        const card = deckCardsUnique.find((card: MCCard) => card.code === cardCode);
        if (card) {
          if (!cardsTmp[card.type_name]) cardsTmp[card.type_name] = [];
          cardsTmp[card.type_name].push({ key: `${card.code}-${i}`,...card });
        } else {
          if (!notFoundCardCodesTmp.includes(cardCode))
            notFoundCardCodesTmp.push(cardCode);
        }
      }
    });
    setNotFoundCardCodes(notFoundCardCodesTmp);

    // Sort cards
    const orderedCardsTmp: {[typeCode: string]: MCCard[]} = {};
    Object.keys(cardsTmp).forEach((typeName) => {
      orderedCardsTmp[typeName] = [...cardsTmp[typeName]].sort((a, b) => {
        const aFactionCodeWeight = getFactionCodeWeight(a.faction_code);
        const bFactionCodeWeight = getFactionCodeWeight(b.faction_code);
        return bFactionCodeWeight - aFactionCodeWeight;
      });
    });
    // Set cards
    setDeckCards(orderedCardsTmp);
  }, [deck]);

  // ToDo: Guardar como favorito
  
  return (
    <section id="deck-view" className='p-3'>
      <DeckDataCard deck={deck} />
      {/* @ToDo: separate in modules */}
      {notFoundCardCodes.length > 0 && <div className="alert alert-warning">
        <p>{t('deck_cards_not_found')} <span className="badge bg-danger text-light">{notFoundCardCodes.length}</span></p>

        <div className="d-flex flex-wrap align-items-center gap-1 mt-4">
            {notFoundCardCodes.map((cardCode) => (
              <a  className="badge bg-light text-dark" 
                  key={cardCode} 
                  href={`${t('base_path')}/card/${cardCode}`} 
                  target="_blank" rel="noreferrer">
                {cardCode}
              </a>
            ))}
          </div>
      </div>}
      <section id="card-index" className="row mt-4">
        <div className="list-group col-12 col-sm-8 col-md-6 col-lg-4 m-auto">
        {Object.keys(deckCards).map((typeName) => (
            <a  href={`#cards-${typeName.replace(/ /g, "-")}`} 
                className="list-group-item list-group-item-dark list-group-item-action d-flex justify-content-between align-items-center"
                key={typeName}>
              {typeName}
              <span className="ms-2 badge bg-primary rounded-pill">{deckCards[typeName].length}</span>
            </a>
        ))}
        </div>
      </section>
      {Object.keys(deckCards).map((typeName) => (
        <section key={typeName} className="mt-4" id={`cards-${typeName.replace(/ /g, "-")}`}>
          <h2 className="text-center m-4">
            {typeName}
            <span className="badge bg-info ms-2">{deckCards[typeName].length}</span>
          </h2>
          <CardGrid cards={deckCards[typeName]} />
        </section>
      ))}
    </section>
  )
}

export default DeckView