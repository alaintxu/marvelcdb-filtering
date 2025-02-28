import {
  Controller,
  Control,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MCCard } from "../../store/entities/cards";
import { MdCheckBox, MdIndeterminateCheckBox, MdCheckBoxOutlineBlank  } from "react-icons/md";

import { filterUpdated, selectFilterValues } from "../../store/ui/filters";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";

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
        {storeValue === undefined ? <MdIndeterminateCheckBox className="mb-1 ms-2" /> : storeValue ? <MdCheckBox  className="mb-1 ms-2" /> : <MdCheckBoxOutlineBlank  className="mb-1 ms-2" />}
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
                <MdIndeterminateCheckBox />
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
                <MdCheckBoxOutlineBlank />
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
                <MdCheckBox />
              </label>
            </>
          )}
        />
      </div>
    </div>
  );
};

export default BooleanFilterRedux;
