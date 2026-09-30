import { createListenerMiddleware } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';
import { cardsReceived, cardsTranslationsReceived, removeAllCards, MCCard } from '../entities/cards';
import { unloadPackCards } from '../entities/packs';
import i18n from '../../i18n';
import { savePackCards, deletePackCards, clearPersistedCards } from '../persistence/cardsDb';

const CARDS_PERSIST_DEBOUNCE_MS = 300;

export const persistenceMiddleware = createListenerMiddleware<RootState>();

/* Debounced save of all in-store cards to IndexedDB.
   A pack download triggers several actions in a burst
   (base cards, encounter cards, translations),
   so saving starts once the burst settles. */
persistenceMiddleware.startListening({
    predicate: (action) => cardsReceived.match(action) || cardsTranslationsReceived.match(action),
    effect: async (_action, listenerApi) => {
        listenerApi.cancelActiveListeners();
        await listenerApi.delay(CARDS_PERSIST_DEBOUNCE_MS);

        const state = listenerApi.getState();
        const lang = i18n.language || 'en';
        const cardsByPack: Record<string, MCCard[]> = {};
        for (const card of state.entities.cards) {
            (cardsByPack[card.pack_code] ||= []).push(card);
        }
        for (const [packCode, cards] of Object.entries(cardsByPack)) {
            await savePackCards(lang, packCode, cards);
        }
    }
});

persistenceMiddleware.startListening({
    actionCreator: unloadPackCards,
    effect: (action) => {
        const lang = i18n.language || 'en';
        return deletePackCards(lang, action.payload);
    }
});

persistenceMiddleware.startListening({
    actionCreator: removeAllCards,
    effect: () => clearPersistedCards()
});
