import { useState, useEffect } from "react";

export interface ImageItem {
  id: number;
  title: string;
  img_url: string;
  category: string;
  tags: string[];
  description?: string;
  likeUser?: any[];
  author?: { name: string };
}

export function useImages(page?: number, all?: boolean) {
  const [data, setData] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/images?page=${page}`);
        if (!res.ok) throw new Error("Failed to fetch images");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return { data, loading, error };
}
