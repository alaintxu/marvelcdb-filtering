import { MCCard } from '../../hooks/useCardsQuery';
import { Card } from '.';
import { t } from 'i18next';

type Props = {
  cards: MCCard[],
  showAllCardData?: boolean,
  flipAllCards?: boolean
}
const CardGrid = ({ cards, showAllCardData = false, flipAllCards = false }: Props) => {

  if (!cards) return (<div>{t('no_cards')}</div>);

  return (
    <div className="mc-card-grid">
      {cards?.map((card: MCCard) =>
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