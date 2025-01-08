import {
    Controller,
    Control,
  } from "react-hook-form";
  import Select from 'react-select';
  import { useTranslation } from "react-i18next";
  import { MCCard, UniqueFilterOptions } from "../../hooks/useCards";
  
  interface Props {
    control: Control<MCCard>;
    uniqueFilterOptions: UniqueFilterOptions;
  }
  
  const getQueryParamStringValue = (fieldName: string): string => {
    const urlParams = new URLSearchParams(window.location.search);
    const str = urlParams.get(fieldName);
    return str ? str : "";
  }
  
  const MultiselectFilterNew = ({ control, uniqueFilterOptions }: Props) => {
    const fieldName = uniqueFilterOptions.fieldName;
    const fieldValueName = uniqueFilterOptions.fieldValueName;
    const defaultValue = getQueryParamStringValue(fieldName);
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
          {t(fieldValueName)}
        </label>
        <br />
        <div className="form-group text-dark" role="group" aria-label={t(fieldName)}>
          <Controller
            name={fieldName}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (<>
              <Select 
                options={Array.from(uniqueFilterOptions.options.entries()).map(([key, value]) => ({ value: key, label: value }))}
                isMulti
                onChange={(selectedOptions: any) => {
                  const values = selectedOptions.map((option: any) => option.value.toLocaleLowerCase());
                  field.onChange(values);
                }}/>
          </>
            )}
          />
        </div>
      </div>
    );
  };
  
  export default MultiselectFilterNew;
  