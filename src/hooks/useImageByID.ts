// src/hooks/useImageByID.ts
import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface ImageItem {
  id: number;
  title: string;
  img_url: string;
  category: string;
  tags?: string[];
  description?: string;
  likeUser?: number[];
  author?: { name: string };
}

export const useImageByID = (id: string | undefined) => {
  const { data, error, isLoading } = useSWR<ImageItem>(
    id ? `/api/images/${id}` : null,
    fetcher
  );

  // Hàm like / unlike
  const updateLike = async (userId: number) => {
    if (!id) return;
    try {
      await fetch(`/api/images/${id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      mutate(`/api/images/${id}`); // refetch sau khi like
    } catch (err) {
      console.error(err);
    }
  };

  return { item: data, error, isLoading, updateLike, mutateItem: () => mutate(`/api/images/${id}`) };
};
