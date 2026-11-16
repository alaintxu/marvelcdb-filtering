import { useState } from "react";
import { MCCard } from "../../store/entities/cards";
import { Card } from '.';
import { useTranslation } from 'react-i18next';
import { Modal } from "../Modal";

type Props = {
  cards: MCCard[],
  showAllCardData?: boolean,
  flipAllCards?: boolean
} & React.HTMLAttributes<HTMLDivElement>;
const CardGrid = ({ cards, showAllCardData = false, flipAllCards = false, className, ...rest }: Props) => {
  const { t } = useTranslation('global');
  const [jsonCard, setJsonCard] = useState<MCCard | null>(null);

  if (!cards) return (<div>{t('no_cards')}</div>);

  return (
    <>
      <div className={`mc-card-grid ${className}`} {...rest}>
        {cards?.map((card: MCCard) =>
          <Card
            showCardData={showAllCardData}
            flipAllCards={flipAllCards}
            card={card}
            onShowJson={setJsonCard}
            key={`card-${card.key || card.code}`} />
        )}
      </div>
      {/* One dialog for the whole grid instead of one per card. */}
      <Modal
        title="JSON"
        isOpen={jsonCard !== null}
        onOpenChange={(isOpen) => { if (!isOpen) setJsonCard(null); }}>
        <pre><code>{JSON.stringify(jsonCard, undefined, 2)}</code></pre>
      </Modal>
    </>
  )
}

export default CardGrid;