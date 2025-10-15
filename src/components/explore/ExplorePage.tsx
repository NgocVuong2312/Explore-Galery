"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Image as AntImage } from "antd";
import { useImages, ImageItem } from "@/hooks/useImages";

export default function ExplorePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"latest" | "trending">("latest");
  const [page, setPage] = useState(1);

  // --- fetch data từ hook ---
  const { data, loading: isLoading, error } = useImages(page);

  // --- merge data cho infinite scroll ---
  const [items, setItems] = useState<ImageItem[]>([]);
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setItems((prev) => {
        const merged = [...prev, ...data];
        const unique = merged.filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );
        return unique;
      });
    }
  }, [data]);

  // --- Debounced search ---
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  // --- Infinite scroll observer ---
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting) setPage((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const option = { root: null, rootMargin: "20px", threshold: 0.1 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const removeVietnameseTones = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  // --- Filter, search, sort ---
  const filtered = useMemo(() => {
    let result = [...items];
    if (debouncedQuery)
      result = result.filter((i) =>
        removeVietnameseTones(i.title)
          .toLowerCase()
          .includes(removeVietnameseTones(debouncedQuery).toLowerCase())
      );
    if (category !== "all")
      result = result.filter((i) => i.category === category);
    if (sortBy === "latest") result.sort((a, b) => b.id - a.id);
    else if (sortBy === "trending")
      result.sort((a, b) => (b.likeUser?.length || 0) - (a.likeUser?.length || 0));
    return result;
  }, [items, debouncedQuery, category, sortBy]);

  if (error)
    return <p className="text-center text-red-500">Error loading images</p>;

  return (
    <div className="p-4 mt-20 space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="🔍 Search by title..."
          className="border px-3 py-2 rounded-md w-full sm:w-1/3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex gap-3">
          <select
            className="border px-3 py-2 rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="nature">Nature</option>
            <option value="art">Art</option>
            <option value="technology">Technology</option>
          </select>
          <select
            className="border px-3 py-2 rounded-md"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "latest" | "trending")
            }
          >
            <option value="latest">Latest</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading && items.length === 0 ? (
        <SkeletonGrid />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((img) => (
            <div
              key={img.id}
              className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/item/${img.id}`)}
              onKeyDown={(e) =>
                e.key === "Enter" && router.push(`/item/${img.id}`)
              }
            >
              <AntImage
                src={img.img_url}
                alt={img.title}
                preview={false}
                placeholder={
                  <div className="bg-gray-300 w-full h-48 animate-pulse"></div>
                }
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{img.title}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  {img.description || "Không có mô tả"}
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>👍 {img.likeUser?.length || 0}</span>
                  <span>🏷️ {img.tags || "Không có tag"}</span>
                  <span>✍️ {img.author?.name || "Không có tác giả"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Loader */}
      <div ref={loaderRef} className="h-12 flex justify-center items-center">
        {isLoading && <p className="text-gray-500">Loading more...</p>}
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-xl overflow-hidden shadow">
          <div className="bg-gray-300 h-48 w-full"></div>
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-300 w-3/4"></div>
            <div className="h-3 bg-gray-200 w-5/6"></div>
            <div className="h-3 bg-gray-200 w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
