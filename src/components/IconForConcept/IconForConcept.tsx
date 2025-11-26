import { HTMLAttributes } from "react"
import { IconType } from "react-icons"
import { BsArrowsCollapse, BsArrowsExpand, BsBookmark, BsBookmarkDashFill, BsBookmarkFill, BsBookmarkPlus, BsCheckCircleFill, BsCloudArrowDown, BsDownload, BsExclamationTriangle, BsEye, BsEyeFill, BsEyeSlash, BsEyeSlashFill, BsFiletypeJson, BsFunnel, BsImage, BsInfoCircleFill, BsPersonFill, BsPhone, BsPhoneFill, BsPhoneFlip, BsQuestionCircleFill, BsSearch, BsStack, BsTranslate, BsTrash, BsXCircleFill } from "react-icons/bs"
import { FaArrowRotateLeft, FaChevronDown, FaEraser, FaFileExport, FaFileImport, FaTag } from "react-icons/fa6"
import { GoMultiSelect } from "react-icons/go"
import { ImStack } from "react-icons/im"
import { MdCategory, MdCheckBox, MdCheckBoxOutlineBlank, MdClose, MdDownloadForOffline, MdError, MdErrorOutline, MdFileDownloadDone, MdIndeterminateCheckBox, MdNumbers, MdOutlineFileDownloadOff, MdOutlineSendAndArchive, MdSendAndArchive } from "react-icons/md"
import { RiArchiveStackFill, RiArchiveStackLine, RiStackedView } from "react-icons/ri"
import { TbBracketsContain, TbCards, TbPlayCardStar, TbPlayCardStarFilled } from "react-icons/tb"
import styles from './IconForConcept.module.css';

export type { IconType };



const conceptIcons = {
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

    danger: BsXCircleFill,

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

    export: FaFileExport,

    filter: BsFunnel,
    hide: BsEyeSlash,
    hideFill: BsEyeSlashFill,

    image: BsImage,
    import: FaFileImport,

    info: BsInfoCircleFill,

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

    success: BsCheckCircleFill,

    single_card: TbPlayCardStar,
    multiple_cards: TbCards,

    tag: FaTag,
    translate: BsTranslate,
    warning: BsExclamationTriangle,
} satisfies Record<string, IconType>




export type Concepts = typeof conceptIcons;

export type Props = {
    // get concept options from conceptIcons keys
    concept: keyof Concepts,
} & HTMLAttributes<SVGAElement>

const IconForConcept = ({concept, ...rest}: Props) => {
    const Icon = conceptIcons[concept] || (() => <></>);
  return (
    <Icon  {...rest} className={`${styles.icon} ${rest.className || ""}`} />
  )
}

export default IconForConcept