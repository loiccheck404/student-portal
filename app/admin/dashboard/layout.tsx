"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" || session?.user?.role !== "admin") {
      router.push("/admin/login");
    }
  }, [status, session, router]);

  if (status === "loading" || session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg w-64 transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-sm text-gray-600 mt-1">
            {session?.user?.name || "Administrator"}
          </p>
        </div>

        <nav className="px-4 space-y-2">
          <Link
            href="/admin/dashboard"
            onClick={() => setIsSidebarOpen(false)}
            className="block px-4 py-3 rounded-md hover:bg-gray-100 text-gray-700"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/dashboard/students"
            onClick={() => setIsSidebarOpen(false)}
            className="block px-4 py-3 rounded-md hover:bg-gray-100 text-gray-700"
          >
            👥 Students
          </Link>
          <Link
            href="/admin/dashboard/hostel"
            onClick={() => setIsSidebarOpen(false)}
            className="block px-4 py-3 rounded-md hover:bg-gray-100 text-gray-700"
          >
            🏢 Hostel Applications
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 p-6">{children}</div>
    </div>
  );
}
