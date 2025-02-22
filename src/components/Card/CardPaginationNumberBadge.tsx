import { useSelector } from 'react-redux';
import { selectNumberOfCards } from '../../store/entities/cards';
import { selectPagination } from '../../store/ui/pagination';
import IconForConcept from '../IconForConcept';

const CardPaginationNumberBadge = () => {
    const paginationStatus = useSelector(selectPagination);
    const numberOfCards: number = useSelector(selectNumberOfCards);
    return (
        <span className='ms-1'>
            <span className='badge bg-secondary d-inline-flex align-items-center'>
                {paginationStatus.visibleFirstElementIndex+1}
                -
                {paginationStatus.visibleLastElementIndex}
            </span>
            <span className='ms-1'>/</span>
            <span className='badge bg-dark ms-1'>
                {numberOfCards}
                <IconForConcept concept="card" className='ms-1' />
            </span>
        </span>
    )
}

export default CardPaginationNumberBadge