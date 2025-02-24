import {
  Controller,
  Control,
} from "react-hook-form";
import Select from 'react-select';
import { useTranslation } from "react-i18next";
import { MCCard, selectUniqueFieldValues } from "../../store/entities/cards";
import { useDispatch, useSelector } from "react-redux";
import { filterUpdated, selectFilterValues } from "../../store/ui/filters";

interface Props {
  control: Control<MCCard>;
  fieldName: keyof MCCard;
}

const getQueryParamStringValue = (fieldName: string): string => {
  const urlParams = new URLSearchParams(window.location.search);
  const str = urlParams.get(fieldName);
  return str ? str : "";
}

const MultiselectFilterNew = ({ control, fieldName }: Props) => {
  const dispatch = useDispatch();
  // @ToDo: selectUniqueFieldValues should return Map<string, string> (code, value), now it return code[]
  const uniqueFieldValues = useSelector(selectUniqueFieldValues(fieldName));
  console.log("uniqueFieldValues", uniqueFieldValues);
  const defaultValue = useSelector(selectFilterValues("multiselect", fieldName)) as string[] ?? [];
  
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
          defaultValue={defaultValue as any}
          render={() => (<>
            <Select
              options={uniqueFieldValues.map(([key, value]) => ({ value: key, label: value }))}
              isMulti
              onChange={(selectedOptions: any) => {
                const values = selectedOptions.map((option: any) => option.value.toLocaleLowerCase());
                dispatch(filterUpdated({ filterType: "multiselect", fieldName: fieldName, values: values }));
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
