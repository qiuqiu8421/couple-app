import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const anniversaries = await db.anniversary.findMany({
    orderBy: { date: "asc" },
  });

  return Response.json(anniversaries);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { title, date, description } = await req.json();

  const anniversary = await db.anniversary.create({
    data: { title, date: new Date(date), description },
  });

  return Response.json(anniversary, { status: 201 });
}
