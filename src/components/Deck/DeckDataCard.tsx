import { MarvelDeck } from "../../store/entities/decks"
import { FaTag, FaChevronDown } from 'react-icons/fa6'
import { MdCategory } from 'react-icons/md'
import { TbCards } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import { selectCardByCode } from "../../store/entities/cards"
import { useSelector } from "react-redux"
import CardGrid from "../Card/CardGrid"

type Props = {
    deck: MarvelDeck
}

const aspectColorMap: { [key: string]: string } = {
    "aggression": "danger",
    "justice": "warning",
    "leadership": "info",
    "protection": "success",
}

const DeckDataCard = ({deck}: Props) => {
  const { t } = useTranslation('global');
  const aspectColor = deck.aspect ? aspectColorMap[deck.aspect] : 'dark';
  const heroCard = useSelector(selectCardByCode(deck.hero_code));
  return (
    <div className="card bg-dark text-light">
        <div className='card-body'>
          <h1 className='card-title'>
            {deck.hero_name}
          </h1>
          <h2 className="mb-4">
            <a href={`${t('base_path')}/decklist/view/${deck.id}`} target="_blank" rel="noreferrer">
              {deck.name} 
            </a>
          </h2>

          <div id="deck-tags">
            {deck.aspect && <span className={`badge bg-${aspectColor} me-1`}>
              <MdCategory/> {t(`aspect.${deck.aspect}`)}
            </span>}
            {deck.tags && deck.tags.map((tag) => (
              <span key={tag} className='badge bg-secondary me-1'>
                <FaTag /> {t(`tag.${tag}`)}
              </span>
            ))}
            {/*<span className='badge bg-light text-dark me-1' title={t('user-id')}>
              <FaUser /> {deck.user_id}
            </span>*/}
            <span className='badge bg-light text-dark' title={t('deck-id')}>
              <a href={`${t('base_path')}/decklist/view/${deck.id}`} target="_blank" rel="noreferrer">
                <TbCards /> {deck.id}
              </a>
            </span>
          </div>

          <div className="row mt-4">
            <div className="col-12 col-md-6 mb-4">
              {heroCard && <CardGrid cards={[heroCard]} />}
            </div>
            <div className="col-12 col-md-6">
              <button className="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#deck-description" aria-expanded="false" aria-controls="deck-description">
                <FaChevronDown /> {t('description')}
              </button>
              <div className="collapse" id="deck-description">
                <div className="border border-light rounded p-2 my-2">
                  <Markdown>
                    {deck.description_md}
                  </Markdown>
                </div>
              </div>
            </div>
          </div>
          {/*<div className="d-flex flex-wrap align-items-center gap-1 mt-4">
            {Object.entries(deck.slots).map(([cardId, quantity]) => (
              <a className="badge bg-light text-dark" key={cardId} href={`${t('base_path')}/card/${cardId}`} target="_blank" rel="noreferrer">
                {cardId} {quantity > 1 &&<span className='ms-1 badge bg-dark text-light'>x{quantity}</span>}
              </a>
            ))}
          </div>*/}
        </div>
      </div>
  )
}

export default DeckDataCard