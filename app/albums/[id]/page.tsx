import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import AlbumDetail from "@/components/AlbumDetail";

export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;

  return (
    <>
      <Navbar userName={session.user?.name ?? ""} />
      <main className="farm-shell">
        <AlbumDetail albumId={id} />
      </main>
    </>
  );
}
