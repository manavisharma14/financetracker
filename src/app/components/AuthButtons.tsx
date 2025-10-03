"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        {/* Show profile image if available */}
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full border"
          />
        )}
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="px-4 py-2 text-sm font-medium bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
    >
      Sign In
    </button>
  );
}