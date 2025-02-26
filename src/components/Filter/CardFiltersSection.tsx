import { MCCard } from "../../store/entities/cards";
import { useForm } from "react-hook-form";
import { SelectedFilters } from "../../hooks/useFilters";
import { useEffect, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import StringFilter from "./StringFilter";
import { FaEraser, FaFilter } from "react-icons/fa6";
import { VscSymbolString } from "react-icons/vsc";
import { MdNumbers, MdCheckBox } from "react-icons/md";
import { TbBracketsContain, TbCards } from "react-icons/tb";
import { GoMultiSelect } from "react-icons/go";
import PaginationElementsPerPageFilter from "./PaginationElementsPerPageFilter";
import MultiselectFilterRedux from "./MultiselectFilterRedux";
import NumberFilterRedux from "./NumberFilterRedux";
import StringFilterRedux from "./StringFilterRedux";
import BooleanFilterRedux from "./BooleanFilterRedux";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/configureStore";
import { resetFilters } from "../../store/ui/filters";

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
} & HTMLAttributes<HTMLDivElement>;


/* Component */
const CardFiltersView = ({
  selectedFilters, setSelectedFilters,
  uniqueFilterOptions,
  ...rest
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("filters");
  const { control, watch } = useForm<MCCard>({
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

        switch (filtrableField?.type) {
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
    <section {...rest}>
      <h3><FaFilter /> {t('filters')}</h3>
      <PaginationElementsPerPageFilter
          title={t("cards_per_page")}
          iconType={TbCards}
          />
      <form>
        <details>
            <summary>{t("multiselect_filters_title")} (redux) <GoMultiSelect /></summary>
            {multiselectFields.map((field) => {
              return (
                <MultiselectFilterRedux
                    key={`multiselect_filter_${field.name}`}
                    control={control}
                    fieldName={field.name as keyof MCCard}
                />
              );
            })}
        </details>
        <details>
            <summary>{t("contains_filters_title")} (redux) <TbBracketsContain /></summary>
            {containsFields.map((field) => (
                <StringFilterRedux
                    key={`contains_filter_${field.name}`}
                    control={control}
                    fieldName={field.name as keyof MCCard}
                />
            ))}
        </details>

        <details>
            <summary>{t("number_filters_title")} (redux) <MdNumbers /></summary>
            {numberFields.map((field) => (
                <NumberFilterRedux
                    key={`number_filter_${field.name}`}
                    control={control}
                    fieldName={field.name as keyof MCCard}
                />
            ))}
        </details>
        <details>
            <summary>{t("boolean_filters_title")} (redux) <MdCheckBox /></summary>

            {booleanFields.map((field) => (
            <BooleanFilterRedux
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
            dispatch(resetFilters());
          //reset({});
        }}>
          <FaEraser /> {t("reset_filters")}
        </button>
      </form>
    </section>
  );
};

export default CardFiltersView;
