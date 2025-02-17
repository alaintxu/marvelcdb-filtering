import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { I18N_LANGS, getLanguage } from "../i18n";
import LZString from "lz-string";
import { Pack, PackStatusDict } from "./usePacksQuery";

export type MCCard = {
  attack?: number,
  attack_star?: boolean,
  back_flavor?: string,
  back_text?: string,
  backimagesrc?: string,
  base_threat?: number,
  base_threat_fixed?: boolean,
  card_set_code: string,
  card_set_name: string,
  card_set_type_name_code: string,
  code: string,
  cost?: number,
  defense?: number,
  double_sided?: boolean,
  duplicate_of_code?: string,
  duplicate_of_name?: string,
  escalation_threat_fixed?: boolean,
  faction_code: string,
  faction_name: string,
  flavor?: string,
  hand_size?: number,
  health?: number,
  health_per_hero?: boolean,
  hidden?: boolean,
  imagesrc?: string,
  is_unique?: boolean,
  linked_card?: MCCard,
  linked_to_code: string,
  linked_to_name: string,
  meta?: {
    colors?: string[],
    offset?: string
  },
  name: string,
  octgn_id?: string,
  pack_code: string,
  pack_name: string,
  permanent?: boolean,
  position: number,
  quantity?: number,
  real_name: string,
  real_text?: string,
  real_traits?: string,
  set_position?: number,
  spoiler?: number,
  subname?: string,
  text?: string,
  threat?: number,
  threat_fixed?: boolean,
  thwart?: number,
  thwart_star?: boolean,
  traits?: string,
  type_code: string,
  type_name: string,
  url?: string
}


