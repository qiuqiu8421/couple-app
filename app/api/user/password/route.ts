import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { oldPassword, newPassword } = await req.json();

  if (!oldPassword || !newPassword) {
    return Response.json({ error: "缺少参数" }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return Response.json({ error: "新密码至少6位" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { id: session.user.id as string } });
  if (!user) return Response.json({ error: "用户不存在" }, { status: 404 });

  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) return Response.json({ error: "原密码错误" }, { status: 400 });

  const hashed = await bcrypt.hash(newPassword, 10);
  await db.user.update({ where: { id: user.id }, data: { password: hashed } });

  return Response.json({ ok: true });
}
