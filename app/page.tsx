import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Timeline from "@/components/Timeline";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <>
      <Navbar userName={session.user?.name ?? ""} />
      <main className="farm-shell space-y-4">
        <Timeline userId={session.user?.id as string} />
      </main>
    </>
  );
}
