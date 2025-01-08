import {
    Controller,
    Control,
  } from "react-hook-form";
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
        <div className="btn-group" role="group" aria-label={t(fieldName)}>
          <Controller
            name={fieldName}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
              <select
                id={`filter_${fieldName}_multiselect`}
                onChange={(e) => {
                  field.onChange(e.target.value.toLocaleLowerCase());
                }}
                multiple
                >
                  <option value="">{t("all")}</option>
                  {Array.from(uniqueFilterOptions.options.entries()).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                        {key !== value ? ` (${key})` : ""}
                      </option>
                  ))}
              </select>
            )}
          />
        </div>
      </div>
    );
  };
  
  export default MultiselectFilterNew;
  