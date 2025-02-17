import {
    Controller,
    Control,
  } from "react-hook-form";
  import { useTranslation } from "react-i18next";
import { MCCard } from "../../store/cards";
  import { FaTrash } from "react-icons/fa6";
  
  interface Props {
    control: Control<MCCard>;
    fieldName: keyof MCCard;
  }
  
  const getQueryParamNumberValue = (fieldName: string): number | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    const str = urlParams.get(fieldName);
    try {
      return str ? parseInt(str) : undefined;
    } catch (e){
        return undefined;
    }
  }
  
  const NumberFilter = ({ control, fieldName }: Props) => {
    const defaultValue = getQueryParamNumberValue(fieldName);
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
          {t(fieldName)} {defaultValue && <>{`(${defaultValue.toString()})`}</>}
        </label>
        <br />
        <div className="btn-group" role="group" aria-label={t(fieldName)}>
          <Controller
            name={fieldName}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
              <div className="input-group">
                <input
                  type="number"
                  className="form-control number-filter"
                  id={`filter_${fieldName}_text`}
                  onChange={(e) => {
                    try {
                      field.onChange(parseInt(e.target.value));
                    } catch (e) {
                      field.onChange(undefined);
                    }
                  }}
                />
                <button type="button" className="btn btn-outline-danger" onClick={() => field.onChange(undefined)} title={t('remove')}>
                  <FaTrash />
                </button>
              </div>
            )}
          />
        </div>
      </div>
    );
  };
  
  export default NumberFilter;
  