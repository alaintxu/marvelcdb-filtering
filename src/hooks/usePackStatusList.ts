import { useEffect, useState } from "react";

export type PackStatus = {
  code: string,
  lastDownload: Date,
  numberOfCards: number
}

function initializePackStatus(): PackStatus[] {
  return JSON.parse(localStorage.getItem('pack_status') || "[]") as PackStatus[];
}

const usePackStatusList = () => {
  const [packStatusList, setPackStatusList] = useState<PackStatus[]>(initializePackStatus);
  
  useEffect(() => {
    localStorage.setItem("pack_status", JSON.stringify(packStatusList));
  }, [packStatusList]);
  
  return { packStatusList, setPackStatusList };
}

export default usePackStatusList;