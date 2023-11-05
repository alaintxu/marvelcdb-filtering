import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";


export interface MCCard {
  pack_code: string,
  pack_name: string,
  type_code: string,
  type_name: string,
  faction_code: string,
  faction_name: string,
  card_set_code: string,
  card_set_name: string,
  card_set_type_name_code: string,
  linked_to_code: string,
  linked_to_name: string,
  position: number,
  set_position?: number,
  code: string,
  name: string,
  real_name: string,
  text?: string,
  real_text?: string,
  quantity?: number,
  hand_size?: number,
  health?: number,
  health_per_hero?: boolean,
  thwart?: number,
  attack?: number,
  defense?: number,
  base_threat_fixed?: boolean,
  escalation_threat_fixed?: boolean,
  threat_fixed?: boolean,
  deck_limit?: number,
  traits?: string,
  real_traits?: string,
  meta?: {
    colors?: string[],
    offset?: string
  },
  flavor?: string,
  is_unique?: boolean,
  hidden?: boolean,
  permanent?: boolean,
  double_sided?: boolean,
  octgn_id?: string,
  url?: string,
  imagesrc?: string,
  linked_card?: {
    linked_card?: MCCard
  }
  spoiler?: number
}

const useCards = (packName: string | undefined) => {
  const [cards, setCards] = useState<MCCard[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    if (packName) {
      apiClient.get<MCCard[]>('/cards/' + packName + '.json', { signal: controller.signal })
        .then(res => setCards(res.data))
        .catch(err => {
          if (err instanceof CanceledError) return;
          setError(err.messge)
        })
      return () => controller.abort()
    }
  }, [packName]);
  return { cards, error };
}

export default useCards;