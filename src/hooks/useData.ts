
import { useEffect, useState } from "react";

/* eslint-disable  @typescript-eslint/no-explicit-any */
const useData = <T>(baseURL:string, endpoint: string, requestConfig?: RequestInit, deps?: any[]) => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    console.debug("useData", endpoint);
    fetch(baseURL + endpoint, { signal: controller.signal, ...requestConfig })
      .then((res) => res.json() as Promise<T[]>)
      .then((res) => {
        console.log("response", endpoint, res);
        setData(res);

        setError("");
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Do not return error if request is aborted
          setError("");
        } else {
          setError(err.message)
        }
        setData([]);
        setLoading(false);
      })
      .finally(() => setLoading(false));


    return () => controller.abort();
  }, deps ? [...deps] : []);
  
  return { data, error, isLoading };
};

export default useData;
