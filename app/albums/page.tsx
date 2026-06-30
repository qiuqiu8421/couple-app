import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import AlbumList from "@/components/AlbumList";

export default async function AlbumsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <>
      <Navbar userName={session.user?.name ?? ""} />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-20 sm:pb-6">
        <AlbumList />
      </main>
    </>
  );
}
