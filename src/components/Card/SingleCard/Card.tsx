import { useCallback, useEffect, useState } from "react";
import CardImage, { getCardImage, ImageFace, ImageLoadState } from "./CardImage"
import { Modal } from "../../Modal"
import SanitizedHtml from "../../SanitizedHtml/SanitizedHtml";
import { MCCard } from "../../../store/entities/cards";
import { useTranslation } from "react-i18next";

import { cardCodeClicked, selectIsCardCodeClicked } from "../../../store/ui/other";
import CardTop from "./CardTop";
import { useAppDispatch, useAppSelector } from "../../../hooks/useStore";
import IconForConcept from "../../IconForConcept";
import * as stylex from '@stylexjs/stylex';
import { ui } from "../../../styles/ui";
import { cx } from "../../../styles/cx";

export type MCCardKeys = keyof MCCard;

type Props = {
  card: MCCard,
  showCardData?: boolean,
  flipAllCards?: boolean,
  // When the parent renders a shared dialog, it takes over the JSON view.
  onShowJson?: (card: MCCard) => void,
}

export const hasClassInAncestors = (element: HTMLElement | null, classToSearch: string = "mc-card"): boolean => {
  if (!element) {
    // Guard clause
    return false;
  }

  if (element.classList && element.classList.contains(classToSearch)) {
    // class found
    return true;
  }

  // Recursion (class not found, ask the parents)
  return hasClassInAncestors(element.parentNode as HTMLElement, classToSearch);
};


const calculateFlipped = (manualFlipped: boolean | undefined, flipAllCards: boolean, isMainScheme: boolean) => {
  const isFlipped = manualFlipped === undefined ? flipAllCards : manualFlipped
  return isMainScheme ? !isFlipped : isFlipped;
}

const isCardHorizontal = (card: MCCard, flipped: boolean) => {
  const horizontal_types = ["main_scheme", "side_scheme", "player_side_scheme"];
  const front_horizontal = horizontal_types.includes(card.type_code);
  let back_horizontal = front_horizontal;

  if (card.linked_card) {
    back_horizontal = card.linked_card && horizontal_types.includes(card.linked_card.type_code);
  }

  return flipped ? back_horizontal : front_horizontal;
}


