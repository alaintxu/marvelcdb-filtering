import { MCCard } from "../../store/entities/cards";
import { useForm } from "react-hook-form";
import { SelectedFilters } from "../../hooks/useFilters";
import { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { FaEraser } from "react-icons/fa6";
import { MdNumbers, MdCheckBox } from "react-icons/md";
import { TbBracketsContain, TbCards } from "react-icons/tb";
import { GoMultiSelect } from "react-icons/go";
import PaginationElementsPerPageFilter from "./PaginationElementsPerPageFilter";
import MultiselectFilterRedux from "./MultiselectFilterRedux";
import NumberFilterRedux from "./NumberFilterRedux";
import StringFilterRedux from "./StringFilterRedux";
import BooleanFilterRedux from "./BooleanFilterRedux";

import { 
  resetFilters,
  DOTTED_FILTERS,
  KEY_VALUE_FILTERS, 
  STRING_FILTERS, 
  NUMBER_FILTERS, 
  BOOLEAN_FILTERS, 
  selectNumberOfFiltersByType
} from "../../store/ui/filters";
import IconForConcept from "../IconForConcept";
import NumberOfFiltersBadge from "./NumberOfFiltersBadge";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import DottedMultiselectFilterRedux from "./DottedMultiselectFilterRedux";

export type FiltrableFieldType = {
  name: keyof MCCard,
  type: "string" | "number" | "boolean"
}

export type UniqueFilterOptions = {
  fieldName: keyof MCCard,
  fieldValueName: keyof MCCard,
  options: Map<string, string>
}

type Props = {
  selectedFilters: SelectedFilters;
  setSelectedFilters: (newSelectedFilters: SelectedFilters) => void;
} & HTMLAttributes<HTMLDivElement>;


/* Component */
const CardFiltersView = ({
  selectedFilters, setSelectedFilters,
  ...rest
}: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("filters");
  const { control, reset } = useForm<MCCard>({
    mode: "onChange",
  });

  const dottedFilterNumber = useAppSelector(selectNumberOfFiltersByType("dotted"));
  const multiselectFilterNumber = useAppSelector(selectNumberOfFiltersByType("multiselect"));
  const stringFilterNumber = useAppSelector(selectNumberOfFiltersByType("string"));
  const numberFilterNumber = useAppSelector(selectNumberOfFiltersByType("number"));
  const booleanFilterNumber = useAppSelector(selectNumberOfFiltersByType("boolean"));


  return (
    <section {...rest}>
      {/* Heading */}
      <h3 className="d-flex align-items-center gap-2">
        <IconForConcept concept="filter" />
        {t('filters')}
        <NumberOfFiltersBadge className="ms-auto bg-light text-dark" />
      </h3>

      {/* Pagination filter */}
      <PaginationElementsPerPageFilter
          title={t("cards_per_page")}
          iconType={TbCards}
          />

      {/* Filters */}
      <form className="accordion" id="filterAccordion">
        {/* Multiselect filters */}
        <div className="accordion-item bg-dark">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#multiselectFilterCollapse" 
              aria-expanded="false" 
              aria-controls="multiselectFilterCollapse">
              <span className="badge bg-dark d-inline-flex align-items-center gap-2 me-2">
                <GoMultiSelect />
                {multiselectFilterNumber+dottedFilterNumber > 0 && multiselectFilterNumber+dottedFilterNumber}
              </span>
              {t("multiselect_filters_title")} 
            </button>
          </h2>
          <div 
              id="multiselectFilterCollapse"
              className="accordion-collapse collapse p-4" 
              data-bs-parent="#filterAccordion">

            {DOTTED_FILTERS.map((field_base) => {
              return (
                <DottedMultiselectFilterRedux
                    key={`dotted_filter_${field_base}`}
                    control={control}
                    fieldCode={field_base as keyof MCCard}
                />
              );
            })}
            {KEY_VALUE_FILTERS.map((field_base) => {
              return (
                <MultiselectFilterRedux
                    key={`multiselect_filter_${field_base}`}
                    control={control}
                    fieldCode={`${field_base}code` as keyof MCCard}
                />
              );
            })}
          </div>
        </div>

        {/* String filters */}
        <div className="accordion-item bg-dark">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#accordionStringFilters" 
              aria-expanded="false" 
              aria-controls="accordionStringFilters">
              <span className="badge bg-dark d-inline-flex align-items-center gap-2 me-2">
                <TbBracketsContain />
                {stringFilterNumber > 0 && stringFilterNumber}
              </span>
              {t("contains_filters_title")}
            </button>
          </h2>
          <div 
              id="accordionStringFilters"
              className="accordion-collapse collapse p-4" 
              data-bs-parent="#filterAccordion">
            {STRING_FILTERS.map((fieldCode) => (
                <StringFilterRedux
                    key={`contains_filter_${fieldCode}`}
                    control={control}
                    fieldCode={fieldCode as keyof MCCard}
                />
            ))}
          </div>
        </div>

        {/* Number filters */}
        <div className="accordion-item bg-dark">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#accordionNumberFilters" 
              aria-expanded="false" 
              aria-controls="accordionNumberFilters">
              <span className="badge bg-dark d-inline-flex align-items-center gap-2 me-2">
                <MdNumbers/>
                {numberFilterNumber > 0 && numberFilterNumber}
              </span>
              {t("number_filters_title")}
            </button>
          </h2>
          <div 
              id="accordionNumberFilters"
              className="accordion-collapse collapse p-4" 
              data-bs-parent="#filterAccordion">
            <div className="two-column-grid">
              {NUMBER_FILTERS.map((fieldCode) => (
                  <NumberFilterRedux
                      key={`number_filter_${fieldCode}`}
                      control={control}
                      fieldCode={fieldCode as keyof MCCard}
                  />
              ))}
            </div>
          </div>
        </div>

        {/* Boolean filters */}
        <div className="accordion-item bg-dark">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#accordionBooleanFilters" 
              aria-expanded="false" 
              aria-controls="accordionBooleanFilters">
              <span className="badge bg-dark d-inline-flex align-items-center gap-2 me-2">
                <MdCheckBox />
                {booleanFilterNumber > 0 && booleanFilterNumber}
              </span>
              {t("boolean_filters_title")}
            </button>
          </h2>
          <div 
              id="accordionBooleanFilters"
              className="accordion-collapse collapse p-4" 
              data-bs-parent="#filterAccordion">
                <div className="two-column-grid">
            {BOOLEAN_FILTERS.map((fieldCode) => (
            <BooleanFilterRedux
                key={`boolean_filter_${fieldCode}`}
                control={control}
                fieldCode={fieldCode as keyof MCCard}
            />
            ))}</div>
          </div>
        </div>

        {/* Reset button */}
        <button
          type="reset" 
          title={t("reset")}
          className="btn btn-outline-danger mt-3" onClick={() => {
            dispatch(resetFilters());
            reset();
        }}>
          <FaEraser /> {t("reset_filters")}
        </button>
      </form>
    </section>
  );
};

export default CardFiltersView;
