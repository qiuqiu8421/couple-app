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
      <main className="max-w-2xl mx-auto px-4 py-6 pb-20 sm:pb-6">
        <AlbumDetail albumId={id} />
      </main>
    </>
  );
}
