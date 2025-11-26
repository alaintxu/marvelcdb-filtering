import { HTMLAttributes } from "react"
import { IconType } from "react-icons"
import { BsArrowsCollapse, BsArrowsExpand, BsBookmark, BsBookmarkDashFill, BsBookmarkFill, BsBookmarkPlus, BsCloudArrowDown, BsDownload, BsExclamationCircle, BsExclamationOctagonFill, BsExclamationTriangle, BsEye, BsEyeFill, BsEyeSlash, BsEyeSlashFill, BsFiletypeJson, BsFunnel, BsImage, BsPersonFill, BsPhone, BsPhoneFill, BsPhoneFlip, BsQuestionCircleFill, BsSearch, BsStack, BsTranslate, BsTrash } from "react-icons/bs"
import { FaArrowRotateLeft, FaChevronDown, FaEraser, FaFileExport, FaFileImport, FaTag } from "react-icons/fa6"
import { GoMultiSelect } from "react-icons/go"
import { ImStack } from "react-icons/im"
import { MdCategory, MdCheckBox, MdCheckBoxOutlineBlank, MdClose, MdDownloadForOffline, MdError, MdErrorOutline, MdFileDownloadDone, MdIndeterminateCheckBox, MdNumbers, MdOutlineFileDownloadOff, MdOutlineSendAndArchive, MdSendAndArchive } from "react-icons/md"
import { RiArchiveStackFill, RiArchiveStackLine, RiStackedView } from "react-icons/ri"
import { TbBracketsContain, TbCards, TbPlayCardStar, TbPlayCardStarFilled } from "react-icons/tb"
import styles from './IconForConcept.module.css';

export type { IconType };

export type Props = {
    // get concept options from conceptIcons keys
    concept: keyof Concepts,
} & HTMLAttributes<SVGAElement>

export type Concepts = {
  bookmark: IconType;
  bookmarkNo: IconType;
  bookmarkAdd: IconType;
  bookmarkRemove: IconType;

  brackets: IconType;

  card: IconType;
  cardBack: IconType;
  cardFill: IconType;
  cardFlip: IconType;
  cardFront: IconType;
  cardList: IconType;

  category: IconType;
  checkbox: IconType;
  checkboxIndeterminate: IconType;
  checkboxOutline: IconType;
  chevronDown: IconType;

  close: IconType;
  collapse: IconType;

  deck: IconType;
  deckFill: IconType;

  delete: IconType;

  download: IconType;
  downloadDone: IconType;
  downloadManager: IconType;
  downloadRemove: IconType;
  downloadSimple: IconType;

  error: IconType;
  errorFill: IconType;

  erase: IconType;
  expand: IconType;
  exclamationCircle: IconType;
  exclamationOctagon: IconType;

  export: IconType;

  filter: IconType;
  hide: IconType;
  hideFill: IconType;

  image: IconType;
  import: IconType;

  jsonFile: IconType;

  multiselect: IconType;

  numbers: IconType;

  pack: IconType;
  packFill: IconType;
  person: IconType;
  questionCircle: IconType;
  reset: IconType;
  search: IconType;
  sendDownload: IconType;
  sendDownloadFill: IconType;
  show: IconType;
  showFill: IconType;

  single_card: IconType;
  multiple_cards: IconType;

  tag: IconType;
  translate: IconType;
  warning: IconType;
};

const conceptIcons: Concepts = {
    bookmark: BsBookmarkFill,
    bookmarkNo: BsBookmark,
    bookmarkAdd: BsBookmarkPlus,
    bookmarkRemove: BsBookmarkDashFill,

    brackets: TbBracketsContain,

    card: TbPlayCardStar,
    cardBack: BsPhone,
    cardFill: TbPlayCardStarFilled,
    cardFlip: BsPhoneFlip,
    cardFront: BsPhoneFill,
    cardList: RiStackedView,

    category: MdCategory,
    checkbox: MdCheckBox,
    checkboxIndeterminate: MdIndeterminateCheckBox,
    checkboxOutline: MdCheckBoxOutlineBlank,
    chevronDown: FaChevronDown,

    close: MdClose,
    collapse: BsArrowsCollapse,

    deck: ImStack,
    deckFill: BsStack,

    delete: BsTrash,

    download: MdOutlineFileDownloadOff,
    downloadDone: MdFileDownloadDone,
    downloadManager: BsCloudArrowDown,
    downloadRemove: MdDownloadForOffline,
    downloadSimple: BsDownload,

    error: MdErrorOutline,
    errorFill: MdError,

    erase: FaEraser,
    expand: BsArrowsExpand,
    exclamationCircle: BsExclamationCircle,
    exclamationOctagon: BsExclamationOctagonFill,

    export: FaFileExport,

    filter: BsFunnel,
    hide: BsEyeSlash,
    hideFill: BsEyeSlashFill,

    image: BsImage,
    import: FaFileImport,

    jsonFile: BsFiletypeJson,

    multiselect: GoMultiSelect,

    numbers: MdNumbers,

    pack: RiArchiveStackLine,
    packFill: RiArchiveStackFill,
    person: BsPersonFill,
    questionCircle: BsQuestionCircleFill,
    reset: FaArrowRotateLeft,
    search: BsSearch,
    sendDownload: MdOutlineSendAndArchive,
    sendDownloadFill: MdSendAndArchive,
    show: BsEye,
    showFill: BsEyeFill,

    single_card: TbPlayCardStar,
    multiple_cards: TbCards,

    tag: FaTag,
    translate: BsTranslate,
    warning: BsExclamationTriangle,
}




const IconForConcept = ({concept, ...rest}: Props) => {
    const Icon = conceptIcons[concept] || (() => <></>);
  return (
    <Icon  {...rest} className={`${styles.icon} ${rest.className || ""}`} />
  )
}

export default IconForConcept