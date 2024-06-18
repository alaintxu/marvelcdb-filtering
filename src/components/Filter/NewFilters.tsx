import {
  FiltrableFieldType,
  MCCard,
  MCCardFilterableFields,
} from "../../hooks/useCards";
import { useForm } from "react-hook-form";
import { SelectedFilters } from "../../hooks/useFilters";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import BooleanFilter from "./BooleanFilter";
import StringFilter from "./StringFilter";
import NumberFilter from "./NumberFilter";
import { FaEraser, FaFilter } from "react-icons/fa6";
import { VscSymbolString } from "react-icons/vsc";
import { MdNumbers } from "react-icons/md";
import { MdCheckBox } from "react-icons/md";
import MultiselectFilterNew from "./MultiselectFilterNew";

type Props = {
  selectedFilters: SelectedFilters;
  setSelectedFilters: (newSelectedFilters: SelectedFilters) => void;
};

const NewFilters = ({ selectedFilters, setSelectedFilters }: Props) => {
  const { t } = useTranslation("filters");
  console.debug("SelectedFilters", selectedFilters);
  const { control, watch, reset } = useForm<MCCard>({
    mode: "onChange",
  });

  const filterFormValues = watch();

  useEffect(() => {
    console.debug("filterFormValues", filterFormValues);
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
      <form>
        <details>
            <summary>{t("multiselect_filters_title")} <VscSymbolString /></summary>
            {multiselectFields.map((field) => (
                <MultiselectFilterNew
                    control={control}
                    fieldName={field.name as keyof MCCard}
                />
            ))}
        </details>
        <details>
            <summary>{t("contains_filters_title")} <VscSymbolString /></summary>
            {containsFields.map((field) => (
                <StringFilter
                    control={control}
                    fieldName={field.name as keyof MCCard}
                />
            ))}
        </details>
        <details>
            <summary>{t("string_filters_title")} <VscSymbolString /></summary>
            {stringFields.map((field) => (
                <StringFilter
                    control={control}
                    fieldName={field.name as keyof MCCard}
                />
            ))}
        </details>
        <details>
            <summary>{t("number_filters_title")} <MdNumbers /></summary>
            {numberFields.map((field) => (
                <NumberFilter
                    control={control}
                    fieldName={field.name as keyof MCCard}
                />
            ))}
        </details>
        <details>
            <summary>{t("boolean_filters_title")} <MdCheckBox /></summary>

            {booleanFields.map((field) => (
            <BooleanFilter
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

export default NewFilters;
