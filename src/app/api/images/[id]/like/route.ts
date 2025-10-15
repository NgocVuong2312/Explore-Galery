import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface ImageItem {
  id: number;
  likeUser: number[];
  img_url: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
}

const filePath = path.join(process.cwd(), "src/app/api/images/data/mockImages.json");

// đọc dữ liệu JSON
function readData(): ImageItem[] {
  const fileData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileData);
}

// ghi dữ liệu JSON
function writeData(data: ImageItem[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "userId is required" }, { status: 400 });
  }

  const images = readData();
  const imgIndex = images.findIndex((img) => img.id === Number(id));

  if (imgIndex === -1) {
    return NextResponse.json({ message: "Image not found" }, { status: 404 });
  }

  const likeUsers = images[imgIndex].likeUser || [];

  if (likeUsers.includes(userId)) {
    // nếu đã like → bỏ ra
    images[imgIndex].likeUser = likeUsers.filter((u) => u !== userId);
  } else {
    // nếu chưa like → thêm vào
    images[imgIndex].likeUser?.push(userId);
  }

  writeData(images);

  return NextResponse.json({ likeUser: images[imgIndex].likeUser });
}
