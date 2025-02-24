import { removeCurrentDeck, setCurrentDeck, MarvelDeck, selectCurrentDeckId } from '../../../store/entities/decks'
import { useDispatch, useSelector } from 'react-redux';
import DeckBookmarkAction from '../../Deck/DeckBookmarkAction';
import IconForConcept from '../../IconForConcept';

type Props = {
    deck: MarvelDeck,
}



export const aspectColorMap: { [key: string]: string } = {
    "aggression": "danger",
    "justice": "warning",
    "leadership": "info",
    "protection": "success",
    "": "primary",
}

const DeckListItem = ({deck}: Props) => {
    const dispatch = useDispatch();
    const currentDeckId = useSelector(selectCurrentDeckId);
    const isCurrentDeck = deck.id === currentDeckId;
    const deckVariant = `${isCurrentDeck ? "" : "outline-"}${aspectColorMap[deck?.aspect||""]}`;
    return (
        <span
            className={`btn btn-${deckVariant} d-flex justify-content-between gap-4 align-items-center ${isCurrentDeck ? "z-2" : ""}`}
            onClick={() => {
                if (isCurrentDeck) {
                    dispatch(removeCurrentDeck());
                } else {
                    dispatch(setCurrentDeck(deck.id))
                }
            }}>
                <IconForConcept concept="deck" />    
                <span className='badge bg-light text-primary' style={{width: 'min-content'}}>
                {deck.hero_name}
                </span>
                <span className='flex-grow-1'>
                {deck.name}
                </span>
                <DeckBookmarkAction deck={deck} />
        </span>
    );
}

export default DeckListItem