import { useTranslation } from "react-i18next";
import useData from "./useData";

export interface Pack {
  name: string,
  code: string,
  position: number,
  available: string,
  known: number,
  total: number,
  url: string, 
  id: number
}

const useFetchPacks = (
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  deps?: any[]
) => {
  const {t} = useTranslation('global');
  return useData<Pack>(t('base_path')+"/api/public",'/packs/',undefined, deps);
}

export default useFetchPacks
