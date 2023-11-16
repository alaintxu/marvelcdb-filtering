import { useEffect, useState } from "react";

export type PackStatus = {
  code: string,
  lastDownload: Date,
  numberOfCards: number
}

const usePackStatusList = () => {
  const [packStatusList, setPackStatusList] = useState<PackStatus[]>(
    JSON.parse(localStorage.getItem('pack_status') || "[]"
  ));
  
  useEffect(() => {
    localStorage.setItem("pack_status", JSON.stringify(packStatusList));
  }, [packStatusList]);
  
  return { packStatusList, setPackStatusList };
}

export default usePackStatusList;