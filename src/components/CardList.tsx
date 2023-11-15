import { Card, MCCard } from './Card';


type Props = {
  cards: MCCard[],
  showAllCardData: boolean
}
const CardList = ({ cards, showAllCardData }: Props) => {

  return (
      <div className="card-grid">
        {cards.map((card: MCCard) => <Card showCardData={showAllCardData} card={card} key={card.code} />)}
      </div>
  )
}

export default CardList