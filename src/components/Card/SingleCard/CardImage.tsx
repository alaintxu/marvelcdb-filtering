import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import lazyHorizontal from '../../../assets/mc-lazy-horizontal.webp';
import lazyVertical from '../../../assets/mc-lazy-vertical.webp';
import { MCCard } from "../../../store/entities/cards";
import { useTranslation } from 'react-i18next';
import { useState } from "react";

type Props = {
  card: MCCard,
  horizontal?: boolean,
  onImageStateChange?: (face: ImageFace, state: ImageLoadState) => void
}

export type ImageFace = "front" | "back";
export type ImageLoadState = "loading" | "loaded" | "error";
export type ImageSrcStage = "primary" | "english";

const marvelcdb_basepath = "https://es.marvelcdb.com";
const marvelcdb_english_basepath = "https://marvelcdb.com";
const marvelcdb_ocr_basepath = "https://cdn.jsdelivr.net/gh/alaintxu/mc-ocr@main/images/accepted/";

function getFrontImage(card: MCCard) {
  if (card.imagesrc) return marvelcdb_basepath + card.imagesrc;

  let code = card.code;
  if (card.duplicate_of_code) code = card.duplicate_of_code;

  return marvelcdb_basepath + "/bundles/cards/" + code + ".png";
}

function getBackImage(card: MCCard) {
  if (card.backimagesrc)
    return marvelcdb_basepath + card.backimagesrc;

  if (card.linked_card?.imagesrc)
    return marvelcdb_basepath + card.linked_card.imagesrc;

  if ((card.type_code == "main_scheme" || card.code.endsWith("a")) && card.linked_card?.code)
    return marvelcdb_ocr_basepath + card.linked_card.code + ".webp";

  if (["evidence_means","evidence_motive","evidence_opportunity"].includes(card.type_code))
    return marvelcdb_ocr_basepath + card.type_code + ".webp";

  if (card.type_code == "villain")
    return marvelcdb_ocr_basepath + "back_purple.webp";

  if (card.faction_code == "encounter")
    return marvelcdb_ocr_basepath + "back_orange.webp";

  return marvelcdb_ocr_basepath + "back_blue.webp";
}

/* Swaps the marvelcdb image for the translated (OCR) one when available */
function localizeImageSrc(localizedSrc: string, lang: string) {
  if (lang == "es" && localizedSrc.startsWith(marvelcdb_basepath)) {
    const code = localizedSrc.split("/").pop();
    const codeNoExt = code?.split(".").shift();
    return marvelcdb_ocr_basepath + codeNoExt + ".webp";
  }
  return localizedSrc;
}

/* Swaps the es.marvelcdb hosted image for the English (marvelcdb.com) one */
function toEnglishImageSrc(localizedSrc: string) {
  if (localizedSrc.startsWith(marvelcdb_basepath)) {
    return marvelcdb_english_basepath + localizedSrc.slice(marvelcdb_basepath.length);
  }
  return localizedSrc;
}

/*
 * Resolves the image source for a card face.
 * - "primary" stage: the localized (translated OCR) image when available.
 * - "english" stage: fallback to the English marvelcdb.com image
 *   (only when it differs from the primary one, e.g. after the primary failed to load).
 */
export function getCardImageSrc(card: MCCard, flipped: boolean, lang: string, stage: ImageSrcStage): string {
  const localizedSrc = flipped ? getBackImage(card) : getFrontImage(card);
  const primarySrc = localizeImageSrc(localizedSrc, lang);
  if (stage === "english") {
    const englishSrc = toEnglishImageSrc(localizedSrc);
    if (englishSrc !== primarySrc) return englishSrc;
  }
  return primarySrc;
}

export function getCardImage(card: MCCard, flipped: boolean, lang: string) {
  return getCardImageSrc(card, flipped, lang, "primary");
}

const CardImage = ({ card, horizontal, onImageStateChange }: Props) => {
  const { i18n } = useTranslation('global');
  const [srcStages, setSrcStages] = useState<Record<ImageFace, ImageSrcStage>>({
    front: "primary",
    back: "primary"
  });

  const placeholderImage = horizontal ? lazyHorizontal : lazyVertical;

  const handleImageError = (face: ImageFace) => {
    const flipped = face === "back";
    if (srcStages[face] === "primary") {
      // Retry with the English image. If there is no English alternative
      // the src does not change, so the error is reported to avoid loops.
      const localizedSrc = getCardImageSrc(card, flipped, i18n.language, "english");
      if (localizedSrc !== getCardImageSrc(card, flipped, i18n.language, "primary")) {
        setSrcStages((prev) => ({ ...prev, [face]: "english" }));
        return;
      }
    }
    onImageStateChange?.(face, "error");
  };

  const renderFace = (face: ImageFace) => {
    const flipped = face === "back";
    return (
      <LazyLoadImage
        className={`mc-card__image ${face}-image ${card.type_code}`}
        src={getCardImageSrc(card, flipped, i18n.language, srcStages[face])}
        alt={card.name + ` card's ${face} image (` + card.code + ")"}
        placeholderSrc={placeholderImage}
        loading="lazy"
        effect="blur"
        afterLoad={() => onImageStateChange?.(face, "loaded")}
        onError={() => handleImageError(face)}
        title={face === "front" ? "" : undefined}
      />
    );
  };

  return (
    <>
      {renderFace("front")}
      {renderFace("back")}
    </>
  )
}

export default CardImage;
