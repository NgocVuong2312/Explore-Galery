// src/app/api/images/[id]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/app/api/images/data/mockImages.json");

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const { userId } = body;

  const data: any[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const index = data.findIndex((img) => img.id.toString() === id);
  if (index === -1) return NextResponse.json({ error: "Image not found" }, { status: 404 });

  const likeUser = data[index].likeUser || [];
  if (likeUser.includes(userId)) {
    data[index].likeUser = likeUser.filter((uid: number) => uid !== userId); // unlike
  } else {
    data[index].likeUser = [...likeUser, userId]; // like
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return NextResponse.json({ success: true, likeUser: data[index].likeUser });
}
