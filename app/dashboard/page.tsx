"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StudentData {
  firstName: string;
  lastName: string;
  matricNumber: string;
  department: string;
  level: string;
  enrollmentYear: number;
  phone: string | null;
  address: string | null;
  dateOfBirth: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchStudentData();
    }
  }, [session]);

  const fetchStudentData = async () => {
    try {
      const response = await fetch("/api/student/profile");
      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  if (status === "loading" || !studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Student Portal</h1>
          <p className="text-sm text-gray-700 font-semibold mt-1">
            University System
          </p>
        </div>

        <nav className="p-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors font-semibold ${
              activeTab === "overview"
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            📊 Overview
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors font-semibold ${
              activeTab === "profile"
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            👤 My Profile
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors font-semibold ${
              activeTab === "courses"
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            📚 Courses
          </button>

          <button
            onClick={() => setActiveTab("results")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors font-semibold ${
              activeTab === "results"
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            📝 Results
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors font-semibold ${
              activeTab === "payments"
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            💰 Payments
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome, {studentData.firstName}!
          </h2>
          <p className="text-gray-700 font-semibold mt-1">
            {studentData.matricNumber} • {studentData.department}
          </p>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 text-sm font-bold">
                      Current Level
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {studentData.level}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <span className="text-2xl">🎓</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 text-sm font-bold">
                      Enrolled Courses
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">0</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <span className="text-2xl">📚</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 text-sm font-bold">
                      Pending Fees
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">-</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 text-sm font-bold">GPA</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">-</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                  <div className="text-2xl mb-2">📝</div>
                  <h4 className="font-semibold text-gray-800">
                    Register Courses
                  </h4>
                  <p className="text-sm text-gray-700">
                    Add courses for this semester
                  </p>
                </button>

                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                  <div className="text-2xl mb-2">💳</div>
                  <h4 className="font-semibold text-gray-800">Make Payment</h4>
                  <p className="text-sm text-gray-700">
                    Pay fees via Mobile Money
                  </p>
                </button>

                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                  <div className="text-2xl mb-2">📄</div>
                  <h4 className="font-semibold text-gray-800">View Results</h4>
                  <p className="text-sm text-gray-700">
                    Check your exam results
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              Student Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-700 font-bold">
                  First Name
                </label>
                <p className="text-lg text-gray-800 mt-1">
                  {studentData.firstName}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-700 font-bold">
                  Last Name
                </label>
                <p className="text-lg text-gray-800 mt-1">
                  {studentData.lastName}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-700 font-bold">
                  Matriculation Number
                </label>
                <p className="text-lg text-gray-800 mt-1">
                  {studentData.matricNumber}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-700 font-bold">Email</label>
                <p className="text-lg text-gray-800 mt-1">
                  {session?.user?.email}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-700 font-bold">
                  Department
                </label>
                <p className="text-lg text-gray-800 mt-1">
                  {studentData.department}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-700 font-bold">
                  Current Level
                </label>
                <p className="text-lg text-gray-800 mt-1">
                  {studentData.level}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-700 font-bold">
                  Enrollment Year
                </label>
                <p className="text-lg text-gray-800 mt-1">
                  {studentData.enrollmentYear}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-700 font-bold">
                  Date of Birth
                </label>
                <p className="text-lg text-gray-800 mt-1">
                  {new Date(studentData.dateOfBirth).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-700 font-bold">
                  Phone Number
                </label>
                <p className="text-lg text-gray-800 mt-1">
                  {studentData.phone || "Not provided"}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-700 font-bold">
                  Address
                </label>
                <p className="text-lg text-gray-800 mt-1">
                  {studentData.address || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs (Coming Soon) */}
        {["courses", "results", "payments"].includes(activeTab) && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600">
              This feature will be available in the next development phase.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
