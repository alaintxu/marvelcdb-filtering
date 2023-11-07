import { MCCard } from "./Card";

type Props = {
  card: MCCard,
  flipped: boolean
}

const marvelcdb_basepath = "https://es.marvelcdb.com";

const CardImage = ({ card, flipped }: Props) => {

  const getBackImageSrc = () => {
    if(card.backimagesrc) return marvelcdb_basepath + card.backimagesrc;
    if(card.linked_card?.imagesrc) return marvelcdb_basepath + card.linked_card.imagesrc;
    if(card.faction_code == "encounter")
      return "https://hallofheroeshome.files.wordpress.com/2021/02/marvel-encounter-back.png?w=300&h=419";

    return "https://hallofheroeshome.files.wordpress.com/2021/02/marvel-player-back.png?w=300&h=";
  }

  const getFrontImageSrc = () => {
    if(card.imagesrc) return marvelcdb_basepath + card.imagesrc;

    if(card.faction_code == "encounter")
      return "https://hallofheroeshome.files.wordpress.com/2021/02/fan-back-encounter.png?w=300&h=419";

    return "https://hallofheroeshome.files.wordpress.com/2021/02/fan-back-player.png?w=300&h=419";

    
  }
  return (
    <img
      className={`card-image ${card.type_code}`} 
      src={!flipped ? getFrontImageSrc() : getBackImageSrc()}
      alt={card.name + " card's front image"}/>
  )
}

export default CardImage