const Card = ({ card, showCardData = false, flipAllCards = false, onShowJson }: Props) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation('global');
  const isClicked = useAppSelector(selectIsCardCodeClicked(card.code));
  const [manualFlipped, setManualFlipped] = useState<boolean | undefined>(undefined);
  const [imageStates, setImageStates] = useState<Record<ImageFace, ImageLoadState>>({
    front: "loading",
    back: "loading"
  });
  const [imageRetryTokens, setImageRetryTokens] = useState<Record<ImageFace, number>>({
    front: 0,
    back: 0
  });
  const isMainScheme = card.type_code === "main_scheme";

  const flipped = calculateFlipped(manualFlipped, flipAllCards, isMainScheme);
  const isHorizontal = isCardHorizontal(card, manualFlipped || flipAllCards);
  const visibleImageFace: ImageFace = flipped ? "back" : "front";
  const isVisibleImageLoading = imageStates[visibleImageFace] === "loading";

  const handleImageStateChange = useCallback((face: ImageFace, newState: ImageLoadState) => {
    setImageStates((prev) => prev[face] === newState ? prev : { ...prev, [face]: newState });
  }, []);

  const handleImageRetry = () => {
    const face = visibleImageFace;
    setImageStates((prev) => ({ ...prev, [face]: "loading" }));
    setImageRetryTokens((prev) => ({ ...prev, [face]: prev[face] + 1 }));
  };

  useEffect(() => {
    setManualFlipped(undefined);
  }, [flipAllCards]);

  /* While the visible image is loading (or failed to load) the card data is shown */
  const isImageLoading = flipped
    ? imageStates.back !== "loaded"
    : imageStates.front !== "loaded";

  const classNames = [
    "mc-card",
    `mc-card-${card.code}`,
    flipped ? "mc-card--flipped" : "",
    isHorizontal ? "mc-card--horizontal" : "",
    showCardData ? "mc-card--show-data" : "",
    isClicked ? "mc-card--clicked" : "",
    isImageLoading ? "mc-card--loading" : "",
  ]
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  return (
    <>
      <div
        className={classNames.join(" ")}
        title={`${card.name
          }${card.subname ? ` - ${card.subname}` : ""
          }${card.linked_card?.name ? ` - ${card.linked_card.name}` : ""
          }${card.linked_card?.subname ? ` - ${card.linked_card.subname}` : ""
          }`}
        key={`mc-card-div-${card.code}`}
        onClick={() => dispatch(cardCodeClicked(card.code))/*setIsClicked((prev) => !prev)*/}
      >
        <CardImage
          card={card}
          horizontal={isHorizontal}
          retryTokens={imageRetryTokens}
          onImageStateChange={handleImageStateChange}
        />
        <div className="mc-card__content">
          <header>
            <CardTop card={!flipped ? card : card.linked_card} />
            <span className={cx("mc-card__actions", stylex.props(ui.flex, ui.justifyEnd, ui.gap1).className)} style={stylex.props(ui.flex, ui.justifyEnd, ui.gap1).style}>
              <a {...stylex.props(ui.button, ui.buttonSecondary, ui.shadowed)}
                href={getCardImage(card, flipped, i18n.language)}
                target="_blank"
                rel="noopener noreferrer"
                title={t('card.open_image', { name: card.name })}>
                <IconForConcept concept="image" />
              </a>
              <button
                {...stylex.props(ui.button, ui.buttonSecondary, ui.shadowed)}
                type="button"
                disabled={isVisibleImageLoading}
                onClick={handleImageRetry}
                title={isVisibleImageLoading ? t('card.image_loading') : t('card.image_reload')}
                aria-label={isVisibleImageLoading ? t('card.image_loading') : t('card.image_reload')}>
                <IconForConcept concept={isVisibleImageLoading ? "hourglass" : "reset"} />
              </button>
              <button
                {...stylex.props(ui.button, ui.buttonSecondary, ui.shadowed)}
                title={t('card.show_json')}
                type="button"
                onClick={() => onShowJson ? onShowJson(card) : setIsJsonModalOpen(true)}>
                <IconForConcept concept="jsonFile" />
              </button>
              <button
                {...stylex.props(ui.button, flipped ? ui.buttonDark : ui.buttonLight, ui.shadowed)}
                onClick={() => setManualFlipped((prev) => prev === undefined ? !flipAllCards : !prev)}
                title={t('card.flip')}>
                <IconForConcept concept="cardFlip" />
              </button>
            </span>
          </header>
          <main {...stylex.props(ui.flex, ui.flexColumn, ui.gap1, ui.itemsCenter)}>
            {!flipped ? <>

              {card.traits && <span {...stylex.props(ui.flex, ui.gap1)}>
                {card.traits.split(". ").map((trait) =>
                  <span {...stylex.props(ui.badge, ui.badgeDark, ui.shadowed)} key={`trait-back-${card.code}-${trait.replace(" ", "-")}`}>
                    {trait}
                  </span>
                )}
              </span>}

              {card.text &&
                <SanitizedHtml
                  className="mc-card__data__text"
                  xstyle={ui.shadowed}
                  html={card.text}
                  style={{ fontSize: "0.9em", borderColor: String(card.meta?.colors?.[0]) || 'black' }}
                  title={t('card.text')} />
              }
              {card.flavor &&
                <SanitizedHtml
                  as="i"
                  className="mc-card__flavor"
                  xstyle={[ui.border, ui.rounded, ui.bgLight, ui.textDark, ui.p1, ui.mx3, ui.shadowed]}
                  html={card.flavor}
                  style={{ fontSize: "0.75em" }}
                  title={t('card.flavor')} />
              }

              {card.base_threat !== undefined && card.base_threat > 0 &&
                <span className={cx("mc-card__threat", stylex.props(ui.shadowed).className)} style={stylex.props(ui.shadowed).style} title={t('card.base_threat')}>
                  {card.base_threat}
                  {card.base_threat_fixed !== undefined && card.base_threat_fixed == false && <IconForConcept concept="person" title={t('card.threat_per_player', { threat: card.base_threat })} />}
                </span>
              }
            </> : <>

              {card.linked_card?.traits && <span {...stylex.props(ui.flex, ui.gap1)}>
                {card.linked_card?.traits.split(". ").map((trait) =>
                  <span {...stylex.props(ui.badge, ui.badgeDark, ui.shadowed)} key={`trait-${card.code}-${trait.replace(" ", "-")}`}>
                    {trait}
                  </span>
                )}
              </span>}
              {card.back_text &&
                <SanitizedHtml
                  className="mc-card__data__text"
                  xstyle={ui.shadowed}
                  html={card.back_text}
                  style={{ fontSize: "0.9em", borderColor: String(card.meta?.colors?.[0]) || 'black' }}
                  title={t('card.text')} />
              }
              {card.linked_card?.text &&
                <SanitizedHtml
                  className="mc-card__data__text"
                  xstyle={ui.shadowed}
                  html={card.linked_card.text}
                  style={{ fontSize: "0.9em", borderColor: String(card.meta?.colors?.[0]) || 'black' }}
                  title={t('card.text')} />
              }

              {card.linked_card?.flavor &&
                <SanitizedHtml
                  as="i"
                  className="mc-card__flavor"
                  xstyle={[ui.border, ui.rounded, ui.bgLight, ui.textDark, ui.p1, ui.mx3, ui.shadowed]}
                  html={card.linked_card.flavor}
                  style={{ fontSize: "0.75em" }}
                  title={t('card.flavor')} />
              }
            </>}
          </main>
        </div>
      </div>

      {!onShowJson && <Modal
        title="JSON"
        isOpen={isJsonModalOpen}
        onOpenChange={setIsJsonModalOpen}
        key={`mc-card-modal-${card.code}`} >
        <pre><code>{JSON.stringify(card, undefined, 2)}</code></pre>
      </Modal>}
    </>
  )
}

export default Card