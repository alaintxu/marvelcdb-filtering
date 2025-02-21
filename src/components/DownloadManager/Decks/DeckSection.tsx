import { useDispatch, useSelector } from "react-redux"
import { deckCurrentConvertAndSet, deckCurrentRemoved, deckCurrentSet, selectAllDecks, selectCurrentDeck, selectIsCurrentInList } from "../../../store/entities/decks"
import DeckBookmarkAction from "../../Deck/DeckBookmarkAction";
import { useTranslation } from "react-i18next";
import { BsCheckSquareFill, BsSquare } from "react-icons/bs";
import * as apiActions from "../../../store/api";

const NUMBER_REGEX = /^\d+$/;
const URL_REGEX = /^https?:\/\/(?:[a-z]{2}\.)?marvelcdb\.com\/decklist\/view\/(\d+)\/?.*$/;

const extractIdFromDeckUrl = (deckUrl: string): number => {
    /* 
    ** Extract id using regex.
    ** Deck URL examples: 
    ** https://marvelcdb.com/decklist/view/46643/x-treme-measures-1.0 => 46643 
    ** https://es.marvelcdb.com/decklist/view/12345/whatever => 12345
    ** 46643 => 46643
    ** 12345 => 12345
    */
    const match = deckUrl.match(URL_REGEX);
    if (match) {
        return parseInt(match[1]);
    }

    const matchNumber = deckUrl.match(NUMBER_REGEX);
    if (matchNumber) {
        return parseInt(deckUrl);
    }

    return -1;
}

const DeckSection = () => {
    // @ToDo: improve styling
    const {t} = useTranslation("global");
    const dispatch = useDispatch();
    const decks = useSelector(selectAllDecks);
    const currentDeck = useSelector(selectCurrentDeck);
    const isCurrentDeckInList = useSelector(selectIsCurrentInList);

  return (
    <section id="deck-section">
        <h2>{t('decks')}</h2>
        <form onSubmit={(e) => {
            e.preventDefault();
            const deckId: number = extractIdFromDeckUrl(e.currentTarget["deck-id-or-url"].value);
            if (deckId !== -1) {
                dispatch(apiActions.apiCallBegan({
                    url: `${t('base_path')}/api/public/decklist/${deckId}`,
                    onSuccess: deckCurrentConvertAndSet.type,
                }));
                    /*{
                    type: 'apiCallBegan',
                    payload: {
                        url: `${t('base_path')}/api/public/decklist/${deckId}`,
                        onSuccess: deckCurrentConvertAndSet.type,
                        onError: 'apiRequestFailed',
                    }
                })*/
            }
        }
        }>
            <input
                type="text" 
                placeholder={t('deck_id_or_url')} 
                name="deck-id-or-url"
                pattern={`(${NUMBER_REGEX.source})|(${URL_REGEX.source})`}
            />
            <button type="submit">{t('download_deck')}</button>
        </form>

        <h3>{t('decks_bookmarked')}</h3>
        <ul>
            {currentDeck && !isCurrentDeckInList && <>
                <li className="d-flex gap-2 justify-content-between">
                    <BsCheckSquareFill />
                    &nbsp;
                    {currentDeck.hero_name} - 
                    &nbsp;
                    {currentDeck.name}
                    <DeckBookmarkAction deck={currentDeck} />
                </li>
            </>}
            {Object.entries(decks).map(([deckCode, deck]) => (
                <li key={deckCode} onClick={() => {
                    if (deck.id === currentDeck?.id)
                        dispatch(deckCurrentRemoved())
                    else
                        dispatch(deckCurrentSet(deck))
                    }
                } className="d-flex gap-2 justify-content-between">
                    {deck.id === currentDeck?.id ? <BsCheckSquareFill /> : <BsSquare />}
                    &nbsp;
                    {deck.hero_name} - 
                    &nbsp;
                    {deck.name}
                    <span>
                    <DeckBookmarkAction deck={deck} />
                    </span>
                </li>
            ))}
        </ul>
    </section>
  )
}

export default DeckSection