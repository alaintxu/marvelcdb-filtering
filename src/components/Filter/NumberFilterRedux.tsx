import {
  Controller,
  Control,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MCCard } from "../../store/entities/cards";
import { FaTrash } from "react-icons/fa6";
import { AppDispatch } from "../../store/configureStore";
import { useDispatch, useSelector } from "react-redux";
import { filterUpdated, selectFilterValues } from "../../store/ui/filters";

interface Props {
  control: Control<MCCard>;
  fieldName: keyof MCCard;
}

const NumberFilterRedux = ({ control, fieldName }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const storeValue = useSelector(selectFilterValues("number", fieldName)) as number | undefined;
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
        {t(fieldName)} {storeValue && <>{`(${storeValue.toString()})`}</>}
      </label>
      <br />
      <div className="btn-group" role="group" aria-label={t(fieldName)}>
        <Controller
          name={fieldName}
          control={control}
          defaultValue={storeValue}
          render={() => (
            <div className="input-group">
              <input
                type="number"
                className="form-control number-filter"
                id={`filter_${fieldName}_text`}
                value={storeValue?.toString() ?? ""}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  dispatch(filterUpdated({ filterType: "number", fieldName: fieldName, values: value }));
                }}
              />
              <button 
                type="button" 
                className="btn btn-outline-danger" 
                onClick={() => {
                    dispatch(filterUpdated({ filterType: "number", fieldName: fieldName, values: undefined }));
                  }
                } 
                title={t('remove')}>
                <FaTrash />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default NumberFilterRedux;
