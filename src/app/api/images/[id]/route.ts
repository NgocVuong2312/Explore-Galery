import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "/src/app/api/images/data/mockImages.json");

// Định nghĩa interface cho mỗi ảnh
interface ImageItem {
  id: number;
  img_url: string;
  title: string;
  description: string;
  tags: string[];
  author: {
    id: number;
    name: string;
    email: string;
  };
  likeUser: number[];
}

// Hàm đọc dữ liệu có kiểu rõ ràng
function readData(): ImageItem[] {
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as ImageItem[];
}

// ✅ GET handler
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = readData();

  // So sánh kiểu string để đồng nhất
  const item = data.find((img) => String(img.id) === id);

  if (!item) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}
