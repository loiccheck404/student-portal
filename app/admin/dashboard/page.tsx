"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  totalStudents: number;
  pendingHostelApplications: number;
  totalPayments: number;
  totalDorms: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalStudents || 0}
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
          <Link
            href="/admin/dashboard/students"
            className="text-blue-600 text-sm mt-4 inline-block hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.pendingHostelApplications || 0}
              </p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
          <Link
            href="/admin/dashboard/hostels"
            className="text-blue-600 text-sm mt-4 inline-block hover:underline"
          >
            Review now →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Payments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalPayments || 0}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Dorms</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalDorms || 0}
              </p>
            </div>
            <div className="text-4xl">🏢</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/dashboard/students"
            className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-semibold text-gray-900">Manage Students</h3>
            <p className="text-sm text-gray-600 mt-1">
              View and search all students
            </p>
          </Link>

          <Link
            href="/admin/dashboard/hostels"
            className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">🏢</div>
            <h3 className="font-semibold text-gray-900">Hostel Applications</h3>
            <p className="text-sm text-gray-600 mt-1">
              Review and assign dorms
            </p>
          </Link>

          <div className="p-4 border border-gray-200 rounded-md bg-gray-50 opacity-50">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900">Reports</h3>
            <p className="text-sm text-gray-600 mt-1">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
