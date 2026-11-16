import { useTranslation } from "react-i18next";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as stylex from '@stylexjs/stylex';

import { paginationElementsPerPageUpdated, selectPaginationElementsPerPage } from "../../store/ui/pagination";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import IconForConcept, { IconType } from "../IconForConcept";
import { ui } from "../../styles/ui";
import { InputGroup, InputGroupText } from "@astryxdesign/core/InputGroup";
import { NumberInput } from "@astryxdesign/core/NumberInput";


type Props = {
  title?: string,
  iconType?: IconType
}

const PaginationElementsPerPageFilter = ({title, iconType}: Props) => {
  const { t } = useTranslation('global');
  if(!title) title = t('elements_per_page');

  const elementsPerPage = useAppSelector(selectPaginationElementsPerPage);

  const dispatch = useAppDispatch();



  const { control } = useForm();

  if(!elementsPerPage) return <div>Loading...</div>;

  return (
    <form {...stylex.props(ui.mb4)}>
      <InputGroup label={title} isLabelHidden>
        <InputGroupText>
          {iconType ? React.createElement(iconType) : <IconForConcept concept="numbers" />} {title}
        </InputGroupText>
        <Controller
          control={control}
          name="elementsPerPage"
          render={({ field }) => (
            <NumberInput
              id="input-elements-per-page"
              label={title}
              isLabelHidden
              min={1}
              step={1}
              value={field.value ?? elementsPerPage}
              onChange={(value) => {
                dispatch(paginationElementsPerPageUpdated(value));
              }}
            />
          )}
        />
      </InputGroup>
    </form>
  )
}

export default PaginationElementsPerPageFilter
