import { MCCard } from "../../store/entities/cards";
import { useForm } from "react-hook-form";
import { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
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
import HideDuplicatesFilter from "./HideDuplicatesFilter";
import { selectIsAnyPackDownloading } from "../../store/entities/packs";
import LoadingSpinner from "../LoadingSpinner";
import * as stylex from '@stylexjs/stylex';
import { ui } from "../../styles/ui";

export type FiltrableFieldType = {
  name: keyof MCCard,
  type: "string" | "number" | "boolean"
}

export type UniqueFilterOptions = {
  fieldName: keyof MCCard,
  fieldValueName: keyof MCCard,
  options: Map<string, string>
}

type SelectedFilters = {
  [key: string]: string[]
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

  const isAnyPackDownloading: boolean = useAppSelector(selectIsAnyPackDownloading);
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

  if(isAnyPackDownloading){
    return (
      <section {...rest}>
        <LoadingSpinner />
      </section>
    );
  }


  return (
    <section {...rest}>
      {/* Heading */}
      <h3 {...stylex.props(ui.flex, ui.itemsCenter, ui.gap2)}>
        <IconForConcept concept="filter" />
        {t('filters')}
        <NumberOfFiltersBadge xstyle={[ui.msAuto, ui.badgeLight]} />
      </h3>

      {/* Pagination filter */}
      <PaginationElementsPerPageFilter
          title={t("cards_per_page")}
          />

      {/* Hide duplicates filter */}
      <div {...stylex.props(ui.mb4)}>
        <HideDuplicatesFilter />
      </div>

      {/* Filters */}
      <form id="filterAccordion">
        {/* Multiselect filters */}
        <details className="mc-details" name="filter-accordion">
          <summary>
            <span {...stylex.props(ui.badge, ui.badgeDark, ui.inlineFlex, ui.itemsCenter, ui.gap2, ui.me2)}>
              <IconForConcept concept="multiselect" />
              {multiselectFilterNumber+dottedFilterNumber > 0 && multiselectFilterNumber+dottedFilterNumber}
            </span>
            {t("multiselect_filters_title")}
          </summary>
          <div {...stylex.props(ui.p4)}>
            {DOTTED_FILTERS.map((field_base) => {
              return (
                <DottedMultiselectFilterRedux
                    key={`dotted_filter_${field_base}`}
                    fieldCode={field_base as keyof MCCard}
                />
              );
            })}
            {KEY_VALUE_FILTERS.map((field_base) => {
              return (
                <MultiselectFilterRedux
                    key={`multiselect_filter_${field_base}`}
                    fieldCode={`${field_base}code` as keyof MCCard}
                />
              );
            })}
          </div>
        </details>

        {/* String filters */}
        <details className="mc-details" name="filter-accordion">
          <summary>
            <span {...stylex.props(ui.badge, ui.badgeDark, ui.inlineFlex, ui.itemsCenter, ui.gap2, ui.me2)}>
              <IconForConcept concept="brackets" />
              {stringFilterNumber > 0 && stringFilterNumber}
            </span>
            {t("contains_filters_title")}
          </summary>
          <div {...stylex.props(ui.p4)}>
            {STRING_FILTERS.map((fieldCode) => (
                <StringFilterRedux
                    key={`contains_filter_${fieldCode}`}
                    control={control}
                    fieldCode={fieldCode as keyof MCCard}
                />
            ))}
          </div>
        </details>

        {/* Number filters */}
        <details className="mc-details" name="filter-accordion">
          <summary>
            <span {...stylex.props(ui.badge, ui.badgeDark, ui.inlineFlex, ui.itemsCenter, ui.gap2, ui.me2)}>
              <IconForConcept concept="numbers" />
              {numberFilterNumber > 0 && numberFilterNumber}
            </span>
            {t("number_filters_title")}
          </summary>
          <div {...stylex.props(ui.p4)}>
            <div {...stylex.props(ui.filterStack)}>
              {NUMBER_FILTERS.map((fieldCode) => (
                  <NumberFilterRedux
                      key={`number_filter_${fieldCode}`}
                      control={control}
                      fieldCode={fieldCode as keyof MCCard}
                  />
              ))}
            </div>
          </div>
        </details>

        {/* Boolean filters */}
        <details className="mc-details" name="filter-accordion">
          <summary>
            <span {...stylex.props(ui.badge, ui.badgeDark, ui.inlineFlex, ui.itemsCenter, ui.gap2, ui.me2)}>
              <IconForConcept concept="checkbox" />
              {booleanFilterNumber > 0 && booleanFilterNumber}
            </span>
            {t("boolean_filters_title")}
          </summary>
          <div {...stylex.props(ui.p4)}>
            <div {...stylex.props(ui.filterStack)}>
              {BOOLEAN_FILTERS.map((fieldCode) => (
                <BooleanFilterRedux
                    key={`boolean_filter_${fieldCode}`}
                    control={control}
                    fieldCode={fieldCode as keyof MCCard}
                />
              ))}
            </div>
          </div>
        </details>

        {/* Reset button */}
        <button
          type="reset" 
          title={t("reset")}
          {...stylex.props(ui.button, ui.buttonOutlineDanger, ui.mt3)} onClick={() => {
            dispatch(resetFilters());
            reset();
        }}>
          <IconForConcept concept="erase" /> {t("reset_filters")}
        </button>
      </form>
    </section>
  );
};

export default CardFiltersView;
