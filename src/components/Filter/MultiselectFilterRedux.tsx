import {
  Controller,
  Control,
} from "react-hook-form";
import Select, { GroupBase, OptionsOrGroups } from 'react-select';
import { useTranslation } from "react-i18next";
import { MCCard, selectUniqueFieldOptions } from "../../store/entities/cards";
import { useDispatch, useSelector } from "react-redux";
import { FieldOption, filterUpdated, selectFilterValues } from "../../store/ui/filters";
import { AppDispatch } from "../../store/configureStore";

interface Props {
  control: Control<MCCard>;
  fieldCode: keyof MCCard;
}

const MultiselectFilterNew = ({ control, fieldCode }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const fieldName = fieldCode.replace("code", "name") as keyof MCCard;
  // @ToDo: selectUniqueFieldValues should return Map<string, string> (code, value), now it return code[]
  const uniqueFieldCodeNames: FieldOption[] = useSelector(selectUniqueFieldOptions(fieldCode, fieldName));

  console.log("uniqueFieldCodeNames", uniqueFieldCodeNames);
  const options: OptionsOrGroups<unknown, GroupBase<unknown>> = uniqueFieldCodeNames.map((option: FieldOption) => {
    return { value: option.value, label: option.label };
  });
  //console.log("uniqueFieldValues", uniqueFieldValues);
  const defaultValues = useSelector(selectFilterValues("multiselect", fieldCode)) as string[] ?? [];
  
  const { t } = useTranslation("filters");

  return (
    <div key={`filter_${fieldName}`} className="mb-3">
      <label
        style={{
          fontSize: "0.75rem",
          fontWeight: "bold",
          lineHeight: "2",
          color: "white",
        }}
      >
        {t(fieldName)}
      </label>
      <br />
      <div className="form-group text-dark" role="group" aria-label={t(fieldName)}>
        <Controller
          name={fieldName}
          control={control}
          render={() => (<>
            <Select
              options={options}
              placeholder={`${options.slice(0, 2).map(option => (option as { label: string }).label).join(', ')}...`}
              isMulti
              value={(options as FieldOption[]).filter((option: FieldOption) => defaultValues.includes(option.value))}
              onChange={(selectedOptions: any) => {
                const values = selectedOptions.map((option: any) => option.value.toLocaleLowerCase());

                dispatch(filterUpdated({ filterType: "multiselect", fieldCode: fieldCode, values: values.length > 0 ? values : undefined }));
                //field.onChange(values);
              }} />
          </>
          )}
        />
      </div>
    </div>
  );
};

export default MultiselectFilterNew;
