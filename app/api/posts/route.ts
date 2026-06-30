import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await db.post.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      media: true,
      comments: {
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
      likes: true,
      _count: { select: { likes: true, comments: true } },
    },
  });

  return Response.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { content, media } = await req.json();

  const post = await db.post.create({
    data: {
      content,
      authorId: session.user.id as string,
      media: media?.length
        ? { create: media.map((m: { url: string; type: string }) => ({ url: m.url, type: m.type })) }
        : undefined,
    },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      media: true,
      comments: true,
      likes: true,
      _count: { select: { likes: true, comments: true } },
    },
  });

  return Response.json(post, { status: 201 });
}
