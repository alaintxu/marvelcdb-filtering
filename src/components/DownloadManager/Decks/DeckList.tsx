import { useTranslation } from "react-i18next";
import * as stylex from '@stylexjs/stylex';

import { selectAllDecks } from "../../../store/entities/decks";
import DeckListItem from "./DeckListItem";
import IconForConcept from "../../IconForConcept";
import { selectShowDeckList, showDeckListToggled } from '../../../store/ui/other';
import { useAppDispatch, useAppSelector } from "../../../hooks/useStore";
import { ui } from "../../../styles/ui";


const DeckList = () => {
    const { t } = useTranslation('decks');
    const { t: globalT } = useTranslation('global');
    const dispatch = useAppDispatch();
    const decks = useAppSelector(selectAllDecks);
    const showDeckList = useAppSelector(selectShowDeckList);
  return (
    <section {...stylex.props(ui.mt4)}>
        <div id="deckListAccordion" {...stylex.props(ui.px3, ui.mb3)}>
          <button
            type='button'
            {...stylex.props(ui.button, ui.buttonSecondary)}
            onClick={() => dispatch(showDeckListToggled())}>
            {showDeckList ? <IconForConcept concept="collapse" /> : <IconForConcept concept="expand" />}
            &nbsp;
            {t("deck_list")}
            <span {...stylex.props(ui.badge, ui.badgeLight, ui.ms2, ui.inlineFlex, ui.itemsCenter)}>
                {Object.keys(decks).length}

                <IconForConcept concept="bookmark" xstyle={ui.ms1} />
            </span>
          </button>

          {showDeckList && (
            <div {...stylex.props(ui.flex, ui.flexColumn, ui.justifyCenter)}>
                <div {...stylex.props(ui.buttonGroupVertical, ui.mt3)} role="group" aria-label={globalT('bookmarked_decks')}>
                    {Object.entries(decks).sort((a, b) =>
                    // sort by aspect, then by hero name
                    a[1]?.aspect?.localeCompare(b[1]?.aspect || "") || a[1]?.hero_name?.localeCompare(b[1]?.hero_name)
                    ).map(([deckCode, deck]) => (
                        <DeckListItem key={deckCode} deck={deck} />
                    ))}
                </div>
            </div>
        )}
        </div>
    </section>
  );
}

export default DeckList
