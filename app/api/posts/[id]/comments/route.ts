import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/posts/[id]/comments">) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const post = await db.post.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });

  const comments = await db.comment.findMany({
    where: { postId: id },
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  return Response.json(comments);
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/posts/[id]/comments">) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const { content } = await req.json();

  const post = await db.post.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });

  const comment = await db.comment.create({
    data: { content, authorId: session.user.id as string, postId: id },
    include: { author: { select: { id: true, name: true } } },
  });

  return Response.json(comment, { status: 201 });
}
