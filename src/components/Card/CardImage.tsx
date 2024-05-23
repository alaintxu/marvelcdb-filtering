import { LazyLoadImage } from "react-lazy-load-image-component";
import lazyHorizontal from '../../assets/mc-lazy-horizontal.webp';
import lazyVertical from '../../assets/mc-lazy-vertical.webp';
import { MCCard } from "../../hooks/useCards";
import { useTranslation } from 'react-i18next';
import { useState } from "react";

type Props = {
  card: MCCard,
  horizontal?: boolean
}

const marvelcdb_basepath = "https://es.marvelcdb.com";



function getFrontImage(card: MCCard) {
  if (card.imagesrc) return marvelcdb_basepath + card.imagesrc;

  return marvelcdb_basepath + "/bundles/cards/" + card.code + ".png";
}

function getBackImage(card: MCCard) {
  if (card.backimagesrc)
    return marvelcdb_basepath + card.backimagesrc;

  if (card.linked_card?.imagesrc)
    return marvelcdb_basepath + card.linked_card.imagesrc;

  if (card.type_code == "villain")
    return "https://cdn.jsdelivr.net/gh/alaintxu/mc-ocr@main/images/accepted/back_purple.webp";

  if (card.faction_code == "encounter")
    return "https://cdn.jsdelivr.net/gh/alaintxu/mc-ocr@main/images/accepted/back_orange.webp";

  return "https://cdn.jsdelivr.net/gh/alaintxu/mc-ocr@main/images/accepted/back_blue.webp";
}

function replaceImgSrcTranslation(imgSrc: string, lang: string) {
  if (lang == "es" && imgSrc.startsWith(marvelcdb_basepath)) {
    const code = imgSrc.split("/").pop();
    const codeNoExt = code?.split(".").shift();
    return "https://cdn.jsdelivr.net/gh/alaintxu/mc-ocr@main/images/accepted/" + codeNoExt + ".webp";
  }
  return imgSrc;
}

function getBackImageSrc(card: MCCard, lang: string) {
  const imgSrc = getBackImage(card);
  return replaceImgSrcTranslation(imgSrc, lang);
}

function getFrontImageSrc(card: MCCard, lang: string) {
  const imgSrc = getFrontImage(card);
  return replaceImgSrcTranslation(imgSrc, lang);
}

export function getCardImage(card: MCCard, flipped: boolean, lang: string) {
  return  flipped ? getBackImageSrc(card, lang) : getFrontImageSrc(card, lang);
}

const CardImage = ({ card, horizontal }: Props) => {
  const { i18n } = useTranslation('global');
  const lang = i18n.language;
  const [error, serError] = useState(false);


  const placeholderImage = horizontal ? lazyHorizontal : lazyVertical;

  /*
  const getBackImageSrc = () => {
    if (card.backimagesrc)
      return marvelcdb_basepath + card.backimagesrc;

    if (card.linked_card?.imagesrc)
      return marvelcdb_basepath + card.linked_card.imagesrc;

    if (card.type_code == "villain")
      return "https://cdn.jsdelivr.net/gh/alaintxu/mc-ocr@main/images/accepted/back_purple.webp";

    if (card.faction_code == "encounter")
      return "https://cdn.jsdelivr.net/gh/alaintxu/mc-ocr@main/images/accepted/back_orange.webp";

    return "https://cdn.jsdelivr.net/gh/alaintxu/mc-ocr@main/images/accepted/back_blue.webp";
  }

  const getFrontImageSrc = () => {
    if (card.imagesrc) return marvelcdb_basepath + card.imagesrc;

    return marvelcdb_basepath + "/bundles/cards/" + card.code + ".png";
  }
  */

  const replaceImgSrcTranslation = (imgSrc: string) => {
    if (!error && lang == "es" && imgSrc.startsWith(marvelcdb_basepath)) {
      const code = imgSrc.split("/").pop();
      const codeNoExt = code?.split(".").shift();
      return "https://cdn.jsdelivr.net/gh/alaintxu/mc-ocr@main/images/accepted/" + codeNoExt + ".webp";
    }
    return imgSrc;
  }

  const getBackImageSrcTranslations = () => {
    const imgSrc = getBackImageSrc(card, lang);
    return replaceImgSrcTranslation(imgSrc);
  }

  const getFrontImageSrcTranslations = () => {
    const imgSrc = getFrontImageSrc(card, lang);
    return replaceImgSrcTranslation(imgSrc);
  }

  return (
    <>
      <LazyLoadImage
        className={`mc-card__image front-image ${card.type_code}`}
        src={getFrontImageSrcTranslations()}
        alt={card.name + " card's front image (" + card.code + ")"}
        placeholderSrc={placeholderImage}
        loading="lazy"
        effect="blur"
        onError={() => serError(true)}
        title=""
      />

      <LazyLoadImage
        className={`mc-card__image back-image ${card.type_code}`}
        src={getBackImageSrcTranslations()}
        alt={card.name + " card's back image (" + card.code + ")"}
        placeholderSrc={placeholderImage}
        loading="lazy"
        effect="blur"
        onError={() => serError(true)}
      />
    </>
  )
}

export default CardImage;