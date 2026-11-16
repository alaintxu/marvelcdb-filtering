import { Fragment } from "react";
import {
  Controller,
  Control,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as stylex from '@stylexjs/stylex';
import { MCCard } from "../../store/entities/cards";

import { NumberFilterOperator, NumberFilterState, filterUpdated, selectFilterValues } from "../../store/ui/filters";
import IconForConcept from "../IconForConcept";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { ui } from "../../styles/ui";

interface Props {
  control: Control<MCCard>;
  fieldCode: keyof MCCard;
}

type OperatorConcept = "lessThan" | "equalTo" | "greaterThan";

const OPERATORS: { operator: NumberFilterOperator; concept: OperatorConcept; titleKey: string }[] = [
  { operator: "<", concept: "lessThan", titleKey: "filter_less_than" },
  { operator: "=", concept: "equalTo", titleKey: "filter_equal_to" },
  { operator: ">", concept: "greaterThan", titleKey: "filter_greater_than" },
];

const operatorId = (operator: NumberFilterOperator) =>
  operator === "<" ? "lt" : operator === ">" ? "gt" : "eq";

const NumberFilterRedux = ({ control, fieldCode }: Props) => {
  const dispatch = useAppDispatch();
  const storeValue = useAppSelector(selectFilterValues("number", fieldCode)) as NumberFilterState | undefined;
  const { t } = useTranslation("filters");

  const updateFilter = (value: number | undefined, operator: NumberFilterOperator) => {
    dispatch(filterUpdated({
      filterType: "number",
      fieldCode: fieldCode,
      values: value === undefined ? undefined : { value, operator }
    }));
  };

  return (
    <div key={`filter_${fieldCode}`} {...stylex.props(ui.fieldGroup)}>
      <label {...stylex.props(ui.fieldLabel)}>
        {t(fieldCode)} {storeValue && <>{`(${storeValue.operator} ${storeValue.value})`}</>}
      </label>
      <br />
      <Controller
        name={fieldCode}
        control={control}
        render={() => (
          <Fragment>
            <div {...stylex.props(ui.inputGroup)}>
              <input
                type="number"
                {...stylex.props(ui.formControl, ui.formControlNumber)}
                id={`filter_${fieldCode}_text`}
                value={storeValue?.value.toString() ?? ""}
                placeholder="-"
                onChange={(e) => {
                  const raw = e.target.value;
                  updateFilter(raw === "" ? undefined : Number(raw), storeValue?.operator ?? "=");
                }}
              />
              <button
                type="button"
                {...stylex.props(ui.button, ui.buttonOutlineDanger)}
                onClick={() => updateFilter(undefined, storeValue?.operator ?? "=")}
                title={t('remove')}>
                <IconForConcept concept="erase" />
              </button>
            </div>
            <div {...stylex.props(ui.flex, ui.justifyCenter, ui.mt1)}>
              <div {...stylex.props(ui.buttonGroup)} role="group" aria-label={t(fieldCode)}>
                {OPERATORS.map(({ operator, concept, titleKey }) => (
                  <Fragment key={`filter_${fieldCode}_op_${operatorId(operator)}`}>
                    <input
                      type="radio"
                      {...stylex.props(ui.radioInput)}
                      id={`filter_${fieldCode}_op_${operatorId(operator)}`}
                      checked={storeValue?.operator === operator}
                      onChange={() => updateFilter(storeValue?.value ?? 0, operator)}
                    />
                    <label
                      {...stylex.props(ui.optionButton, storeValue?.operator === operator && ui.optionButtonSelected)}
                      htmlFor={`filter_${fieldCode}_op_${operatorId(operator)}`}
                      title={t(titleKey)}
                    >
                      <IconForConcept concept={concept} />
                    </label>
                  </Fragment>
                ))}
              </div>
            </div>
          </Fragment>
        )}
      />
    </div>
  );
};

export default NumberFilterRedux;
