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
import { InputGroup } from "@astryxdesign/core/InputGroup";
import { NumberInput } from "@astryxdesign/core/NumberInput";
import { Button } from "@astryxdesign/core/Button";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";

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
      <Controller
        name={fieldCode}
        control={control}
        render={() => (
          <Fragment>
            <InputGroup label={t(fieldCode)} isLabelHidden>
              <NumberInput
                label={t(fieldCode)}
                isLabelHidden
                hasNumberSteppers
                placeholder="-"
                value={storeValue?.value ?? null}
                onChange={(value) => updateFilter(value ?? undefined, storeValue?.operator ?? "=")}
              />
              <Button
                label={t('remove')}
                isIconOnly
                variant="destructive"
                icon={<IconForConcept concept="erase" />}
                onClick={() => updateFilter(undefined, storeValue?.operator ?? "=")}
              />
            </InputGroup>
            <div {...stylex.props(ui.mt2)}>
              <SegmentedControl
                label={t(fieldCode)}
                layout="fill"
                value={storeValue?.operator ?? ""}
                onChange={(operator) => updateFilter(storeValue?.value ?? 0, operator as NumberFilterOperator)}
              >
                {OPERATORS.map(({ operator, concept, titleKey }) => (
                  <SegmentedControlItem
                    key={operator}
                    value={operator}
                    label={t(titleKey)}
                    isLabelHidden
                    icon={<IconForConcept concept={concept} />}
                  />
                ))}
              </SegmentedControl>
            </div>
          </Fragment>
        )}
      />
    </div>
  );
};

export default NumberFilterRedux;
