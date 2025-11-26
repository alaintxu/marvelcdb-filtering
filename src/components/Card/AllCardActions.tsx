

import { flipAllCardsToggled, selectFlipAllCards, selectShowAllCardData, showAllCardDataToggled } from "../../store/ui/other";
import IconForConcept from "../IconForConcept";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";

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
    <span className="d-flex gap-2">
      <button
        className={`btn btn-${showAllCardData ? 'primary' : 'secondary'}`}
        onMouseEnter={() => setIsShowHovering(true)}
        onMouseLeave={() => setIsShowHovering(false)}
        onClick={() => dispatch(showAllCardDataToggled())}>
        {showIcon}
      </button>
      <button
        className={`btn btn-${flipAllCards ? 'primary' : 'secondary'}`}
        onMouseEnter={() => setIsFlipHovering(true)}
        onMouseLeave={() => setIsFlipHovering(false)}
        onClick={() => dispatch(flipAllCardsToggled())}>
        {flipIcon}
      </button>
    </span>
  )
}

export default AllCardActions