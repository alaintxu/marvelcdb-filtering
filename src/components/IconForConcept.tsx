import { HTMLAttributes } from "react"
import { IconType } from "react-icons"
import { BsCloudArrowDown, BsFunnel, BsStack } from "react-icons/bs"
import { ImStack } from "react-icons/im"
import { RiArchiveStackFill, RiArchiveStackLine, RiStackedView } from "react-icons/ri"
import { TbPlayCardStar, TbPlayCardStarFilled } from "react-icons/tb"


export type Props = {
    // get concept options from conceptIcons keys
    concept: keyof Concepts,
} & HTMLAttributes<SVGAElement>

export type Concepts = {
    card: IconType;
    cardFill: IconType;
    deck: IconType;
    deckFill: IconType;
    pack: IconType;
    packFill: IconType;
    downloadManager: IconType;
    filter: IconType;
    cardList: IconType;
  };

const conceptIcons: Concepts = {
    card: TbPlayCardStar,
    cardFill: TbPlayCardStarFilled,
    deck: ImStack,
    deckFill: BsStack,
    pack: RiArchiveStackLine,
    packFill: RiArchiveStackFill,
    downloadManager: BsCloudArrowDown,
    filter: BsFunnel,
    cardList: RiStackedView,
}




const IconForConcept = ({concept, ...rest}: Props) => {
    const Icon = conceptIcons[concept] || <></>;
  return (
    <Icon {...rest} />
  )
}

export default IconForConcept