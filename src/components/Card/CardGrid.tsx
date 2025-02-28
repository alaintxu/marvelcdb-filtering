import { MCCard } from "../../store/entities/cards";
import { Card } from '.';
import { t } from 'i18next';

type Props = {
  cards: MCCard[],
  showAllCardData?: boolean,
  flipAllCards?: boolean
} & React.HTMLAttributes<HTMLDivElement>;
const CardGrid = ({ cards, showAllCardData = false, flipAllCards = false, className, ...rest }: Props) => {
  if (!cards) return (<div>{t('no_cards')}</div>);

  return (
    <div className={`mc-card-grid ${className}`} {...rest}>
      {cards?.map((card: MCCard) =>
        <Card
          showCardData={showAllCardData}
          flipAllCards={flipAllCards}
          card={card}
          key={`card-${card.key || card.code}`} />
      )}
    </div>
  )
}

export default CardGrid;