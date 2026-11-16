import { selectPagination } from '../../store/ui/pagination';
import IconForConcept from '../IconForConcept';
import { useAppSelector } from '../../hooks/useStore';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/ui';

const CardPaginationNumberBadge = () => {
    const paginationStatus = useAppSelector(selectPagination);
    return (
        <span {...stylex.props(ui.ms1)}>
            <span {...stylex.props(ui.badge, ui.badgeSecondary, ui.inlineFlex, ui.itemsCenter)}>
                {paginationStatus.visibleFirstElementIndex+1}
                -
                {paginationStatus.visibleLastElementIndex}
            </span>
            <span {...stylex.props(ui.ms1)}>/</span>
            <span {...stylex.props(ui.badge, ui.badgeDark, ui.ms1)}>
                {paginationStatus.totalElements}
                <IconForConcept concept="multiple_cards" xstyle={ui.ms1} />
            </span>
        </span>
    )
}

export default CardPaginationNumberBadge