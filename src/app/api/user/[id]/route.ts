import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "/src/app/api/user/data/mockUsers.json");

function readData() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// ✅ Phải await params
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; 
  const data = readData();
  const user = data.find((u: any) => String(u.id) === id);

  if (!user) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  // Chỉ trả về name và email
  const result = {
    name: user.name,
    email: user.email
  };

  return NextResponse.json(result);
}
