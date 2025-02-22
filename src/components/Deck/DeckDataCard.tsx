import { deckCurrentRemoved, MarvelDeck } from "../../store/entities/decks"
import { FaTag, FaChevronDown } from 'react-icons/fa6'
import { MdCategory } from 'react-icons/md'
import { TbCards } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import { selectCardByCode } from "../../store/entities/cards"
import { useDispatch, useSelector } from "react-redux"
import CardGrid from "../Card/CardGrid"
import { useMemo } from "react"
import DeckBookmarkAction from "./DeckBookmarkAction"
import { aspectColorMap } from "../DownloadManager/Decks/DeckListItem"
import IconForConcept from "../IconForConcept"

type Props = {
    deck: MarvelDeck,
}

const DeckDataCard = ({deck}: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('global');
  const aspectColor = deck.aspect ? aspectColorMap[deck.aspect] : 'dark';
  const heroCard = useSelector(selectCardByCode(deck.hero_code));
  const numberOfCards = useMemo(() => Object.values(deck.slots).reduce((acc, val) => acc + val, 0), [deck.slots]);
  return (
    <div className="card text-light">
        <div className={`card-header bg-${aspectColor} d-flex justify-content-between align-items-center gap-2`}>
          <h1 className='d-flex align-items-center gap-2'>
            {deck.hero_name}
            <DeckBookmarkAction deck={deck} />        
          </h1>
          <button type="button" className="btn btn-outline-light" onClick={() => dispatch(deckCurrentRemoved())}>
          <IconForConcept concept='close' />
          </button>
        </div>
        <div className='card-body bg-secondary'>
          <h2 className="mb-4 card-title">
            <a className="text-dark" href={`${t('base_path')}/decklist/view/${deck.id}`} target="_blank" rel="noreferrer">
              {deck.name} 
            </a>
          </h2>

          <div id="deck-tags" className="d-flex flex-wrap align-items-center gap-2">
            {deck.aspect && <span className={`badge bg-${aspectColor}`}>
              <MdCategory/> {t(`aspect.${deck.aspect}`)}
            </span>}
            {deck.tags && deck.tags.map((tag) => (
              <span key={tag} className='badge bg-dark'>
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
            <span className='badge bg-light text-dark' title={t('number_of_cards')}>
              <TbCards /> {numberOfCards}
            </span>
          </div>

          <div className="row mt-4">
            <div className="col-12 col-md-6 mb-4">
              {heroCard && <CardGrid cards={[heroCard]} />}
            </div>

            <div className="col-12 col-md-6">
              <button className="btn btn-dark" data-bs-toggle="collapse" data-bs-target="#deck-description" aria-expanded="false" aria-controls="deck-description">
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
            
            <div className="col-12 col-md-6">
              <button className="btn btn-dark" data-bs-toggle="collapse" data-bs-target="#deck-json" aria-expanded="false" aria-controls="deck-json">
                <FaChevronDown /> <IconForConcept concept='jsonFile' />
              </button>
              <div className="collapse" id="deck-json">
                <div className="border border-light rounded p-2 my-2">
                  <pre>
                    {JSON.stringify(deck, null, 2)}
                  </pre>
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