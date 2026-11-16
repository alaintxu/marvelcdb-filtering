import { loadDeck, selectCurrentDeck, selectDeckError, selectIsCurrentInList, selectIsDeckLoading } from "../../../store/entities/decks"
import { useTranslation } from "react-i18next";
import IconForConcept from "../../IconForConcept";
import DeckList from "./DeckList";
import DeckListItem from "./DeckListItem";
import LoadingSpinner from "../../LoadingSpinner";
import { useAppDispatch, useAppSelector } from "../../../hooks/useStore";
import * as stylex from '@stylexjs/stylex';
import { ui } from "../../../styles/ui";
import { useState } from "react";
import { InputGroup, InputGroupText } from "@astryxdesign/core/InputGroup";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Button } from "@astryxdesign/core/Button";

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
    const dispatch = useAppDispatch();
    const deckDownloading = useAppSelector(selectIsDeckLoading);
    const [deckInput, setDeckInput] = useState("");
    const deckDownloadError = useAppSelector(selectDeckError);
    const currentDeck = useAppSelector(selectCurrentDeck);
    const isCurrentDeckInList = useAppSelector(selectIsCurrentInList);

    const callApiForDeck = (value: string) => {
        if (value.match(NUMBER_REGEX) || value.match(URL_REGEX)) {
            const deckId: number = extractIdFromDeckUrl(value);
            if (deckId !== -1) {
                dispatch(loadDeck(deckId));
            }
        }
    }

  return (
    <section id="deck-section" {...stylex.props(ui.flex, ui.flexColumn, ui.gap3)}>
        <h3 {...stylex.props(ui.sectionTitle, ui.fs4, ui.flex, ui.itemsCenter)}>
            <IconForConcept concept="deck" xstyle={ui.me2} /> 
            {t('decks')}
        </h3>
        <div {...stylex.props(ui.px3)}>
            <div {...stylex.props(ui.alert, ui.alertInfo)} data-alert="true">
                {t('find_decks')} <a href={`${globalT('base_path')}/decklists`} target="_blank" rel="noreferrer">MarvelCDB</a>
            </div>
        </div>
        <div {...stylex.props(ui.px3)}>
            <form onSubmit={(e) => {
                    e.preventDefault();
                    callApiForDeck(deckInput);
                }
            }>
                <InputGroup label={t('deck_id_or_url')} isLabelHidden>
                    <TextInput
                        label={t('deck_id_or_url')}
                        isLabelHidden
                        placeholder={t('deck_id_or_url')}
                        value={deckInput}
                        onChange={(value) => {
                            setDeckInput(value);
                            callApiForDeck(value);
                        }}
                    />
                    {deckDownloading && (
                        <InputGroupText>
                            <LoadingSpinner />
                        </InputGroupText>
                    )}
                    {deckDownloadError && (
                        <InputGroupText>
                            <span {...stylex.props(ui.textDanger)}>
                                <IconForConcept concept="error" title={deckDownloadError} />
                            </span>
                        </InputGroupText>
                    )}
                    <Button type="submit" variant="primary" label={t('download_deck')} isIconOnly icon={<IconForConcept concept="sendDownloadFill" />} />
                </InputGroup>
            </form>
            {currentDeck && !isCurrentDeckInList && (
            <div {...stylex.props(ui.flex, ui.justifyCenter)}>
                <div {...stylex.props(ui.buttonGroupVertical, ui.mt3)} role="group" aria-label={globalT('current_deck')}>
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