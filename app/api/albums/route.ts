import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const albums = await db.album.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { media: { where: { deletedAt: null } } } },
      media: { where: { deletedAt: null }, take: 1, orderBy: { createdAt: "desc" } },
    },
  });

  return Response.json(albums);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description } = await req.json();

  const album = await db.album.create({
    data: { name, description },
  });

  return Response.json(album, { status: 201 });
}
