import type { ComponentProps } from "react"
import { BsArrowsCollapse, BsArrowsExpand, BsBookmark, BsBookmarkDashFill, BsBookmarkFill, BsBookmarkPlus, BsCheckCircleFill, BsCloudArrowDown, BsDownload, BsExclamationTriangle, BsEye, BsEyeFill, BsEyeSlash, BsEyeSlashFill, BsFiletypeJson, BsFunnel, BsHourglassSplit, BsImage, BsInfoCircleFill, BsPersonFill, BsPhone, BsPhoneFill, BsPhoneFlip, BsQuestionCircleFill, BsSearch, BsStack, BsTranslate, BsTrash, BsXCircleFill } from "react-icons/bs"
import { FaArrowRotateLeft, FaChevronDown, FaEraser, FaFileExport, FaFileImport, FaTag } from "react-icons/fa6"
import { PiArrowFatLineDown, PiArrowFatLineUp, PiEquals } from "react-icons/pi"
import { GoMultiSelect } from "react-icons/go"
import { ImStack } from "react-icons/im"
import { MdCategory, MdCheckBox, MdCheckBoxOutlineBlank, MdClose, MdDownloadForOffline, MdError, MdErrorOutline, MdFileDownloadDone, MdIndeterminateCheckBox, MdNumbers, MdOutlineFileDownloadOff, MdOutlineSendAndArchive, MdSendAndArchive } from "react-icons/md"
import { RiArchiveStackFill, RiArchiveStackLine, RiStackedView } from "react-icons/ri"
import { TbBracketsContain, TbCards, TbPlayCardStar, TbPlayCardStarFilled } from "react-icons/tb"
import { Icon, type IconType } from '@astryxdesign/core/Icon';
import * as stylex from '@stylexjs/stylex';

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
    hourglass: BsHourglassSplit,

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

    lessThan: PiArrowFatLineDown,
    equalTo: PiEquals,
    greaterThan: PiArrowFatLineUp,
} satisfies Record<string, IconType>

export type Concepts = typeof conceptIcons;

export type Props = {
    concept: keyof Concepts;
    title?: string;
} & Omit<ComponentProps<typeof Icon>, 'icon' | 'label' | 'className'>;

const styles = stylex.create({
    icon: {
        display: 'inline',
        verticalAlign: 'middle',
        marginInlineEnd: '0.25rem',
    },
    titled: { display: 'inline-flex', alignItems: 'center' },
});

// Icons are decorative unless they get a title; keep them out of the accessibility tree then.
const IconForConcept = ({ concept, title, xstyle, ...rest }: Props) => {
    const icon = (
        <Icon
            icon={conceptIcons[concept]}
            label={title}
            size="sm"
            xstyle={title ? xstyle : [styles.icon, xstyle]}
            {...rest}
        />
    );

    // SVGProps has no `title`, so keep the native tooltip on a wrapper.
    return title ? <span title={title} {...stylex.props(styles.titled)}>{icon}</span> : icon;
};

export default IconForConcept;
