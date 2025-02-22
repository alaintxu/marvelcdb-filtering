import { HTMLAttributes } from "react"
import { IconType } from "react-icons"
import { BsBookmark, BsBookmarkDashFill, BsBookmarkFill, BsBookmarkPlus, BsCloudArrowDown, BsEye, BsEyeFill, BsEyeSlash, BsEyeSlashFill, BsFiletypeJson, BsFunnel, BsPhone, BsPhoneFill, BsPhoneFlip, BsSearch, BsStack, BsTrash } from "react-icons/bs"
import { ImStack } from "react-icons/im"
import { MdClose, MdDownloadForOffline, MdFileDownloadDone, MdOutlineFileDownloadOff, MdOutlineSendAndArchive, MdSendAndArchive } from "react-icons/md"
import { RiArchiveStackFill, RiArchiveStackLine, RiStackedView } from "react-icons/ri"
import { TbPlayCardStar, TbPlayCardStarFilled } from "react-icons/tb"


export type Props = {
    // get concept options from conceptIcons keys
    concept: keyof Concepts,
} & HTMLAttributes<SVGAElement>

export type Concepts = {
  bookmark: IconType;
  bookmarkNo: IconType;
  bookmarkAdd: IconType;
  bookmarkRemove: IconType;

  card: IconType;
  cardBack: IconType;
  cardFill: IconType;
  cardFlip: IconType;
  cardFront: IconType;
  cardList: IconType;

  close: IconType;

  deck: IconType;
  deckFill: IconType;

  delete: IconType;

  download: IconType;
  downloadDone: IconType;
  downloadManager: IconType;
  downloadRemove: IconType;

  filter: IconType;
  hide: IconType;
  hideFill: IconType;

  jsonFile: IconType;

  pack: IconType;
  packFill: IconType;
  search: IconType;
  sendDownload: IconType;
  sendDownloadFill: IconType;
  show: IconType;
  showFill: IconType;
};

const conceptIcons: Concepts = {
    bookmark: BsBookmarkFill,
    bookmarkNo: BsBookmark,
    bookmarkAdd: BsBookmarkPlus,
    bookmarkRemove: BsBookmarkDashFill,

    card: TbPlayCardStar,
    cardBack: BsPhone,
    cardFill: TbPlayCardStarFilled,
    cardFlip: BsPhoneFlip,
    cardFront: BsPhoneFill,
    cardList: RiStackedView,

    close: MdClose,

    deck: ImStack,
    deckFill: BsStack,

    delete: BsTrash,

    download: MdOutlineFileDownloadOff,
    downloadDone: MdFileDownloadDone,
    downloadManager: BsCloudArrowDown,
    downloadRemove: MdDownloadForOffline,

    filter: BsFunnel,
    hide: BsEyeSlash,
    hideFill: BsEyeSlashFill,

    jsonFile: BsFiletypeJson,

    pack: RiArchiveStackLine,
    packFill: RiArchiveStackFill,
    search: BsSearch,
    sendDownload: MdOutlineSendAndArchive,
    sendDownloadFill: MdSendAndArchive,
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