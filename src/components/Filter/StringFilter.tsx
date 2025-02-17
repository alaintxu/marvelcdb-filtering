import {
    Controller,
    Control,
  } from "react-hook-form";
  import { useTranslation } from "react-i18next";
  import { MCCard } from "../../store/cards";
  
  interface Props {
    control: Control<MCCard>;
    fieldName: keyof MCCard;
  }
  
  const getQueryParamStringValue = (fieldName: string): string => {
    const urlParams = new URLSearchParams(window.location.search);
    const str = urlParams.get(fieldName);
    return str ? str : "";
  }
  
  const StringFilter = ({ control, fieldName }: Props) => {
    const defaultValue = getQueryParamStringValue(fieldName);
    const { t } = useTranslation("filters");
    
    return (
      <div key={`filter_${fieldName}`} className="mb-3 form-group">
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
        <div className="btn-group" role="group" aria-label={t(fieldName)}>
          <Controller
            name={fieldName}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
                <input
                  className="form-control"
                  type="text"
                  id={`filter_${fieldName}_text`}
                  checked={field.value === undefined}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
            )}
          />
        </div>
      </div>
    );
  };
  
  export default StringFilter;
  