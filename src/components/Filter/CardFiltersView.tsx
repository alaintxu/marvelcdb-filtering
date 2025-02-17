import {
  MCCard,
} from "../../hooks/useCardsQuery";
import { useForm } from "react-hook-form";
import { SelectedFilters } from "../../hooks/useFilters";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import BooleanFilter from "./BooleanFilter";
import StringFilter from "./StringFilter";
import NumberFilter from "./NumberFilter";
import { FaEraser, FaFilter } from "react-icons/fa6";
import { VscSymbolString } from "react-icons/vsc";
import { MdNumbers, MdCheckBox } from "react-icons/md";
import { TbBracketsContain, TbCards } from "react-icons/tb";
import { GoMultiSelect } from "react-icons/go";
import MultiselectFilterNew from "./MultiselectFilterNew";
import { getLanguage } from "../../i18n";
import PaginationElementsPerPageFilter from "./PaginationElementsPerPageFilter";

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

type Props = {
  selectedFilters: SelectedFilters;
  setSelectedFilters: (newSelectedFilters: SelectedFilters) => void;
  uniqueFilterOptions: UniqueFilterOptions[]
};

const CardFiltersView = ({
  selectedFilters, setSelectedFilters,
  uniqueFilterOptions
}: Props) => {
  
  const { t, i18n } = useTranslation("filters");
  const { control, watch, reset } = useForm<MCCard>({
    mode: "onChange",
  });

  const filterFormValues = watch();

  useEffect(() => {
    let newSelectedFilters: SelectedFilters = {};
    for (const [key, value] of Object.entries(filterFormValues)) {
      if (value !== undefined) {
        const filtrableField: FiltrableFieldType = MCCardFilterableFields.find(
          (field) => field.name === key
        ) as FiltrableFieldType;

        switch (filtrableField.type) {
          case "boolean":
            newSelectedFilters[key] = value ? ["true"] : ["false"];
            break;
          case "string":
          default:
            if (value.toString() != "") {
              newSelectedFilters[key] = [value.toString()]
            }            
            break;
        }
      }
    }
    if (
      JSON.stringify(newSelectedFilters) !== JSON.stringify(selectedFilters)
    ) {
      setSelectedFilters(newSelectedFilters);
    }
  }, [filterFormValues, selectedFilters, setSelectedFilters]);

  /*const sortedFields = MCCardFilterableFields.sort((a, b) => {
    // First, compare by type
    const typeComparison = b.type.localeCompare(a.type);
    if (typeComparison !== 0) return typeComparison;

    // If types are the same, then compare by name
    return a.name.localeCompare(b.name);
  });*/

  const booleanFields = MCCardFilterableFields.filter(
    (field) => field.type === "boolean"
  );
  const multiselectFields = MCCardFilterableFields.filter(
    (field) => field.type === "multiselect"
  );
  const containsFields = MCCardFilterableFields.filter(
    (field) => field.type === "contains"
  );
  const stringFields = MCCardFilterableFields.filter(
    (field) => field.type === "string"
  );
  const numberFields = MCCardFilterableFields.filter(
    (field) => field.type === "number"
  );


  return (
    <section id="filters" className="bg-dark shadow d-flex flex-column p-3">
      <h3><FaFilter /> {t('filters')}</h3>
      <PaginationElementsPerPageFilter
          title={t("cards_per_page")}
          iconType={TbCards}
          paginationQueryKeys={["cards", getLanguage(i18n)]}
          />
      <form>
        <details>
            <summary>{t("multiselect_filters_title")} <GoMultiSelect /></summary>
            {multiselectFields.map((field) => {
              const uniqueOptions: UniqueFilterOptions = uniqueFilterOptions.find(
                (filterOptions) => filterOptions.fieldName === field.name
              ) || { fieldName: "wrong!" as keyof MCCard, fieldValueName: "wrong!" as keyof MCCard, options: new Map<string, string>() };
              return (
                <MultiselectFilterNew
                    key={`multiselect_filter_${field.name}`}
                    control={control}
                    uniqueFilterOptions={uniqueOptions}
                />
              );
    })}
        </details>
        <details>
            <summary>{t("contains_filters_title")} <TbBracketsContain /></summary>
            {containsFields.map((field) => (
                <StringFilter
                    key={`contains_filter_${field.name}`}
                    control={control}
                    fieldName={field.name as keyof MCCard}
                />
            ))}
        </details>
        <details>
            <summary>{t("number_filters_title")} <MdNumbers /></summary>
            {numberFields.map((field) => (
                <NumberFilter
                    key={`number_filter_${field.name}`}
                    control={control}
                    fieldName={field.name as keyof MCCard}
                />
            ))}
        </details>
        <details>
            <summary>{t("boolean_filters_title")} <MdCheckBox /></summary>

            {booleanFields.map((field) => (
            <BooleanFilter
                key={`boolean_filter_${field.name}`}
                control={control}
                fieldName={field.name as keyof MCCard}
            />
            ))}
        </details>
        <details>
            <summary>{t("string_filters_title")} <VscSymbolString /></summary>
            {stringFields.map((field) => (
                <StringFilter
                    key={`string_filter_${field.name}`}
                    control={control}
                    fieldName={field.name as keyof MCCard}
                />
            ))}
        </details>
        <button
          type="reset" 
          title={t("reset")}
          className="btn btn-outline-danger mt-3" onClick={() => {
          reset({});
        }}>
          <FaEraser /> {t("reset_filters")}
        </button>
      </form>
    </section>
  );
};

export default CardFiltersView;
