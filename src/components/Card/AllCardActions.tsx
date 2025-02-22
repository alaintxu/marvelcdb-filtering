
import { useDispatch, useSelector } from "react-redux";
import { flipAllCardsToggled, selectFlipAllCards, selectShowAllCardData, showAllCardDataToggled } from "../../store/ui/other";
import IconForConcept from "../IconForConcept";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";

const AllCardActions = () => {
  const { t } = useTranslation('global');
  const dispatch = useDispatch();
  const showAllCardData = useSelector(selectShowAllCardData);
  const flipAllCards = useSelector(selectFlipAllCards);
  const [isShowHovering, setIsShowHovering] = useState<boolean>(false);
  const [isFlipHovering, setIsFlipHovering] = useState<boolean>(false);

  const showIcon = useMemo(() => {
    if (!isShowHovering) {
      return showAllCardData ? <IconForConcept concept="showFill" title={t('show_data')} /> : <IconForConcept concept="hideFill" title={t('hide_data')} />;
    } else {
      return showAllCardData ? <IconForConcept concept="hide" title={t('hide_data')} /> : <IconForConcept concept="show" title={t('show_data')} />;
    }
  }, [isShowHovering, showAllCardData]);

  const flipIcon = useMemo(() => {
    if (!isFlipHovering) {
      return flipAllCards ? <IconForConcept concept="cardFront" title={t('hide_data')} /> : <IconForConcept concept="cardBack" title={t('show_data')} />;
    } else {
      return <IconForConcept concept="cardFlip" title={t('show_data')} />;
    }
  }, [isFlipHovering, flipAllCards]);


  
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