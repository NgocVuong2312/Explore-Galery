"use client";

import { useParams } from "next/navigation";
import { Image } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useImageByID } from "@/hooks/useImageByID";
import { useImages, ImageItem } from "@/hooks/useImages";


export default function ItemDetailPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Chạy chỉ ở client
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const parsed = JSON.parse(currentUser);
        setUserId(parsed.userId || null);
      } catch (err) {
        console.error("Lỗi parse localStorage:", err);
        setUserId(null);
      }
    }
  }, []);
  const params = useParams();
  const itemDetail = params?.itemDetail as string | undefined;
  const router = useRouter();

  const { item, isLoading, updateLike } = useImageByID(itemDetail);

  // Fetch all items for related images
  const { data: allItems } = useImages()
  const related: ImageItem[] =
  item && allItems
    ? allItems.filter((img: ImageItem) => {
        if (img.id === item.id) return false;
        const sameAuthor = img?.author?.name === item.author?.name;
        const sameCategory = img.category === item.category;
        const sharedTag =
          img.tags &&
          item.tags &&
          img.tags.some((tag) => item.tags?.includes(tag));
        return sameAuthor || sameCategory || sharedTag;
      })
    : [];

  const [optimisticLikes, setOptimisticLikes] = useState<number | null>(null);

  const handleLike = () => {
    if (!item) return;
    if (!userId) return alert("Cần đăng nhập để like");

    const hasLiked = item.likeUser?.includes(Number(userId));
    const newLikeCount = hasLiked
      ? (item.likeUser?.length || 0) - 1
      : (item.likeUser?.length || 0) + 1;

    setOptimisticLikes(newLikeCount);
    updateLike(Number(userId));
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  const likeCount = optimisticLikes ?? item?.likeUser?.length ?? 0;
  const userHasLiked = item?.likeUser?.includes(Number(userId));

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 mt-20">
      {/* --- Image + Info --- */}
      <div className="border rounded-xl shadow-lg overflow-hidden">
        <Image
          src={item?.img_url}
          alt={item?.title}
          preview={false}
          placeholder={<div className="bg-gray-300 w-full h-48 animate-pulse"></div>}
        />
        <div className="p-4 space-y-2">
          <h1 className="text-2xl font-bold">{item?.title}</h1>
          <p className="text-gray-600">{item?.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {item?.tags?.map((tag: string) => (
              <span key={tag} className="text-sm bg-gray-200 px-2 py-1 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <span>✍️ {item?.author?.name}</span>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-1 rounded-md transition ${
                userHasLiked
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              👍 {likeCount}
            </button>
          </div>
        </div>
      </div>

      {/* --- Related Images --- */}
      {related.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-3">CÓ THỂ BẠN QUAN TÂM</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((img: ImageItem) => (
              <div
                key={img.id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/item/${img.id}`)}
              >
                <Image
                  src={img.img_url}
                  alt={img.title}
                  preview={false}
                  placeholder={<div className="bg-gray-300 w-full h-auto animate-pulse"></div>}
                />
                <div className="p-2">
                  <h3 className="font-medium">{img.title}</h3>
                  <p className="text-xs text-gray-500">{img?.author?.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>Không có ảnh liên quan</div>
      )}
    </div>
  );
}
