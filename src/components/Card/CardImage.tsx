import { LazyLoadImage } from "react-lazy-load-image-component";
import lazyHorizontal from '../../assets/mc-lazy-horizontal.webp';
import lazyVertical from '../../assets/mc-lazy-vertical.webp';
import { MCCard } from "../../hooks/useCards";
import { useTranslation } from 'react-i18next';

type Props = {
  card: MCCard,
  horizontal?: boolean
}

const marvelcdb_basepath = "https://es.marvelcdb.com";

const CardImage = ({ card, horizontal }: Props) => {
  const { i18n } = useTranslation('global');
  const lang = i18n.language;


  const placeholderImage = horizontal ? lazyHorizontal : lazyVertical;

  const getBackImageSrc = () => {
    if (card.backimagesrc) return marvelcdb_basepath + card.backimagesrc;
    if (card.linked_card?.imagesrc) return marvelcdb_basepath + card.linked_card.imagesrc;
    if (card.faction_code == "encounter")
      return "https://hallofheroeshome.files.wordpress.com/2021/02/marvel-encounter-back.png?w=300&h=419";

    return "https://hallofheroeshome.files.wordpress.com/2021/02/marvel-player-back.png?w=300&h=";
  }

  const getFrontImageSrc = () => {
    if (card.imagesrc) return marvelcdb_basepath + card.imagesrc;

    if (card.faction_code == "encounter")
      return "https://hallofheroeshome.files.wordpress.com/2021/02/fan-back-encounter.png?w=300&h=419";

    return "https://hallofheroeshome.files.wordpress.com/2021/02/fan-back-player.png?w=300&h=419";


  }

  const replaceImgSrcTranslation = (imgSrc: string) => {
    if (lang == "es" && imgSrc.startsWith(marvelcdb_basepath)) {
      const code = imgSrc.split("/").pop()?.replace(".png", ".webp");
      return "https://cdn.jsdelivr.net/gh/alaintxu/mc-ocr@main/images/accepted/" + code;
    }
    return imgSrc;
  }

  const getBackImageSrcTranslations = () => {
    const imgSrc = getBackImageSrc();
    return replaceImgSrcTranslation(imgSrc);
  }

  const getFrontImageSrcTranslations = () => {
    const imgSrc = getFrontImageSrc();
    return replaceImgSrcTranslation(imgSrc);
  }

  return (
    <>
      <LazyLoadImage
        className={`card__image front-image ${card.type_code}`}
        src={getFrontImageSrcTranslations()}
        alt={card.name + " card's front image (" + card.code + ")"}
        placeholderSrc={placeholderImage}
        loading="lazy"
        // width={horizontal ? "419px" : "300px"}
        // height={horizontal ? "300px" : "419px"}
        effect="blur"
      />

      <LazyLoadImage
        className={`card__image back-image ${card.type_code}`}
        src={getBackImageSrcTranslations()}
        alt={card.name + " card's back image (" + card.code + ")"}
        placeholderSrc={placeholderImage}
        loading="lazy"
        // width={horizontal ? "419px" : "300px"}
        // height={horizontal ? "300px" : "419px"}
        effect="blur"
      />
    </>
  )
}

export default CardImage;