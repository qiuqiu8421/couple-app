import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(_req: Request, ctx: RouteContext<"/api/albums/[id]/media/[mediaId]">) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { mediaId } = await ctx.params;
  const media = await db.albumMedia.findFirst({
    where: { id: mediaId, deletedAt: null },
    select: { id: true },
  });
  if (!media) return Response.json({ error: "Not found" }, { status: 404 });

  await db.albumMedia.update({ where: { id: mediaId }, data: { deletedAt: new Date() } });
  return Response.json({ ok: true });
}
