import { MultiSelector } from '@astryxdesign/core/MultiSelector';
import { useTranslation } from "react-i18next";
import { MCCard, selectUniqueFieldOptions } from "../../store/entities/cards";

import { FieldOption, filterUpdated, selectFilterValues } from "../../store/ui/filters";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import * as stylex from '@stylexjs/stylex';
import { ui } from "../../styles/ui";
import { selectPackOptions } from "../../store/entities/packs";
import { selectCardSetOptions } from "../../store/entities/cardSets";
import { selectFactionOptions } from "../../store/entities/factions";
import { selectCardTypeOptions } from "../../store/entities/cardTypes";

interface Props {
  fieldCode: keyof MCCard;
}

const MultiselectFilterNew = ({ fieldCode }: Props) => {
  const dispatch = useAppDispatch();
  const fieldName = fieldCode.replace("code", "name") as keyof MCCard;
  const uniqueFieldCodeNames: FieldOption[] = useAppSelector(
    fieldCode === "pack_code" ? (state) => selectPackOptions(state) :
    fieldCode === "set_code" ? (state) => selectCardSetOptions(state) :
    fieldCode === "faction_code" ? (state) => selectFactionOptions(state) :
    fieldCode === "type_code" ? (state) => selectCardTypeOptions(state) :
    selectUniqueFieldOptions(fieldCode, fieldName)
  );
  const defaultValues = useAppSelector(selectFilterValues("multiselect", fieldCode)) as string[] ?? [];

  // Filter values are stored lower-cased, so normalise the option values once.
  const options = uniqueFieldCodeNames.map((option) => ({
    value: option.value.toLocaleLowerCase(),
    label: option.label,
  }));
  const selectedValues = defaultValues.map((value) => value.toLocaleLowerCase());
  const placeholder = `${options.slice(0, 2).map((option) => option.label).join(', ')}...`;

  const { t } = useTranslation("filters");

  return (
    <div key={`filter_${fieldName}`} {...stylex.props(ui.mb3)}>
      <MultiSelector
        label={t(fieldName)}
        options={options}
        value={selectedValues}
        placeholder={placeholder}
        triggerDisplay="badges"
        maxBadges={3}
        hasSearch
        width="100%"
        onChange={(values) => {
          dispatch(filterUpdated({ filterType: "multiselect", fieldCode, values: values.length > 0 ? values : undefined }));
        }}
      />
    </div>
  );
};

export default MultiselectFilterNew;
