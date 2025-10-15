import { NextResponse } from "next/server";

import fs from "fs";
import path from "path";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

const filePath = path.join(
  process.cwd(),
  "/src/app/api/user/data/mockUsers.json"
);

function readData(): User[] {
  const fileData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileData);
}

// Ghi file JSON
function writeData(data: User[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const users = readData();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const newUser = await request.json();
  const data = readData();

  // Kiểm tra email hoặc name đã tồn tại chưa
  const existingUser = data.find(
    (u) => u.email === newUser.email || u.name === newUser.name
  );

  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists", userExist: true },
      { status: 400 }
    );
  }

  // Nếu chưa tồn tại, tạo user mới
  const user: User = {
    id: Date.now(),
    ...newUser,
  };

  data.push(user);
  writeData(data);

  return NextResponse.json({ message: "User added", data: user });
}
