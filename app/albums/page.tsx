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
      <main className="farm-shell">
        <AlbumList />
      </main>
    </>
  );
}
