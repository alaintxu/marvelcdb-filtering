import { useDispatch, useSelector } from 'react-redux';
import { deckAdded, deckRemoved, MarvelDeck, selectIsDeckInList } from '../../store/entities/decks'
import { useMemo, useState } from 'react';
import { BsBookmark, BsBookmarkDashFill, BsBookmarkFill, BsBookmarkPlus } from 'react-icons/bs';
import { t } from 'i18next';

type Props = {
    deck: MarvelDeck
}

const DeckBookmarkAction = ({deck}: Props) => {
  const dispatch = useDispatch();
  const deckInList: boolean = useSelector(selectIsDeckInList(deck.id));
  const [isHovering, setIsHovering] = useState(false);

  const bookmarkIcon = useMemo(() => {
    if (!isHovering) {
      return deckInList ? <BsBookmarkFill /> : <BsBookmark />;
    } else {
      return deckInList ? <BsBookmarkDashFill /> : <BsBookmarkPlus />;
    }
  }, [deckInList, isHovering]);

  return (
    <span   onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => {
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