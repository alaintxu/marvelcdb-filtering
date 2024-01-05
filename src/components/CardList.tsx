import { useState } from "react";
import { MCCard } from "../hooks/useCards";
import CardGrid from "./CardGrid";
import { BsFillEyeFill, BsFillEyeSlashFill, BsPhoneFlip } from 'react-icons/bs';
import { useTranslation } from "react-i18next";

type Props = {
  cards: MCCard[]
}


const CardList = ({ cards }: Props) => {
  const { t } = useTranslation('global');

  // Status
  const [showAllCardData, setShowAllCardData] = useState(false);
  const [flipAllCards, setFlipAllCards] = useState(false);

  return (

    <section id="mc-card-list" className='p-3'>
      <span id="mc-card-list-actions">
        <button
          className={`btn btn-${showAllCardData ? 'primary' : 'secondary'}`}
          onClick={() => setShowAllCardData((prev) => !prev)}>
          {showAllCardData ? <>
            <BsFillEyeSlashFill title="Esconder datos" />
          </> : <>
            <BsFillEyeFill title="Mostrar datos" />
          </>}
        </button>
        <button
          className={`btn btn-${flipAllCards ? 'primary' : 'secondary'}`}
          onClick={() => setFlipAllCards((prev) => !prev)}>
          <BsPhoneFlip />
        </button>
      </span>
      <h1>
        {t('card_list')}
      </h1>
      <CardGrid cards={cards} showAllCardData={showAllCardData} flipAllCards={flipAllCards} />
    </section>
  )
}

export default CardList