import { HTMLAttributes, useMemo } from 'react'
import { selectNumberOfFilters, selectQuickFilter } from '../../store/ui/filters';
import { useAppSelector } from '../../hooks/useStore';

interface Props extends HTMLAttributes<HTMLSpanElement> {}

const NumberOfFiltersBadge = ({className, ...rest}: Props) => {

    const numberOfFilters: number = useAppSelector(selectNumberOfFilters);
    const quickFilter = useAppSelector(selectQuickFilter);
    const badgeNumber = useMemo(() => {
        return quickFilter ? numberOfFilters + 1 : numberOfFilters;
    }, [numberOfFilters, quickFilter]);
    
    if (badgeNumber === 0) return null;
    return (
        <span className={`badge bg-secondary ${className}`} {...rest}>
            {badgeNumber}
        </span>

    )
}

export default NumberOfFiltersBadge
