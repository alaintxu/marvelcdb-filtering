import { selectPagination } from '../../store/ui/pagination';
import IconForConcept from '../IconForConcept';
import { useAppSelector } from '../../hooks/useStore';

const CardPaginationNumberBadge = () => {
    const paginationStatus = useAppSelector(selectPagination);
    return (
        <span className='ms-1'>
            <span className='badge bg-secondary d-inline-flex align-items-center'>
                {paginationStatus.visibleFirstElementIndex+1}
                -
                {paginationStatus.visibleLastElementIndex}
            </span>
            <span className='ms-1'>/</span>
            <span className='badge bg-dark ms-1'>
                {paginationStatus.totalElements}
                <IconForConcept concept="multiple_cards" className='ms-1' />
            </span>
        </span>
    )
}

export default CardPaginationNumberBadge