"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
    >
      Logout
    </button>
  );
}
