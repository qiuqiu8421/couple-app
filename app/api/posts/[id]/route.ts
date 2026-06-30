import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(_req: Request, ctx: RouteContext<"/api/posts/[id]">) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  const post = await db.post.findUnique({ where: { id } });
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });
  if (post.deletedAt) return Response.json({ error: "Not found" }, { status: 404 });
  if (post.authorId !== (session.user.id as string)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.post.update({ where: { id }, data: { deletedAt: new Date() } });
  return Response.json({ ok: true });
}
