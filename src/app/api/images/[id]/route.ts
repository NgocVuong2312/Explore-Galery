import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "/src/app/api/images/data/mockImages.json");

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
  const item = data.find((img: any) => String(img.id) === id);

  if (!item) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}
