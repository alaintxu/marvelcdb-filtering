import * as stylex from '@stylexjs/stylex';
import { useAppDispatch, useAppSelector } from '../../../hooks/useStore';
import { removeCurrentDeck, setCurrentDeck, MarvelDeck, selectCurrentDeckId } from '../../../store/entities/decks'
import DeckBookmarkAction from '../../Deck/DeckBookmarkAction';
import IconForConcept from '../../IconForConcept';
import { ui } from '../../../styles/ui';
import { aspectStyle } from '../../../styles/aspects';

type Props = {
    deck: MarvelDeck,
}

const styles = stylex.create({
    heroBadge: { width: 'min-content' },
});

const DeckListItem = ({deck}: Props) => {
    const dispatch = useAppDispatch();
    const currentDeckId = useAppSelector(selectCurrentDeckId);
    const isCurrentDeck = deck.id === currentDeckId;
    return (
        <span
            {...stylex.props(ui.button, isCurrentDeck ? ui.buttonSelected : ui.buttonOutline, ui.flex, ui.justifyBetween, ui.gap4, ui.itemsCenter)}
            onClick={() => {
                if (isCurrentDeck) {
                    dispatch(removeCurrentDeck());
                } else {
                    dispatch(setCurrentDeck(deck.id))
                }
            }}>
                <IconForConcept concept="deck" />
                <span {...stylex.props(ui.badge, aspectStyle(deck.aspect), styles.heroBadge)}>
                {deck.hero_name}
                </span>
                <span {...stylex.props(ui.flexGrow)}>
                {deck.name}
                </span>
                <DeckBookmarkAction deck={deck} />
        </span>
    );
}

export default DeckListItem
