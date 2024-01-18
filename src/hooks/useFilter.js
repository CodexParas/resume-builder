import { useQuery } from "react-query";

export const useFilter = () => {
  const { data, isError, isLoading, refetch } = useQuery(
    "globalFilter",
    () => ({
      searchTerm: "",
    }),
    { refetchOnWindowFocus: false }
  );
  return { data, isError, isLoading, refetch };
};
