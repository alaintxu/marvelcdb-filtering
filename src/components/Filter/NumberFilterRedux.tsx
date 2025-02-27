import {
  Controller,
  Control,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MCCard } from "../../store/entities/cards";
import { AppDispatch } from "../../store/configureStore";
import { useDispatch, useSelector } from "react-redux";
import { filterUpdated, selectFilterValues } from "../../store/ui/filters";
import IconForConcept from "../IconForConcept";

interface Props {
  control: Control<MCCard>;
  fieldCode: keyof MCCard;
}

const NumberFilterRedux = ({ control, fieldCode }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const storeValue = useSelector(selectFilterValues("number", fieldCode)) as number | undefined;
  const { t } = useTranslation("filters");

  return (
    <div key={`filter_${fieldCode}`} className="mb-3 form-group">
      <label
        style={{
          fontSize: "0.75rem",
          fontWeight: "bold",
          lineHeight: "2",
          color: "white",
        }}
      >
        {t(fieldCode)} {storeValue && <>{`(${storeValue.toString()})`}</>}
      </label>
      <br />
      <div className="btn-group" role="group" aria-label={t(fieldCode)}>
        <Controller
          name={fieldCode}
          control={control}
          defaultValue={storeValue}
          render={() => (
            <div className="input-group">
              <input
                type="number"
                className="form-control number-filter"
                id={`filter_${fieldCode}_text`}
                value={storeValue?.toString() ?? ""}
                placeholder="-"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  dispatch(filterUpdated({ filterType: "number", fieldCode: fieldCode, values: value }));
                }}
              />
              <button 
                type="button" 
                className="btn btn-outline-danger" 
                onClick={() => {
                    dispatch(filterUpdated({ filterType: "number", fieldCode: fieldCode, values: undefined }));
                  }
                } 
                title={t('remove')}>
                <IconForConcept concept="erase" />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default NumberFilterRedux;
