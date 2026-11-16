import * as stylex from '@stylexjs/stylex';
import { useAppSelector } from '../../../hooks/useStore';
import { selectNumberOfCards } from '../../../store/entities/cards';
import IconForConcept from '../../IconForConcept';
import { ui } from '../../../styles/ui';

const CardStatusCountBadge = () => {
    const numberOfCards = useAppSelector(selectNumberOfCards);
    return (
        <span {...stylex.props(ui.badge, ui.badgeDark, ui.ms1)}>
            {numberOfCards}
            <IconForConcept concept="multiple_cards" xstyle={ui.ms1} />
        </span>
    )
}

export default CardStatusCountBadge
