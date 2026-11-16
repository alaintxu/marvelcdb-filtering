import {
  Controller,
  Control,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MCCard } from "../../store/entities/cards";

import { filterUpdated, selectFilterValues } from "../../store/ui/filters";
import IconForConcept from "../IconForConcept";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import * as stylex from '@stylexjs/stylex';
import { ui } from "../../styles/ui";

interface Props {
  control: Control<MCCard>;
  fieldCode: keyof MCCard;
}

const StringFilterRedux = ({ control, fieldCode }: Props) => {
  const dispatch = useAppDispatch();
  const storeValue = useAppSelector(selectFilterValues("string", fieldCode)) as string | undefined;
  const { t } = useTranslation("filters");

  return (
    <div key={`filter_${fieldCode}`} {...stylex.props(ui.fieldGroupInset)}>
      <label {...stylex.props(ui.fieldLabel)}>
        {t(fieldCode)}
      </label>
      <br />
      <div {...stylex.props(ui.buttonGroup, ui.wFull)} role="group" aria-label={t(fieldCode)}>
        <Controller
          name={fieldCode}
          control={control}
          defaultValue={storeValue}
          render={() => (
            <div {...stylex.props(ui.inputGroup)}>
              <input
                {...stylex.props(ui.formControl)}
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
                {...stylex.props(ui.button, ui.buttonOutlineDanger)}

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
