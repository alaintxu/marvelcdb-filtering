
import { useAppSelector } from '../../../hooks/useStore';
import { selectNumberOfCards } from '../../../store/entities/cards';
import IconForConcept from '../../IconForConcept';

const CardStatusCountBadge = () => {
    const numberOfCards = useAppSelector(selectNumberOfCards);
    return (
        <span className='badge bg-dark ms-1'>
            {numberOfCards}
            <IconForConcept concept="multiple_cards" className='ms-1' />
        </span>
    )
}

export default CardStatusCountBadge