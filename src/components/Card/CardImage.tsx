import { MCCard } from ".";
import { LazyLoadImage } from "react-lazy-load-image-component";
import lazyHorizontal from '../../assets/mc-lazy-horizontal.webp';
import lazyVertical from '../../assets/mc-lazy-vertical.webp';

type Props = {
  card: MCCard,
  flipped: boolean,
  horizontal?: boolean
}

const marvelcdb_basepath = "https://es.marvelcdb.com";

const CardImage = ({ card, flipped, horizontal }: Props) => {

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
  return (
    <LazyLoadImage
      className={`card__image ${card.type_code}`}
      src={!flipped ? getFrontImageSrc() : getBackImageSrc()}
      alt={card.name + " card's front image"}
      placeholderSrc={placeholderImage}
      loading="lazy"
      width={horizontal ? "419px" : "300px"}
      height={horizontal ? "300px" : "419px"}
      effect="blur"
    />
  )
}

export default CardImage