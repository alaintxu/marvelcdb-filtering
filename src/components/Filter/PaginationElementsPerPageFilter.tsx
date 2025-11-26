import { useTranslation } from "react-i18next";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { paginationElementsPerPageUpdated, selectPaginationElementsPerPage } from "../../store/ui/pagination";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import IconForConcept, { IconType } from "../IconForConcept";


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
    <form className="input-group mb-4">
      <label
        className="input-group-text bg-dark text-light"
        htmlFor="input-elements-per-page">
          {/*<TbCards />&nbsp;*/}
          {iconType ? React.createElement(iconType) : <IconForConcept concept="numbers" />} {title}
      </label>
      <Controller
        control={control}
        name="elementsPerPage"
        render={({ field }) => (
          <input
            {...field}
            type="number"
            className='form-control'
            id="input-elements-per-page"
            min="1"
            step="1"
            value={field.value ?? elementsPerPage}
            onChange = { async (e) => {
              dispatch(paginationElementsPerPageUpdated(parseInt(e.target.value)));
              // await setElementsPerPageMutation(parseInt(e.target.value));
              //await mutateAsync(parseInt(e.target.value));
            }}
          />
        )}
      />
    </form>
  )
}

export default PaginationElementsPerPageFilter

