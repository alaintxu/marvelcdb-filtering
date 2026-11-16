import { Controller,
  Control,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as stylex from '@stylexjs/stylex';
import { MCCard } from "../../store/entities/cards";

import { filterUpdated, selectFilterValues } from "../../store/ui/filters";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import IconForConcept from "../IconForConcept";
import { ui } from "../../styles/ui";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";

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
    <div key={`filter_${fieldCode}`} {...stylex.props(ui.fieldGroup)}>
      <label {...stylex.props(ui.fieldLabel)}>
        {t(fieldCode)}
      </label>
      <Controller
        name={fieldCode}
        control={control}
        defaultValue={storeValue}
        render={() => (
          <SegmentedControl
            label={t(fieldCode)}
            layout="fill"
            value={choices.find((choice) => choice.checked)?.value ?? "disabled"}
            onChange={(value) => choices.find((choice) => choice.value === value)?.onSelect()}
          >
            {choices.map((choice) => (
              <SegmentedControlItem
                key={choice.id}
                value={choice.value}
                label={t(choice.titleKey)}
                isLabelHidden
                icon={<IconForConcept concept={choice.concept} />}
              />
            ))}
          </SegmentedControl>
        )}
      />
    </div>
  );
};

export default BooleanFilterRedux;
