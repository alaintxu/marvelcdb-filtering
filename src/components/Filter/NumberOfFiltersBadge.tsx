import type { StyleXStyles } from '@stylexjs/stylex'
import * as stylex from '@stylexjs/stylex'
import { selectNumberOfFilters, selectQuickFilter } from '../../store/ui/filters';
import { useAppSelector } from '../../hooks/useStore';
import { ui } from '../../styles/ui';

interface Props {
    xstyle?: StyleXStyles;
}

const NumberOfFiltersBadge = ({ xstyle }: Props) => {

    const numberOfFilters: number = useAppSelector(selectNumberOfFilters);
    const quickFilter = useAppSelector(selectQuickFilter);
    const badgeNumber = quickFilter ? numberOfFilters + 1 : numberOfFilters;

    if (badgeNumber === 0) return null;
    return (
        <span {...stylex.props(ui.badge, ui.badgeSecondary, xstyle)}>
            {badgeNumber}
        </span>

    )
}

export default NumberOfFiltersBadge
