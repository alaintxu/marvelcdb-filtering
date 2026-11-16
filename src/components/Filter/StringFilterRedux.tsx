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
import { InputGroup } from "@astryxdesign/core/InputGroup";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Button } from "@astryxdesign/core/Button";

interface Props {
  control: Control<MCCard>;
  fieldCode: keyof MCCard;
}

const StringFilterRedux = ({ control, fieldCode }: Props) => {
  const dispatch = useAppDispatch();
  const storeValue = useAppSelector(selectFilterValues("string", fieldCode)) as string | undefined;
  const { t } = useTranslation("filters");

  return (
    <div key={`filter_${fieldCode}`} {...stylex.props(ui.fieldGroup)}>
      <label {...stylex.props(ui.fieldLabel)}>
        {t(fieldCode)}
      </label>
      <div {...stylex.props(ui.wFull)}>
        <Controller
          name={fieldCode}
          control={control}
          defaultValue={storeValue}
          render={() => (
            <InputGroup label={t(fieldCode)} isLabelHidden>
              <TextInput
                id={`filter_${fieldCode}_text`}
                type="text"
                label={t(fieldCode)}
                isLabelHidden
                value={storeValue ?? ""}
                onChange={(value) => {
                  const newValue = value === "" ? undefined : value;
                  dispatch(filterUpdated({ filterType: "string", fieldCode: fieldCode, values: newValue }));
                }}
              />
              <Button
                label={t('remove')}
                isIconOnly
                variant="destructive"
                icon={<IconForConcept concept="erase" />}
                onClick={() => {
                  dispatch(filterUpdated({ filterType: "string", fieldCode: fieldCode, values: undefined }));
                }}
              />
            </InputGroup>
          )}
        />
      </div>
    </div>
  );
};

export default StringFilterRedux;
