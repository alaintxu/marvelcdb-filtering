import { useTranslation } from "react-i18next";
import useDataQuery from "./useDataQuery";
import { Pack } from "../store/entities/packs";

const usePacksQuery = () => {
  const {t, i18n} = useTranslation('global');

  const baseURL = `${t('base_path')}/api/public`;
  const endpoint = '/packs/';
  const queryKey = ["packs", i18n.language];

  const {
    data: packs,
    error: packsError,
    isLoading: arePacksLoading,
    isFetching: arePacksFetching
  } = useDataQuery<Pack[]>(
    baseURL,
    endpoint,
    queryKey,
    undefined, // requestConfig
  );

  return { packs, packsError, arePacksLoading, arePacksFetching };
}

export default usePacksQuery
