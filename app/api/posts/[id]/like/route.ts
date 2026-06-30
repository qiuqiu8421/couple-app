import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(_req: Request, ctx: RouteContext<"/api/posts/[id]/like">) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const userId = session.user.id as string;

  const post = await db.post.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });

  const existing = await db.like.findUnique({
    where: { userId_postId: { userId, postId: id } },
  });

  if (existing) {
    await db.like.delete({ where: { id: existing.id } });
    return Response.json({ liked: false });
  } else {
    await db.like.create({ data: { userId, postId: id } });
    return Response.json({ liked: true });
  }
}
