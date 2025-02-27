import {
  Controller,
  Control,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MCCard } from "../../store/entities/cards";
import { useDispatch, useSelector } from "react-redux";
import { filterUpdated, selectFilterValues } from "../../store/ui/filters";
import { AppDispatch } from "../../store/configureStore";
import IconForConcept from "../IconForConcept";

interface Props {
  control: Control<MCCard>;
  fieldCode: keyof MCCard;
}

const StringFilterRedux = ({ control, fieldCode }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const storeValue = useSelector(selectFilterValues("string", fieldCode)) as string | undefined;
  const { t } = useTranslation("filters");

  return (
    <div key={`filter_${fieldCode}`} className="mb-3 form-group px-4">
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
      <div className="btn-group w-100" role="group" aria-label={t(fieldCode)}>
        <Controller
          name={fieldCode}
          control={control}
          defaultValue={storeValue}
          render={() => (
            <div className="input-group">
              <input
                className="form-control"
                type="text"
                id={`filter_${fieldCode}_text`}
                value={storeValue ?? ""}
                onChange={(e) => {
                  //field.onChange(e.target.value);
                  const newValue = e.target.value === "" ? undefined : e.target.value;
                  dispatch(filterUpdated({ filterType: "string", fieldCode: fieldCode, values: newValue }));
                }}
              />
              <button 
                type="button" 
                className="btn btn-outline-danger" 
                onClick={() => {
                    dispatch(filterUpdated({ filterType: "string", fieldCode: fieldCode, values: undefined }));
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

export default StringFilterRedux;
