import {
  Controller,
  Control,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MCCard } from "../../hooks/useCards";
import { MdCheckBox, MdIndeterminateCheckBox, MdCheckBoxOutlineBlank  } from "react-icons/md";

interface Props {
  control: Control<MCCard>;
  fieldName: keyof MCCard;
}

const getQueryParamBooleanValue = (fieldName: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(fieldName);
  return value === "true" ? true : value === "false" ? false : undefined;
}

const BooleanFilter = ({ control, fieldName }: Props) => {
  const defaultValue = getQueryParamBooleanValue(fieldName);
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
        {defaultValue === undefined ? <MdIndeterminateCheckBox className="mb-1 ms-2" /> : defaultValue ? <MdCheckBox  className="mb-1 ms-2" /> : <MdCheckBoxOutlineBlank  className="mb-1 ms-2" />}
      </label>
      <br />
      <div className="btn-group" role="group" aria-label={t(fieldName)}>
        <Controller
          name={fieldName}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <>
              <input
                type="radio"
                className="btn-check"
                id={`filter_${fieldName}_disable`}
                value="disabled"
                checked={field.value === undefined}
                onChange={(e) => {
                  if (e.target.checked) field.onChange(undefined);
                }}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor={`filter_${fieldName}_disable`}
                title={t("filter_disabled")}
              >
                <MdIndeterminateCheckBox />
              </label>
              <input
                type="radio"
                className="btn-check"
                id={`filter_${fieldName}_false`}
                value="false"
                checked={field.value === false}
                onChange={(e) => {
                  if (e.target.checked) field.onChange(false);
                }}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor={`filter_${fieldName}_false`}
                title={t("filter_false")}
              >
                <MdCheckBoxOutlineBlank />
              </label>

              <input
                type="radio"
                className="btn-check"
                id={`filter_${fieldName}_true`}
                value="true"
                checked={field.value === true}
                onChange={(e) => {
                  if (e.target.checked) field.onChange(true);
                }}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor={`filter_${fieldName}_true`}
                title={t("filter_true")}
              >
                <MdCheckBox />
              </label>
            </>
          )}
        />
      </div>
    </div>
  );
};

export default BooleanFilter;
