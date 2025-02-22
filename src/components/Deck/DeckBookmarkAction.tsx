import { useDispatch, useSelector } from 'react-redux';
import { deckAdded, deckRemoved, MarvelDeck, selectIsDeckInList } from '../../store/entities/decks'
import { useMemo, useState } from 'react';
import { t } from 'i18next';
import IconForConcept from '../IconForConcept';

type Props = {
    deck: MarvelDeck
}

const DeckBookmarkAction = ({deck}: Props) => {
  const dispatch = useDispatch();
  const deckInList: boolean = useSelector(selectIsDeckInList(deck.id));
  const [isHovering, setIsHovering] = useState(false);

  const bookmarkIcon = useMemo(() => {
    if (!isHovering) {
      return deckInList ? <IconForConcept concept="bookmark" /> : <IconForConcept concept="bookmarkNo" />;
    } else {
      return deckInList ? <IconForConcept concept="bookmarkRemove" /> : <IconForConcept concept="bookmarkAdd" />;
    }
  }, [deckInList, isHovering]);

  return (
    <span   onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={(e) => {
              e.stopPropagation();
              if (deckInList) dispatch(deckRemoved(deck.id));
              else            dispatch(deckAdded(deck));
            }}
            title={deckInList ? t('deck_remove_from_bookmarks') : t('deck_add_to_bookmarks')}
            >

        {bookmarkIcon}
    </span>
  )
}

export default DeckBookmarkAction