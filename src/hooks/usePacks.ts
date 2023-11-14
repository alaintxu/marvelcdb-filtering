import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";


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

const usePacks = () => {
  // @ToDo: change to fetch API and get base_path as parameter
  const [packs, setGames] = useState<Pack[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    apiClient.get<Pack[]>('/packs/', { signal: controller.signal})
      .then(res => setGames(res.data))
      .catch(err => {
        if (err instanceof CanceledError) return;
        setError(err.messge)
      })
    return () => controller.abort()
  }, []);
  return { packs, error };
}

export default usePacks;