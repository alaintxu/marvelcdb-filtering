import {
  Controller,
  Control,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MCCard } from "../../store/entities/cards";

import { filterUpdated, selectFilterValues } from "../../store/ui/filters";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import IconForConcept from "../IconForConcept";

interface Props {
  control: Control<MCCard>;
  fieldCode: keyof MCCard;
}

const BooleanFilterRedux = ({ control, fieldCode }: Props) => {
  const dispatch = useAppDispatch();
  const storeValue = useAppSelector(selectFilterValues("boolean", fieldCode)) as boolean | undefined;
  const { t } = useTranslation("filters");
  
  return (
    <div key={`filter_${fieldCode}`}>
      <label
        style={{
          fontSize: "0.75rem",
          fontWeight: "bold",
          lineHeight: "2",
          color: "white",
        }}
      >
        {t(fieldCode)}
        {storeValue === undefined ? <IconForConcept concept="checkboxIndeterminate" className="mb-1 ms-2" /> : storeValue ? <IconForConcept concept="checkbox"  className="mb-1 ms-2" /> : <IconForConcept concept="checkboxOutline"  className="mb-1 ms-2" />}
      </label>
      <br />
      <div className="btn-group" role="group" aria-label={t(fieldCode)}>
        <Controller
          name={fieldCode}
          control={control}
          defaultValue={storeValue}
          render={() => (
            <>
              <input
                type="radio"
                className="btn-check"
                id={`filter_${fieldCode}_disable`}
                value="disabled"
                checked={storeValue === undefined}
                onChange={(e) => {
                  if (e.target.checked) dispatch(filterUpdated({ filterType: "boolean", fieldCode: fieldCode, values: undefined }));
                }}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor={`filter_${fieldCode}_disable`}
                title={t("filter_disabled")}
              >
                <IconForConcept concept="checkboxIndeterminate" />
              </label>
              <input
                type="radio"
                className="btn-check"
                id={`filter_${fieldCode}_false`}
                value="false"
                checked={storeValue === false}
                onChange={(e) => {
                  if (e.target.checked) dispatch(filterUpdated({ filterType: "boolean", fieldCode: fieldCode, values: false }));
                }}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor={`filter_${fieldCode}_false`}
                title={t("filter_false")}
              >
                <IconForConcept concept="checkboxOutline" />
              </label>

              <input
                type="radio"
                className="btn-check"
                id={`filter_${fieldCode}_true`}
                value="true"
                checked={storeValue === true}
                onChange={(e) => {
                  if (e.target.checked) dispatch(filterUpdated({ filterType: "boolean", fieldCode: fieldCode, values: true }));
                }}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor={`filter_${fieldCode}_true`}
                title={t("filter_true")}
              >
                <IconForConcept concept="checkbox" />
              </label>
            </>
          )}
        />
      </div>
    </div>
  );
};

export default BooleanFilterRedux;
