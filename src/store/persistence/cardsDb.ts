import { createStore, get, set, del, clear, entries, type UseStore } from 'idb-keyval';
import { MCCard } from '../entities/cards';

export const SCHEMA_VERSION = 1;

const DB_NAME = 'marvelcdb-filtering';
const DB_STORE_NAME = 'cards';
const SCHEMA_VERSION_KEY = 'schema_version';
const PACK_KEY_PREFIX = 'pack:';

export type PersistedPack = {
    savedAt: number;
    cards: MCCard[];
};

let cardsStore: UseStore | undefined;
let cardsStoreInitializationFailed = false;

const getCardsStore = (): UseStore | undefined => {
    if (cardsStore) return cardsStore;
    if (cardsStoreInitializationFailed) return undefined;
    if (typeof indexedDB === 'undefined') {
        cardsStoreInitializationFailed = true;
        console.warn('IndexedDB is not available, card persistence disabled');
        return undefined;
    }
    try {
        cardsStore = createStore(DB_NAME, DB_STORE_NAME);
        return cardsStore;
    } catch (e) {
        cardsStoreInitializationFailed = true;
        console.error('Error creating IndexedDB store, card persistence disabled', e);
        return undefined;
    }
};

const packKey = (lang: string, packCode: string): string => `${PACK_KEY_PREFIX}${lang}:${packCode}`;

const ensureSchema = async (store: UseStore): Promise<void> => {
    const storedVersion = await get<number>(SCHEMA_VERSION_KEY, store);
    if (storedVersion === SCHEMA_VERSION) return;
    await clear(store);
    await set(SCHEMA_VERSION_KEY, SCHEMA_VERSION, store);
};

export const isCardPersistenceAvailable = (): boolean => !!getCardsStore();

export async function savePackCards(lang: string, packCode: string, cards: MCCard[]): Promise<void> {
    const store = getCardsStore();
    if (!store || cards.length === 0) return;
    try {
        await ensureSchema(store);
        const pack: PersistedPack = { savedAt: Date.now(), cards };
        await set(packKey(lang, packCode), pack, store);
    } catch (e) {
        console.error(`Error saving cards for pack ${packCode} to IndexedDB`, e);
    }
}

export async function loadPersistedPacks(lang: string): Promise<Record<string, PersistedPack>> {
    const store = getCardsStore();
    if (!store) return {};
    try {
        await ensureSchema(store);
        const allEntries = await entries<string, PersistedPack>(store);
        const persistedPacks: Record<string, PersistedPack> = {};
        const langPrefix = `${PACK_KEY_PREFIX}${lang}:`;
        for (const [key, value] of allEntries) {
            if (typeof key !== 'string' || !key.startsWith(langPrefix)) continue;
            const packCode = key.slice(langPrefix.length);
            if (!value || !Array.isArray(value.cards)) continue;
            persistedPacks[packCode] = value;
        }
        return persistedPacks;
    } catch (e) {
        console.error('Error loading cards from IndexedDB', e);
        return {};
    }
}

export async function deletePackCards(lang: string, packCode: string): Promise<void> {
    const store = getCardsStore();
    if (!store) return;
    try {
        await del(packKey(lang, packCode), store);
    } catch (e) {
        console.error(`Error deleting cards for pack ${packCode} from IndexedDB`, e);
    }
}

export async function clearPersistedCards(): Promise<void> {
    const store = getCardsStore();
    if (!store) return;
    try {
        await clear(store);
    } catch (e) {
        console.error('Error clearing cards from IndexedDB', e);
    }
}
