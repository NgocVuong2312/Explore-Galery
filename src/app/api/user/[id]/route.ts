import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/app/api/user/data/mockUsers.json");

// Khai báo interface cho User
interface User {
  id: number;
  name: string;
  email: string;
  password:string
}

// Đọc dữ liệu từ file JSON
function readData(): User[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent) as User[];
}

// ✅ Phải await params
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = readData();

  const user = data.find((u) => String(u.id) === id);

  if (!user) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  // Chỉ trả về name và email
  const result = {
    name: user.name,
    email: user.email,
  };

  return NextResponse.json(result);
}
