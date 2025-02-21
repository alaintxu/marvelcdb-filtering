import { useSelector } from 'react-redux';
import { selectNumberOfCards } from '../../store/entities/cards';
import { selectPagination } from '../../store/ui/pagination';

const CardPaginationNumberBadge = () => {
    const paginationStatus = useSelector(selectPagination);
    const numberOfCards: number = useSelector(selectNumberOfCards);
    return (
        <span className='ms-1'>
            <span className='badge bg-secondary'>
                {paginationStatus.visibleFirstElementIndex+1}
                -
                {paginationStatus.visibleLastElementIndex}
            </span>
            <span className='ms-1'>/</span>
            <span className='badge bg-dark ms-1'>
                {numberOfCards}
            </span>
        </span>
    )
}

export default CardPaginationNumberBadge