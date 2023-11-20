import { MCCard } from '../hooks/useCards';
import { Card } from './Card';


type Props = {
  cards: MCCard[],
  showAllCardData?: boolean,
  flipAllCards?: boolean
}
const CardGrid = ({ cards, showAllCardData = false, flipAllCards = false }: Props) => {

  return (
      <div className="card-grid">
        {cards.map((card: MCCard) => 
          <Card
            showCardData={showAllCardData}
            flipAllCards={flipAllCards}
            card={card}
            key={`card-${card.code}`} />
        )}
      </div>
  )
}

export default CardGrid;