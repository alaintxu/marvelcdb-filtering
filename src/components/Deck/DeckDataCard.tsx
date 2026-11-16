import { removeCurrentDeck, MarvelDeck } from "../../store/entities/decks"
import { useTranslation } from 'react-i18next'
import { Markdown } from '@astryxdesign/core/Markdown'
import { selectCardByCode } from "../../store/entities/cards"
import * as stylex from '@stylexjs/stylex'
import CardGrid from "../Card/CardGrid"

import DeckBookmarkAction from "./DeckBookmarkAction"
import IconForConcept from "../IconForConcept"
import { useAppDispatch, useAppSelector } from "../../hooks/useStore"
import { ui } from "../../styles/ui"
import { aspectStyle } from "../../styles/aspects"

type Props = {
  deck: MarvelDeck,
}

const DeckDataCard = ({ deck }: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('global');
  const heroCard = useAppSelector(selectCardByCode(deck.hero_code));
  const numberOfCards = Object.values(deck.slots).reduce((acc, val) => acc + val, 0);
  return (
    <div {...stylex.props(ui.card)}>
      <div {...stylex.props(ui.cardHeader, aspectStyle(deck.aspect))}>
        <h1 {...stylex.props(ui.flex, ui.itemsCenter, ui.gap2, ui.m0)}>
          {deck.hero_name}
          <DeckBookmarkAction deck={deck} />
        </h1>
        <button type="button" {...stylex.props(ui.button, ui.buttonOutlineLight)} onClick={() => dispatch(removeCurrentDeck())}>
          <IconForConcept concept='close' />
        </button>
      </div>
      <div {...stylex.props(ui.cardBody, ui.bgSecondary, ui.textDark)}>
        <h2 {...stylex.props(ui.cardTitle)}>
          <a {...stylex.props(ui.textDark)} href={`${t('base_path')}/decklist/view/${deck.id}`} target="_blank" rel="noreferrer">
            {deck.name}
          </a>
        </h2>

        <div id="deck-tags" {...stylex.props(ui.flex, ui.flexWrap, ui.itemsCenter, ui.gap2)}>
          {deck.aspect && <span {...stylex.props(ui.badge, aspectStyle(deck.aspect))}>
            <IconForConcept concept="category" /> {t(`aspect.${deck.aspect}`)}
          </span>}
          {deck.tags && deck.tags.map((tag) => (
            <span key={tag} {...stylex.props(ui.badge, ui.badgeDark)}>
              <IconForConcept concept="tag" /> {t(`tag.${tag}`)}
            </span>
          ))}
          <span {...stylex.props(ui.badge, ui.badgeLight)} title={t('deck-id')}>
            <a {...stylex.props(ui.textDark)} href={`${t('base_path')}/decklist/view/${deck.id}`} target="_blank" rel="noreferrer">
              <IconForConcept concept="multiple_cards" /> {deck.id}
            </a>
          </span>
          <span {...stylex.props(ui.badge, ui.badgeLight)} title={t('number_of_cards')}>
            <IconForConcept concept="multiple_cards" /> {numberOfCards}
          </span>
        </div>

        <div {...stylex.props(ui.deckDetailsGrid)}>
          <div>
            {heroCard && <CardGrid cards={[heroCard]} />}
          </div>

          <div>
            <details className="mc-details mc-details--button">
              <summary {...stylex.props(ui.button, ui.buttonDark)}>
                <IconForConcept concept="chevronDown" /> {t('description')}
              </summary>
              <div {...stylex.props(ui.border, ui.rounded, ui.p2, ui.my2)}>
                <Markdown contentWidth="100%">
                  {deck.description_md}
                </Markdown>
              </div>
            </details>
          </div>

          <div>
            <details className="mc-details mc-details--button">
              <summary {...stylex.props(ui.button, ui.buttonDark)}>
                <IconForConcept concept="chevronDown" /> <IconForConcept concept='jsonFile' />
              </summary>
              <div {...stylex.props(ui.border, ui.rounded, ui.p2, ui.my2)}>
                <pre>
                  {JSON.stringify(deck, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeckDataCard
