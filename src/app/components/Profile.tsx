// Profile.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-center">You must be logged in to view this page</p>;
  }

  return (
    <div className="text-center bg-[#c3c7f4]/50 rounded-3xl p-8">
      <img src={session.user?.image ?? ""} className="w-24 h-24 rounded-full mx-auto" />
      <p>{session.user?.name}</p>
      <p>{session.user?.email}</p>
    </div>
  );
}