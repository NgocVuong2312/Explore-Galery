import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface ImageItem {
  id: number;
  img_url: string;
  likeUser: number[];
  title: string;
  description: string;
  tag: string[];
  author: { id: number; name: string; email: string };
}

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

const filePath = path.join(
  process.cwd(),
  "/src/app/api/images/data/mockImages.json"
);
const usersFilePath = path.join(
  process.cwd(),
  "/src/app/api/user/data/mockUsers.json"
);
const imageDir = path.join(process.cwd(), "/public/images");

// Tạo thư mục images nếu chưa có
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

function readData(): ImageItem[] {
  try {
    const fileData = fs.readFileSync(filePath, "utf-8").trim();
    return fileData ? JSON.parse(fileData) : [];
  } catch {
    return [];
  }
}

function writeData(data: ImageItem[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readUsers(): User[] {
  return JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
}

// GET /api/images
export async function GET() {
  const images = readData();
  return NextResponse.json(images);
}

// POST /api/images
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString() || "";
    const tag = formData.get("tags")?.toString().split(",") || [];
    const authorId = Number(formData.get("author"));
    const imgFile = formData.get("img") as File | null;
    const imgUrl = formData.get("img_url")?.toString();
    console.log(imgFile);

    const users = readUsers();
    const user = users.find((u) => u.id === authorId);
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    let savedImgUrl = "";
    if (imgFile && imgFile.name) {
      const arrayBuffer = await imgFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = `${Date.now()}_${imgFile.name.replace(/\s+/g, "_")}`;
      const filepath = path.join(imageDir, filename);
      fs.writeFileSync(filepath, buffer);
      savedImgUrl = `/images/${filename}`; // URL client truy cập
    } else if (imgUrl) {
      savedImgUrl = imgUrl;
    } else {
      return NextResponse.json(
        { message: "No image provided" },
        { status: 400 }
      );
    }

    const data = readData();
    const image: ImageItem = {
      id: Date.now(),
      title: title || "Untitled",
      description,
      tag,
      likeUser: [],
      img_url: savedImgUrl,
      author: { id: user.id, name: user.name, email: user.email },
    };

    data.push(image);
    writeData(data);

    return NextResponse.json({ message: "Image added", data: image });
  } catch (err) {
    return NextResponse.json(
      { message: "Upload failed", error: (err as any).message },
      { status: 500 }
    );
  }
}
