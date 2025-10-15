// src/app/api/images/[id]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Định nghĩa kiểu dữ liệu ảnh
interface ImageItem {
  id: number;
  img_url: string;
  title: string;
  description: string;
  tag: string[];
  author: {
    id: number;
    name: string;
    email: string;
  };
  likeUser: number[];
}

const filePath = path.join(process.cwd(), "src/app/api/images/data/mockImages.json");

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const { userId } = body;

  // ✅ Đọc file và parse dữ liệu đúng kiểu
  const data: ImageItem[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // ✅ Tìm ảnh có id tương ứng
  const index = data.findIndex((img) => img.id.toString() === id);
  if (index === -1) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  // ✅ Đảm bảo mảng likeUser tồn tại
  const likeUser = data[index].likeUser ?? [];

  // ✅ Toggle like
  if (likeUser.includes(userId)) {
    data[index].likeUser = likeUser.filter((uid) => uid !== userId); // unlike
  } else {
    data[index].likeUser = [...likeUser, userId]; // like
  }

  // ✅ Ghi lại file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return NextResponse.json({ success: true, likeUser: data[index].likeUser });
}
