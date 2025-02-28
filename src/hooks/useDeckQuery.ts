/*
import { useTranslation } from "react-i18next";
import useDataQuery from "./useDataQuery";
import { TFunction } from "i18next";
import { MarvelDeck } from "../store/entities/decks";

export interface Deck {
    id: number,
    name: string,
    date_creation: string,
    date_update: string,
    description_md: string,
    user_id: 21328,
    investigator_code: string,
    investigator_name: string,
    slots: {
        [key: string]: number
    },
    ignoreDeckLimitSlots: {
        [key: string]: number
    },
    version: number,
    meta: string,
    tags: string,
}

const extractIdFromDeckUrl = (deckUrl: string): number => {
    const numberRegex = /^\d+$/;
    const urlRegex = /^https?:\/\/(?:[a-z]{2}\.)?marvelcdb\.com\/decklist\/view\/(\d+)\/?.*$/;
    const match = deckUrl.match(urlRegex);
    if (match) {
        return parseInt(match[1]);
    }

    const matchNumber = deckUrl.match(numberRegex);
    if (matchNumber) {
        return parseInt(deckUrl);
    }

    return -1;
}


const convertDeckToMarvelDeck = (deck: Deck, t: TFunction): MarvelDeck => {
    const { investigator_code, investigator_name, description_md, ...rest } = deck;
    let aspect: string | undefined = undefined;
    try {
        const metaJson = JSON.parse(deck.meta);
        aspect = metaJson.aspect;
    } catch (e) {
        console.error(`Error parsing meta for deck ${deck.id}`, e);
    }
    return {
        ...rest, 
        hero_code: investigator_code, 
        hero_name: investigator_name,
        description_md: description_md
            .replace(/]\(\/card\/(\w+)\)/g, `](${t('base_path')}/card/$1)`)
            .replace(/<img.*?src=['"](.*?)['"].*?>/gs, '![]($1)'),
        aspect: aspect, 
        tags_str: deck.tags, 
        tags: deck.tags.split(', ')
    };
}
  
const useDeckQuery = (deckUrl: string) => {
    const {t, i18n} = useTranslation('global');
    const deckId = extractIdFromDeckUrl(deckUrl);

    const baseURL = `${t('base_path')}/api/public`;
    const endpoint = `/decklist/${deckId}`;
    const queryKey = ["decklist", i18n.language, `${deckId}`];

    if (deckId === -1) {
        return { deck: undefined, deckError: new Error("Invalid deck URL"), isDeckLoading: false, isDeckFetching: false };
    }
    const {
        data,
        error: deckError,
        isLoading: isDeckLoading,
        isFetching: isDeckFetching
    } = useDataQuery<Deck>(
        baseURL,
        endpoint,
        queryKey,
        undefined, // requestConfig
    );

    const deck = data ? convertDeckToMarvelDeck(data, t) : undefined;

    return { deck, deckError, isDeckLoading, isDeckFetching };
}

export default useDeckQuery
*/