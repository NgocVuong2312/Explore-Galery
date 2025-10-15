"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postImage } from "@/api/postImage";

export default function CreatePage() {
  interface User {
    userId: number;
    email: string;
  }
  const [author, setAuthor] = useState<User>();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) setAuthor(JSON.parse(currentUser));
  }, []);
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    img_url: "",
    img_file: null as File | null,
    category: "nature",
    tags: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.img_url.trim() && !form.img_file)
      return "Image URL or file is required";
    if (form.img_url) {
      try {
        new URL(form.img_url.trim());
      } catch {
        return "Image URL must be a valid URL";
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);

    setError(null);
    setLoading(true);

    try {
      await postImage({
        title: form.title,
        category: form.category,
        tags: Array.isArray(form.tags)
          ? form.tags
          : form.tags
          ? [form.tags]
          : [],
        description: form.description,
        author: Number(author?.userId),
        img_file: form.img_file || undefined,
        img_url: form.img_url || undefined,
      });

      router.push("/");
    } catch (err) {
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const   handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "file") {
      const file = target.files?.[0] || null;
      setForm((prev) => ({ ...prev, img_file: file }));
    } else {
      const { name, value } = target;
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="max-w-2xl mt-20 mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Đăng ảnh của bạn</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Image URL</label>
          <input
            type="url"
            name="img_url"
            value={form.img_url}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Hoặc tải ảnh lên</label>
          <input
            type="file"
            name="img_file"
            accept="image/*"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {form.img_url && (
          <img
            src={form.img_url}
            alt="Preview"
            className="mt-2 w-full h-48 object-cover rounded-md border"
          />
        )}
        {form.img_file && (
          <img
            src={URL.createObjectURL(form.img_file)}
            alt="Preview"
            className="mt-2 w-full h-48 object-cover rounded-md border"
          />
        )}

        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="nature">Nature</option>
            <option value="art">Art</option>
            <option value="technology">Technology</option>
            <option value="people">People</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Tags (Dùng dấu phẩy chia tags)
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded-md"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
