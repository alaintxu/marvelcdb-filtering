import {
  Controller,
  Control,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MCCard } from "../../store/entities/cards";
import { useDispatch, useSelector } from "react-redux";
import { filterUpdated, selectFilterValues } from "../../store/ui/filters";
import { AppDispatch } from "../../store/configureStore";

interface Props {
  control: Control<MCCard>;
  fieldName: keyof MCCard;
}

const StringFilterRedux = ({ control, fieldName }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const storeValue = useSelector(selectFilterValues("string", fieldName)) as string | undefined;
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
          defaultValue={storeValue}
          render={() => (
            <input
              className="form-control"
              type="text"
              id={`filter_${fieldName}_text`}
              checked={storeValue === undefined}
              onChange={(e) => {
                //field.onChange(e.target.value);
                dispatch(filterUpdated({ filterType: "string", fieldName: fieldName, values: e.target.value }));
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default StringFilterRedux;
