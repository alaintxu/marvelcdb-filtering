import { useEffect, useState } from "react";

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

export type FiltrableFieldType = {
  name: keyof MCCard,
  type: "string" | "number" | "boolean"
}
export const MCCardFilterableFields = [
  { name: "cost", type: "number" },
  { name: "thwart", type: "number" },
  { name: "attack", type: "number" },
  { name: "defense", type: "number" },
  { name: "threat", type: "number" },
  { name: "hand_size", type: "number" },
  { name: "health", type: "number" },
  { name: "base_threat", type: "number" },
  { name: "quantity", type: "number" },
  { name: "position", type: "number" },
  { name: "set_position", type: "number" },
  /*{ name: "spoiler", type: "number" },*/
  { name: "is_unique", type: "boolean" },
  { name: "permanent", type: "boolean" },
  { name: "health_per_hero", type: "boolean" },
  { name: "thwart_star", type: "boolean" },
  { name: "attack_star", type: "boolean" },
  { name: "threat_fixed", type: "boolean" },
  { name: "base_threat_fixed", type: "boolean" },
  { name: "hidden", type: "boolean" },
  { name: "double_sided", type: "boolean" },
  { name: "escalation_threat_fixed", type: "boolean" },
  { name: "traits", type: "multiselect" },
  { name: "faction_code", type: "multiselect" },
  { name: "faction_name", type: "multiselect" },
  { name: "pack_code", type: "multiselect" },
  { name: "pack_name", type: "multiselect" },
  { name: "type_code", type: "multiselect" },
  { name: "type_name", type: "multiselect" },
  { name: "card_set_code", type: "multiselect" },
  { name: "card_set_name", type: "multiselect" },
  { name: "duplicate_of_code", type: "string" },
  { name: "duplicate_of_name", type: "string" },
  { name: "card_set_type_name_code", type: "string" },
  { name: "back_flavor", type: "string" },
  { name: "back_text", type: "string" },
  { name: "backimagesrc", type: "string" },
  { name: "code", type: "string" },
  { name: "flavor", type: "string" },
  /*{ name: "imagesrc", type: "string" },*/
  /* ToDo: Manage this field */
  /*{ name: "linked_card", type: "MCCard" },*/
  { name: "linked_to_code", type: "string" },
  { name: "linked_to_name", type: "string" },
  { name: "octgn_id", type: "string" },
  { name: "name", type: "contains" },
  { name: "real_name", type: "contains" },
  { name: "text", type: "contains" },
  { name: "real_text", type: "contains" },
  { name: "real_traits", type: "string" },
  { name: "subname", type: "contains" },
  /*{ name: "url", type: "string" }*/
];




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