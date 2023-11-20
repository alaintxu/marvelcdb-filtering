import { useEffect, useState } from "react";


export type MCCard = {
  pack_code: string,
  pack_name: string,
  type_code: string,
  type_name: string,
  faction_code: string,
  faction_name: string,
  duplicate_of_code?: string,
  duplicate_of_name?: string,
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
  subname?: string,
  cost?: number,
  text?: string,
  real_text?: string,
  back_text?: string,
  quantity?: number,
  hand_size?: number,
  health?: number,
  health_per_hero?: boolean,
  thwart?: number,
  attack?: number,
  defense?: number,
  threat?: number,
  base_threat?: number,
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
  back_flavor?: string,
  is_unique?: boolean,
  hidden?: boolean,
  permanent?: boolean,
  double_sided?: boolean,
  octgn_id?: string,
  url?: string,
  imagesrc?: string,
  backimagesrc?: string,
  linked_card?: MCCard,
  spoiler?: number
}



const useCards = () => {
  const [cards, setCards] = useState<MCCard[]>(
    JSON.parse(localStorage.getItem('cards') || "[]") as MCCard[]
  );
  
  /*const filteredCards = useMemo(() => {
    
  }, [cards, filters]);*/

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);
  
  return { cards, setCards };
}

export default useCards;