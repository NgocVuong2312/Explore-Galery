import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useUserByID = (userId?: string | number) => {
  const { data, error, isLoading } = useSWR(
    userId ? `/api/user/${userId}` : null,
    fetcher
  );

  return { data, error, isLoading };
};
