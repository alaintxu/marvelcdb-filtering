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

const getTypeWeight = (type: string) => {
  switch (type) {
    case "ally":  // aliado
      return 5;
    case "event":  // evento
      return 4;
    case "player_side_scheme":  // plan secundario de jugador
      return 4;
    case "resource":
      return 3;
    case "support": // apoyo
      return 2;
    case "upgrade":  // mejora
      return 1;
    default:
      return 0;
  }
}

const getSortedTypes = (deckCards: {[typeCode:string]: MCCard[]}): string[] => {
  return Object.keys(deckCards).sort((a, b) => {
    return getTypeWeight(b) - getTypeWeight(a);
  });
}

const DeckView = ({ deck }: Props) => {
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
          if (!cardsTmp[card.type_code]) cardsTmp[card.type_code] = [];
          cardsTmp[card.type_code].push({ key: `${card.code}-${i}`,...card });
        } else {
          if (!notFoundCardCodesTmp.includes(cardCode))
            notFoundCardCodesTmp.push(cardCode);
        }
      }
    });
    setNotFoundCardCodes(notFoundCardCodesTmp);

    // Sort cards
    const orderedCardsTmp: {[typeCode: string]: MCCard[]} = {};
    Object.keys(cardsTmp).forEach((typeCode) => {
      orderedCardsTmp[typeCode] = [...cardsTmp[typeCode]].sort((a, b) => {
        const aFactionCodeWeight = getFactionCodeWeight(a.faction_code);
        const bFactionCodeWeight = getFactionCodeWeight(b.faction_code);
        return bFactionCodeWeight - aFactionCodeWeight;
      });
    });
    // Set cards
    setDeckCards(orderedCardsTmp);
  }, [deck]);
  
  return (
    <section id="deck-view" className='p-3'>
      <DeckDataCard deck={deck} />
      {/* @ToDo: separate in modules */}
      {/* Not found cards */}
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

      {/* Index */}
      <section id="card-index" className="row mt-4">
        <div className="list-group col-12 col-sm-8 col-md-6 col-lg-4 m-auto">
        {getSortedTypes(deckCards).map((typeCode) => (
            <a  href={`#cards-${typeCode.replace(/ /g, "-")}`} 
                className="list-group-item list-group-item-dark list-group-item-action d-flex justify-content-between align-items-center"
                key={typeCode}>
              {deckCards[typeCode][0].type_name}
              <span className="ms-2 badge bg-primary rounded-pill">{deckCards[typeCode].length}</span>
            </a>
        ))}
        </div>
      </section>
      {/* Card grids by type */}
      {getSortedTypes(deckCards).map((typeCode) => (
        <section key={typeCode} className="mt-4" id={`cards-${typeCode.replace(/ /g, "-")}`}>
          <h2 className="text-center m-4">
            {deckCards[typeCode][0].type_name}
            <span className="badge bg-info ms-2">{deckCards[typeCode].length}</span>
          </h2>
          <CardGrid cards={deckCards[typeCode]} />
        </section>
      ))}
    </section>
  )
}

export default DeckView