const useCardsQuery = () => {
  // Remove old localStorage items
  localStorage.removeItem(`cards`);  // Remove old cards, as now cards-<lang> are used.
  localStorage.removeItem(`pack_status`);  // Remove old pack status, not used anymore.

  const queryClient = useQueryClient();

  const {t, i18n} = useTranslation('global');
  const language = getLanguage(i18n);

  /* Methods */
  const saveCardsToLocalStorage = (cards: MCCard[], lang: string = language) => {
    try {
      const jsonString = JSON.stringify(cards);
      const compressed = LZString.compressToUTF16(jsonString);
  
      // Print the difference in size of both strings  
      localStorage.setItem(`cards-${lang}`, compressed);
    }
    catch (e) {
      console.error(`Error saving cards to local storage (${lang})`, cards, e);
    }
  
    queryClient.invalidateQueries({ queryKey: ["cards", lang] });
    queryClient.invalidateQueries({ queryKey: ["downloaded_packs", lang] });
    queryClient.invalidateQueries({ queryKey: ["pack_status", lang] });
  }

  const loadCardsFromLocalStorage = (lang: string = language):MCCard[] => {
    const compressed = localStorage.getItem(`cards-${lang}`);
    if (!compressed) return [];
  
    try {
      const decompressed = LZString.decompressFromUTF16(compressed);
    
      return JSON.parse(decompressed || "[]") as MCCard[];
    } catch (e) {
      console.error(`Error decompressing cards from local storage (${lang})`, e);
      return [];
    }
  }

  /* External queries */
  const { data: packs } = useQuery<Pack[], Error>({
    queryKey: ["packs", language]
  });

  /* Own queries */
  const { data: cards, error: cardsError } = useQuery<MCCard[], Error>({
    queryKey: ["cards", language],
    queryFn: () => loadCardsFromLocalStorage(),
  });

  const { data: downloadedPacks } = useQuery<number, Error>({
    queryKey: ["downloaded_packs", language],
    queryFn: async () => {
      if (!packs) return 0;
      if (!cards) return 0;

      let downloadedPacks = 0;
      for(const pack of packs) {
        const packCard = cards.find((card) => card.pack_code === pack.code);
        if (packCard) downloadedPacks += 1;
      }
      return downloadedPacks;
    }
  });

  const { data: packStatusDict } = useQuery<PackStatusDict, Error>({
    queryKey: ["pack_status", language],
    queryFn: async () => {
      let pack_status_dict = {} as PackStatusDict;
      if (!packs || !cards) return {} as PackStatusDict;
      cards.forEach((card) => {
        if (!pack_status_dict[card.pack_code]) {
          pack_status_dict[card.pack_code] = {
            packCode: card.pack_code,
            numberOfCards: 0,
          };
        }
        pack_status_dict[card.pack_code].numberOfCards += 1;
      });
      return pack_status_dict;
    },
  });

  /* Mutations */
  const { mutateAsync: addPackCardsMutation } = useMutation<MCCard[], Error, string>({
    mutationFn: async (pack_code: string) => {
      // Get the cards from the API
      const url = `${t('base_path')}/api/public/cards/${pack_code}`;
      const res = await fetch(url);
      if(!res.ok) {
        console.error("Error fetching data", res.status);
        throw new Error("Error fetching data: " + res.status);
      }
      return (await res.json()) as MCCard[];
    },
    onSuccess: (newCards, pack_code) => {
        // Get the previous state of the cards
        const existingCards = cards || [];

        // Remove the old cards of the pack (if they exist).
        const filteredCards = existingCards.filter((card) => card.pack_code !== pack_code);

        // Add the new cards to the existing ones
        const updatedCards = [...filteredCards, ...newCards];

        saveCardsToLocalStorage(updatedCards);
    },
    onError: (error, pack_code) => {
        console.error(`Error adding '${pack_code}' pack cards (${language})`, error);
    }
  });

  const { mutateAsync: removePackCardsMutation } = useMutation<MCCard[], Error, string>({
    mutationFn: async (pack_code: string) => {
        const filteredCards = (cards || []).filter((card) => card.pack_code !== pack_code);
        return filteredCards;
    },
    onSuccess: (filteredCards, pack_code) => {
        saveCardsToLocalStorage(filteredCards);
    },
    onError: (error, pack_code) => {
        console.error("Error removing '"+pack_code+"' pack cards", error);
    }
  });

  const {mutateAsync: removeAllCardsMutation} = useMutation<MCCard[], Error, void>({
    mutationFn: async () => {
        return [];
    },
    onSuccess: (emptyCards) => {
        I18N_LANGS.forEach((lang: string) => {
          saveCardsToLocalStorage(emptyCards, lang);
        });
    },
    onError: (error) => {
        console.error("Error removing all cards", error);
    }
  });

  const {mutateAsync: addMultiplePackCardsMutation} = useMutation<MCCard[], Error, string[]>({
    mutationFn: async (pack_codes: string[]) => {
        const filteredCards = (cards || []).filter((card) => !pack_codes.includes(card.pack_code));
        let newCards: MCCard[] = [...filteredCards];
        for(const pack_code of pack_codes) {
            const url = `${t('base_path')}/api/public/cards/${pack_code}`;
            const res = await fetch(url);
            if(!res.ok) {
                console.error("Error fetching data", res.status);
                throw new Error("Error fetching data: " + res.status);
            }
            newCards = [...newCards, ...(await res.json()) as MCCard[]];
        }
        return newCards;
    },
    onSuccess: (newCards) => {
        saveCardsToLocalStorage(newCards);
    },
    onError: (error) => {
        console.error("Error adding multiple pack cards", error);
    }
  });
     
  const { mutateAsync: setCardsMutation } = useMutation<MCCard[], Error, MCCard[]>({
    mutationFn: async (newCards: MCCard[]) => {
        return newCards;
    },
    onSuccess: (newCards) => {
        saveCardsToLocalStorage(newCards);
    },
    onError: (error) => {
        console.error("Error setting cards", error);
    }
  });

  const {mutateAsync: addCardsMutation } = useMutation<MCCard[], Error, MCCard[]>({
    mutationFn: async (newCards: MCCard[]) => {
        const existingCards = cards || [];
        const updatedCards = [...existingCards, ...newCards];
        return updatedCards;
    },
    onSuccess: (updatedCards) => {
        saveCardsToLocalStorage(updatedCards);
    },
    onError: (error) => {
        console.error("Error adding card", error);
    }
  });


  return { 
    cards, 
    cardsError, 
    downloadedPacks, 
    packStatusDict, 
    addPackCardsMutation, 
    removePackCardsMutation, 
    removeAllCardsMutation, 
    addMultiplePackCardsMutation, 
    setCardsMutation, 
    addCardsMutation 
  };
};

export default useCardsQuery;