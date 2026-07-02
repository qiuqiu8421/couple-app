import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnniversaryList from "@/components/AnniversaryList";

export default async function AnniversariesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <>
      <Navbar userName={session.user?.name ?? ""} />
      <main className="farm-shell">
        <AnniversaryList />
      </main>
    </>
  );
}
