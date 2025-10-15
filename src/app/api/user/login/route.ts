import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

const filePath = path.join(process.cwd(), "/src/app/api/user/data/mockUsers.json");

function getUsers(): User[] {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email và password bắt buộc" }, { status: 400 });
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({ error: "Email hoặc password không đúng" }, { status: 401 });
    }

    return NextResponse.json({ userId: user.id });
  } catch (err) {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
