import {
  Controller,
  Control,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as stylex from '@stylexjs/stylex';
import { MCCard } from "../../store/entities/cards";

import { filterUpdated, selectFilterValues } from "../../store/ui/filters";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import IconForConcept from "../IconForConcept";
import { ui } from "../../styles/ui";

interface Props {
  control: Control<MCCard>;
  fieldCode: keyof MCCard;
}

type Choice = {
  id: string;
  value: string;
  checked: boolean;
  concept: "checkboxIndeterminate" | "checkboxOutline" | "checkbox";
  titleKey: string;
  onSelect: () => void;
};

const BooleanFilterRedux = ({ control, fieldCode }: Props) => {
  const dispatch = useAppDispatch();
  const storeValue = useAppSelector(selectFilterValues("boolean", fieldCode)) as boolean | undefined;
  const { t } = useTranslation("filters");

  const choices: Choice[] = [
    {
      id: `filter_${fieldCode}_disable`,
      value: "disabled",
      checked: storeValue === undefined,
      concept: "checkboxIndeterminate",
      titleKey: "filter_disabled",
      onSelect: () => dispatch(filterUpdated({ filterType: "boolean", fieldCode: fieldCode, values: undefined })),
    },
    {
      id: `filter_${fieldCode}_false`,
      value: "false",
      checked: storeValue === false,
      concept: "checkboxOutline",
      titleKey: "filter_false",
      onSelect: () => dispatch(filterUpdated({ filterType: "boolean", fieldCode: fieldCode, values: false })),
    },
    {
      id: `filter_${fieldCode}_true`,
      value: "true",
      checked: storeValue === true,
      concept: "checkbox",
      titleKey: "filter_true",
      onSelect: () => dispatch(filterUpdated({ filterType: "boolean", fieldCode: fieldCode, values: true })),
    },
  ];

  return (
    <div key={`filter_${fieldCode}`}>
      <label {...stylex.props(ui.fieldLabel)}>
        {t(fieldCode)}
        <IconForConcept
          concept={storeValue === undefined ? "checkboxIndeterminate" : storeValue ? "checkbox" : "checkboxOutline"}
          xstyle={[ui.mb1, ui.ms2]}
        />
      </label>
      <br />
      <div {...stylex.props(ui.buttonGroup)} role="group" aria-label={t(fieldCode)}>
        <Controller
          name={fieldCode}
          control={control}
          defaultValue={storeValue}
          render={() => (
            <>
              {choices.map((choice) => (
                <span key={choice.id} {...stylex.props(ui.inlineFlex)}>
                  <input
                    type="radio"
                    {...stylex.props(ui.radioInput)}
                    id={choice.id}
                    value={choice.value}
                    checked={choice.checked}
                    onChange={(e) => {
                      if (e.target.checked) choice.onSelect();
                    }}
                  />
                  <label
                    {...stylex.props(ui.optionButton, choice.checked && ui.optionButtonSelected)}
                    htmlFor={choice.id}
                    title={t(choice.titleKey)}
                  >
                    <IconForConcept concept={choice.concept} />
                  </label>
                </span>
              ))}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default BooleanFilterRedux;
