import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/albums/[id]">) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const album = await db.album.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });
  if (!album) return Response.json({ error: "Not found" }, { status: 404 });

  await db.album.update({ where: { id }, data: { deletedAt: new Date() } });
  return Response.json({ ok: true });
}

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/albums/[id]">) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const album = await db.album.findUnique({
    where: { id },
    include: { media: { where: { deletedAt: null }, orderBy: { createdAt: "desc" } } },
  });

  if (!album || album.deletedAt) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(album);
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/albums/[id]">) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();

  const album = await db.album.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });
  if (!album) return Response.json({ error: "Not found" }, { status: 404 });

  // 支持批量添加：media[] 数组，或单个 { url, type, caption }
  if (Array.isArray(body.media)) {
    const created = await db.albumMedia.createManyAndReturn({
      data: body.media.map((m: { url: string; type: string; caption?: string }) => ({
        albumId: id,
        url: m.url,
        type: m.type,
        caption: m.caption,
      })),
    });
    return Response.json(created, { status: 201 });
  }

  const { url, type, caption } = body;
  const media = await db.albumMedia.create({
    data: { albumId: id, url, type, caption },
  });

  return Response.json(media, { status: 201 });
}
