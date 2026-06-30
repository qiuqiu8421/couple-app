import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

async function saveFile(file: File): Promise<{ url: string; type: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  const type = file.type.startsWith("video") ? "video" : "image";
  return { url: `/uploads/${filename}`, type };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();

  // 支持批量上传：files[] 多文件，或 file 单文件（向后兼容）
  const files = formData.getAll("files") as File[];
  if (files.length > 0) {
    const results = await Promise.all(files.map(saveFile));
    return Response.json(results);
  }

  const file = formData.get("file") as File;
  if (!file) return Response.json({ error: "No file" }, { status: 400 });

  const result = await saveFile(file);
  return Response.json(result);
}
