import { HTMLAttributes } from "react"
import { IconType } from "react-icons"
import { BsCloudArrowDown, BsEye, BsEyeFill, BsEyeSlash, BsEyeSlashFill, BsFunnel, BsPhone, BsPhoneFill, BsPhoneFlip, BsSearch, BsStack, BsTrash } from "react-icons/bs"
import { ImStack } from "react-icons/im"
import { RiArchiveStackFill, RiArchiveStackLine, RiStackedView } from "react-icons/ri"
import { TbPlayCardStar, TbPlayCardStarFilled } from "react-icons/tb"


export type Props = {
    // get concept options from conceptIcons keys
    concept: keyof Concepts,
} & HTMLAttributes<SVGAElement>

export type Concepts = {
    card: IconType;
    cardBack: IconType;
    cardFill: IconType;
    cardFlip: IconType;
    cardFront: IconType;
    cardList: IconType;
    deck: IconType;
    deckFill: IconType;
    delete: IconType;
    downloadManager: IconType;
    filter: IconType;
    hide: IconType;
    hideFill: IconType;
    pack: IconType;
    packFill: IconType;
    search: IconType;
    show: IconType;
    showFill: IconType;
  };

const conceptIcons: Concepts = {
    card: TbPlayCardStar,
    cardBack: BsPhone,
    cardFill: TbPlayCardStarFilled,
    cardFlip: BsPhoneFlip,
    cardFront: BsPhoneFill,
    cardList: RiStackedView,
    deck: ImStack,
    deckFill: BsStack,
    delete: BsTrash,
    downloadManager: BsCloudArrowDown,
    filter: BsFunnel,
    hide: BsEyeSlash,
    hideFill: BsEyeSlashFill,
    pack: RiArchiveStackLine,
    packFill: RiArchiveStackFill,
    search: BsSearch,
    show: BsEye,
    showFill: BsEyeFill,
}




const IconForConcept = ({concept, ...rest}: Props) => {
    const Icon = conceptIcons[concept] || <></>;
  return (
    <Icon {...rest} />
  )
}

export default IconForConcept