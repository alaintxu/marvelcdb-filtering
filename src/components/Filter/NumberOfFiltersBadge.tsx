import { HTMLAttributes } from 'react'
import { selectNumberOfFilters } from '../../store/ui/filters';
import { useAppSelector } from '../../hooks/useStore';

interface Props extends HTMLAttributes<HTMLSpanElement> {}

const NumberOfFiltersBadge = ({className, ...rest}: Props) => {

    const numberOfFilters: number = useAppSelector(selectNumberOfFilters);
    if (numberOfFilters === 0) return null;
    return (
        <span className={`badge bg-secondary ${className}`} {...rest}>
            {numberOfFilters}
        </span>

    )
}

export default NumberOfFiltersBadge
