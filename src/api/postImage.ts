// src/api/ImageApi.ts
export interface ImagePayload {
  title: string;
  img_url?: string;   // URL nếu không upload file
  img_file?: File;    // file nếu upload
  category?: string;
  tags?: string[];
  description?: string;
  author: string | number;
}

export async function postImage(payload: ImagePayload) {
  const formData = new FormData();

  formData.append("title", payload.title);
  if (payload.category) formData.append("category", payload.category);
  if (payload.tags) formData.append("tags", payload.tags.join(","));
  if (payload.description) formData.append("description", payload.description);
  formData.append("author", payload.author.toString());

  if (payload.img_file) {
    formData.append("img", payload.img_file);
    console.log(payload.img_file);
    
  } else if (payload.img_url) {
    formData.append("img_url", payload.img_url);
  } else {
    throw new Error("Image file or URL must be provided");
  }

  const res = await fetch("/api/images", {
    method: "POST",
    body: formData, // fetch tự set multipart/form-data
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to create image");
  }

  return res.json();
}
