import {
  Controller,
  Control,
} from "react-hook-form";
import Select, { GroupBase, OptionsOrGroups } from 'react-select';
import { useTranslation } from "react-i18next";
import { MCCard, selectUniqueDottedFieldOptions } from "../../store/entities/cards";

import { FieldOption, filterUpdated, selectFilterValues } from "../../store/ui/filters";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";

interface Props {
  control: Control<MCCard>;
  fieldCode: keyof MCCard;
}

const DottedMultiselectFilterNew = ({ control, fieldCode }: Props) => {
  const dispatch = useAppDispatch();
  const uniqueFieldCodeNames: FieldOption[] = useAppSelector(selectUniqueDottedFieldOptions(fieldCode));

  const options: OptionsOrGroups<unknown, GroupBase<unknown>> = uniqueFieldCodeNames.map((option: FieldOption) => {
    return { value: option.value, label: option.label };
  });
  const defaultValues = useAppSelector(selectFilterValues("dotted", fieldCode)) as string[] ?? [];
  
  const { t } = useTranslation("filters");

  return (
    <div key={`filter_dotted_${fieldCode}}`} className="mb-3">
      <label
        style={{
          fontSize: "0.75rem",
          fontWeight: "bold",
          lineHeight: "2",
          color: "white",
        }}
      >
        {t(fieldCode)}
      </label>
      <br />
      <div className="form-group text-dark" role="group" aria-label={t(fieldCode)}>
        <Controller
          name={fieldCode}
          control={control}
          render={() => (<>
            <Select
              options={options}
              placeholder={`${options.slice(0, 2).map(option => (option as { label: string }).label).join(', ')}...`}
              isMulti
              value={(options as FieldOption[]).filter((option: FieldOption) => defaultValues.includes(option.value))}
              onChange={(selectedOptions: any) => {
                const values = selectedOptions.map((option: any) => option.value.toLocaleLowerCase());

                dispatch(filterUpdated({ filterType: "dotted", fieldCode: fieldCode, values: values.length > 0 ? values : undefined }));
                //field.onChange(values);
              }} />
          </>
          )}
        />
      </div>
    </div>
  );
};

export default DottedMultiselectFilterNew;
