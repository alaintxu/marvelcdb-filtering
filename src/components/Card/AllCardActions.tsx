

import { flipAllCardsToggled, selectFlipAllCards, selectShowAllCardData, showAllCardDataToggled } from "../../store/ui/other";
import IconForConcept from "../IconForConcept";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import * as stylex from '@stylexjs/stylex';
import { ui } from "../../styles/ui";

const AllCardActions = () => {
  const { t } = useTranslation('global');
  const dispatch = useAppDispatch();
  const showAllCardData = useAppSelector(selectShowAllCardData);
  const flipAllCards = useAppSelector(selectFlipAllCards);
  const [isShowHovering, setIsShowHovering] = useState<boolean>(false);
  const [isFlipHovering, setIsFlipHovering] = useState<boolean>(false);

  let showIcon;
  if (!isShowHovering) {
    showIcon = showAllCardData ? <IconForConcept concept="showFill" title={t('show_data')} /> : <IconForConcept concept="hideFill" title={t('hide_data')} />;
  } else {
    showIcon = showAllCardData ? <IconForConcept concept="hide" title={t('hide_data')} /> : <IconForConcept concept="show" title={t('show_data')} />;
  }

  let flipIcon;
  if (!isFlipHovering) {
    flipIcon = flipAllCards ? <IconForConcept concept="cardFront" title={t('hide_data')} /> : <IconForConcept concept="cardBack" title={t('show_data')} />;
  } else {
    flipIcon = <IconForConcept concept="cardFlip" title={t('show_data')} />;
  }



  return (
    <span {...stylex.props(ui.flex, ui.gap2)}>
      <button
        {...stylex.props(ui.button, showAllCardData ? ui.buttonBrand : ui.buttonSecondary)}
        onMouseEnter={() => setIsShowHovering(true)}
        onMouseLeave={() => setIsShowHovering(false)}
        onClick={() => dispatch(showAllCardDataToggled())}>
        {showIcon}
      </button>
      <button
        {...stylex.props(ui.button, flipAllCards ? ui.buttonBrand : ui.buttonSecondary)}
        onMouseEnter={() => setIsFlipHovering(true)}
        onMouseLeave={() => setIsFlipHovering(false)}
        onClick={() => dispatch(flipAllCardsToggled())}>
        {flipIcon}
      </button>
    </span>
  )
}

export default AllCardActions