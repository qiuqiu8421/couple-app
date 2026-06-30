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
      <main className="max-w-2xl mx-auto px-4 py-6 pb-20 sm:pb-6 space-y-4">
        <Timeline userId={session.user?.id as string} />
      </main>
    </>
  );
}
