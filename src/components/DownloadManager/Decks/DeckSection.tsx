import { useDispatch, useSelector, } from "react-redux"
import { deckCurrentConvertAndSet, selectCurrentDeck, selectIsCurrentInList } from "../../../store/entities/decks"
import { useTranslation } from "react-i18next";
import * as apiActions from "../../../store/api";
import IconForConcept from "../../IconForConcept";
import DeckList from "./DeckList";
import DeckListItem from "./DeckListItem";

const NUMBER_REGEX = /^\d{5}$/;
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
    const { t: globalT } = useTranslation('global');
    const { t } = useTranslation("decks");
    const dispatch = useDispatch();
    const currentDeck = useSelector(selectCurrentDeck);
    const isCurrentDeckInList = useSelector(selectIsCurrentInList);

    const callApiForDeck = (value: string) => {
        if (value.match(NUMBER_REGEX) || value.match(URL_REGEX)) {
            const deckId: number = extractIdFromDeckUrl(value);
            if (deckId !== -1) {
                dispatch(apiActions.apiCallBegan({
                    url: `${globalT('base_path')}/api/public/decklist/${deckId}`,
                    onSuccess: deckCurrentConvertAndSet.type,
                }));
            }
        }
    }

  return (
    <section id="deck-section">
        <h2>
            <IconForConcept concept="deck" className="me-2" /> 
            {t('decks')}
        </h2>
        <div className='alert alert-info'>
            {t('find_decks')} <a href={`${globalT('base_path')}/decklists`} target="_blank" rel="noreferrer">MarvelCDB</a>
        </div>
        <div className="px-3">
            <form className="input-group"
                onSubmit={(e) => {
                    e.preventDefault();
                    callApiForDeck(e.currentTarget["deck-id-or-url"].value);
                }
            }>
                <input
                    type="text"
                    className="form-control"
                    placeholder={t('deck_id_or_url')} 
                    name="deck-id-or-url"
                    pattern={`(${NUMBER_REGEX.source})|(${URL_REGEX.source})`}
                    onChange={(e) => {callApiForDeck(e.currentTarget.value)}}
                />
                <button type="submit" className="btn btn-primary">
                    <IconForConcept concept="sendDownloadFill" title={t('download_deck')} />
                </button>
            </form>
            {currentDeck && !isCurrentDeckInList && (
            <div className="d-flex justify-content-center">
                <div className="btn-group-vertical mt-3" role="group" aria-label="Current deck">
                    <DeckListItem deck={currentDeck} />
                </div>
            </div>
            )}
        </div>

        <DeckList />
    </section>
  )
}

export default DeckSection