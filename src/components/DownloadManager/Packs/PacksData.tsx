import { selectNumberOfCards } from '../../../store/entities/cards';
import { selectNumberOfPacks, selectPackStatusTone } from '../../../store/entities/packs';
import { useTranslation } from 'react-i18next';
import IconForConcept from '../../IconForConcept';
import { useAppSelector } from '../../../hooks/useStore';
import { selectNumberOfSelectedPacks } from '../../../store/ui/selectedPacks';
import * as stylex from '@stylexjs/stylex';
import { badgeTone, ui } from '../../../styles/ui';

const PacksData = () => {
    const {t} = useTranslation("global");
  const numberOfSelectedPacks = useAppSelector(selectNumberOfSelectedPacks);
    const numberOfPacks = useAppSelector(selectNumberOfPacks)
    const numberOfCards = useAppSelector(selectNumberOfCards);
    const packStatusVariant = useAppSelector(selectPackStatusTone)
  return (
    <div id="pack-data"
          {...stylex.props(ui.flex, ui.flexColumn, ui.itemsCenter, ui.justifyCenter, ui.gap1, ui.mb4)}
        >
          <span {...stylex.props(ui.flex, ui.itemsCenter, ui.gap2)}>
            <IconForConcept concept="packFill"/>
            <b>{t('downloaded_packs')}</b>
            <span {...stylex.props(ui.badge, badgeTone[packStatusVariant])}>{numberOfSelectedPacks}</span>
            /
            <span {...stylex.props(ui.badge, ui.badgeLight)}>{numberOfPacks}</span>
          </span>
          <span {...stylex.props(ui.flex, ui.itemsCenter, ui.gap2)}>
            <IconForConcept concept="cardFill"/>
            <b>{t('downloaded_cards')}</b>
            <span {...stylex.props(ui.badge, ui.badgeInfo)}>{numberOfCards}</span>
          </span>
        </div>
  )
}

export default PacksData