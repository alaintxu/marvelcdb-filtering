import { MultiSelector } from '@astryxdesign/core/MultiSelector';
import { useTranslation } from "react-i18next";
import { MCCard, selectUniqueDottedFieldOptions } from "../../store/entities/cards";

import { FieldOption, filterUpdated, selectFilterValues } from "../../store/ui/filters";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import * as stylex from '@stylexjs/stylex';
import { ui } from "../../styles/ui";

interface Props {
  fieldCode: keyof MCCard;
}

const DottedMultiselectFilterNew = ({ fieldCode }: Props) => {
  const dispatch = useAppDispatch();
  const uniqueFieldCodeNames: FieldOption[] = useAppSelector(selectUniqueDottedFieldOptions(fieldCode));
  const defaultValues = useAppSelector(selectFilterValues("dotted", fieldCode)) as string[] ?? [];

  const options = uniqueFieldCodeNames.map((option) => ({
    value: option.value.toLocaleLowerCase(),
    label: option.label,
  }));
  const selectedValues = defaultValues.map((value) => value.toLocaleLowerCase());
  const placeholder = `${options.slice(0, 2).map((option) => option.label).join(', ')}...`;

  const { t } = useTranslation("filters");

  return (
    <div key={`filter_dotted_${fieldCode}`} {...stylex.props(ui.mb3)}>
      <MultiSelector
        label={t(fieldCode)}
        options={options}
        value={selectedValues}
        placeholder={placeholder}
        triggerDisplay="badges"
        maxBadges={3}
        hasSearch
        width="100%"
        onChange={(values) => {
          dispatch(filterUpdated({ filterType: "dotted", fieldCode, values: values.length > 0 ? values : undefined }));
        }}
      />
    </div>
  );
};

export default DottedMultiselectFilterNew;
