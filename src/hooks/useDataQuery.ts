import { useQuery } from "@tanstack/react-query";

/* eslint-disable  @typescript-eslint/no-explicit-any */
const useDataQuery = <T>(baseURL: string, endpoint: string, queryKey: string[], requestConfig?: RequestInit) => {
  const { data, error, isLoading, isFetching } = useQuery<T, Error>({
    queryKey: queryKey,
    queryFn: () => fetch(baseURL+endpoint, requestConfig)
      .then(async res => {
        if(!res.ok) {
          console.error("Error fetching data", res.status);
          throw new Error("Error fetching data: " + res.status);
        }
        return (await res.json()) as T;
      })
      .finally(() => console.debug("useDataQuery fetching finished", endpoint)),
      //queryKeyHashFn: (queryKey) => `${queryKey.join("-")}-${baseURL}-${endpoint}`,
      staleTime: 60 * 60 * 1000, // 1h
    }
  );

  return { data, error, isLoading, isFetching };
};

export default useDataQuery;
