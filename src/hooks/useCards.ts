import { useEffect, useMemo, useState } from "react";

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
  { name: "traits", type: "multiselect", value_name: "traits", dotted: true },
  { name: "faction_code", type: "multiselect", value_name: "faction_name" },
  // { name: "faction_name", type: "multiselect", key_name: "faction_code" },
  { name: "pack_code", type: "multiselect", value_name: "pack_name" },
  // { name: "pack_name", type: "multiselect", key_name: "pack_code" },
  { name: "type_code", type: "multiselect", value_name: "type_name" },
  // { name: "type_name", type: "multiselect", key_name: "type_code" },
  { name: "card_set_code", type: "multiselect", value_name: "card_set_name" },
  // { name: "card_set_name", type: "multiselect", key_name: "card_set_code" },
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

export type UniqueFilterOptions = {
  fieldName: keyof MCCard,
  fieldValueName: keyof MCCard,
  options: Map<string, string>
}

function initializeCards(): MCCard[] {
  return JSON.parse(localStorage.getItem('cards') || "[]") as MCCard[];
}


const useCards = () => {
  const [cards, setCards] = useState<MCCard[]>(initializeCards);

  const uniqueFilterOptions: UniqueFilterOptions[] = useMemo(() => {
    // Get all multiselect fields
    const multiselectFields = MCCardFilterableFields.filter((field) => field.type === "multiselect");

    const options = multiselectFields.map((field) => {
      const key = field.name as keyof MCCard;
      const value = field.value_name as keyof MCCard;

      const uniqueValuesMap = new Map<string, string>();
      cards.forEach((card) => {
        const keyValue = card[key] as string;
        const valueValue = card[value] as string;
        if (keyValue && valueValue){
          if (field.dotted) {
            const splittedValues = valueValue.split(". ");
            splittedValues.forEach((splittedValue) => {
              if(splittedValue.endsWith(".")) {
                //splittedValue = splittedValue + ".";
                splittedValue = splittedValue.slice(0, -1);
              }
              uniqueValuesMap.set(splittedValue, splittedValue);
            });
          } else {
            uniqueValuesMap.set(keyValue, valueValue);
          }
        }
      });

      // Convert the Map to an array, sort it by the values, and convert it back to a Map
      const sortedUniqueValuesMap = new Map(
        Array.from(uniqueValuesMap.entries()).sort((a, b) => a[1].localeCompare(b[1]))
      );

      //
      return {
        fieldName: key, 
        fieldValueName: value, 
        options: sortedUniqueValuesMap
      };
    });

    return options;
  }, [cards]);
  
  /*const filteredCards = useMemo(() => {
    
  }, [cards, filters]);*/

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);
  
  return { cards, setCards, uniqueFilterOptions };
}

export default useCards;