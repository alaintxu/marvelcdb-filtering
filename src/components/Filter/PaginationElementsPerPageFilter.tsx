import { useTranslation } from "react-i18next";
import usePaginationStatusQuery, { defaultElementsPerPage } from "../../hooks/usePaginationStatusQuery";
import { IconType } from "react-icons";
import { MdNumbers } from "react-icons/md";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";


type Props = {
  title?: string,
  iconType: IconType,
  paginationQueryKeys: string[],
}

const PaginationElementsPerPageFilter = ({title, iconType = MdNumbers, paginationQueryKeys}: Props) => {
  //const queryClient = useQueryClient();
  const { t } = useTranslation('global');
  if(!title) title = t('elements_per_page');
  const { paginationStatus, setElementsPerPageMutation } = usePaginationStatusQuery<any>(paginationQueryKeys);

  const { data: elementsPerPage } = useQuery<number, Error>({ 
    queryKey: ["pagination", "cards", "elementsPerPage"],
    queryFn: () => {
      const storedValue = localStorage.getItem("elementsPerPage");
      return storedValue ? parseInt(storedValue) : defaultElementsPerPage;
    },
    staleTime: Infinity,
  });

  const { control } = useForm();

  if(!elementsPerPage) return <div>Loading...</div>;

  return (  
    <form className="input-group mb-4">
      <label
        className="input-group-text bg-dark text-light"
        htmlFor="input-elements-per-page">
          {/*<TbCards />&nbsp;*/}
          {React.createElement(iconType)} {title}
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
            value={field.value ?? paginationStatus?.elementsPerPage ?? defaultElementsPerPage}
            onChange = { async (e) => {
              await setElementsPerPageMutation(parseInt(e.target.value));
              //await mutateAsync(parseInt(e.target.value));
            }}
          />
        )}
      />
    </form>
  )
}

export default PaginationElementsPerPageFilter

