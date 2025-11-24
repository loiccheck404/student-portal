"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StudentData {
  firstName: string;
  lastName: string;
  matricNumber: string;
  level: string;
  enrollmentYear: number;
  phone: string | null;
  address: string | null;
  dateOfBirth: string;
  department: {
    // Change from string to object
    name: string;
    code: string;
  };
  faculty: {
    // ADD THIS
    name: string;
    code: string;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch("/api/student/profile");
        const data = await response.json();
        setStudentData(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    if (session?.user?.email) {
      fetchStudentData();
    }
  }, [session]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
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
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-600">Student Portal</h1>
          <p className="text-xs text-gray-700 font-semibold">
            University System
          </p>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`
        fixed lg:static top-16 lg:top-0 bottom-0 left-0 z-40
        w-64 bg-white shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="p-6 border-b hidden lg:block">
          <h1 className="text-2xl font-bold text-blue-600">Student Portal</h1>
          <p className="text-sm text-gray-700 font-semibold mt-1">
            University System
          </p>
        </div>

        <nav className="p-4">
          <button
            onClick={() => handleTabChange("overview")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors font-semibold ${
              activeTab === "overview"
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            📊 Overview
          </button>

          <button
            onClick={() => handleTabChange("profile")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors font-semibold ${
              activeTab === "profile"
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            👤 My Profile
          </button>

          <button
            onClick={() => handleTabChange("courses")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors font-semibold ${
              activeTab === "courses"
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            📚 Courses
          </button>

          <button
            onClick={() => handleTabChange("results")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors font-semibold ${
              activeTab === "results"
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            📝 Results
          </button>

          <button
            onClick={() => handleTabChange("payments")}
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
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Welcome, {studentData.firstName}!
          </h2>
          <p className="text-gray-700 font-semibold mt-1">
            {studentData.matricNumber} • {studentData.department.name}
          </p>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
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
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h3 className="text-xl lg:text-2xl font-semibold mb-6 text-gray-800">
              Student Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="text-sm text-gray-800 font-extrabold uppercase tracking-wider font-serif"
                  style={{ textShadow: "0.5px 0 0 currentColor" }}
                >
                  First Name
                </label>
                <p className="text-xl text-gray-900 mt-2">
                  {studentData.firstName}
                </p>
              </div>

              <div>
                <label
                  className="text-sm text-gray-800 font-extrabold uppercase tracking-wider font-serif"
                  style={{ textShadow: "0.5px 0 0 currentColor" }}
                >
                  Last Name
                </label>
                <p className="text-xl text-gray-900 mt-2">
                  {studentData.lastName}
                </p>
              </div>

              <div>
                <label
                  className="text-sm text-gray-800 font-extrabold uppercase tracking-wider font-serif"
                  style={{ textShadow: "0.5px 0 0 currentColor" }}
                >
                  Matriculation Number
                </label>
                <p className="text-xl text-gray-900 mt-2">
                  {studentData.matricNumber}
                </p>
              </div>

              <div>
                <label
                  className="text-sm text-gray-800 font-extrabold uppercase tracking-wider font-serif"
                  style={{ textShadow: "0.5px 0 0 currentColor" }}
                >
                  Email
                </label>
                <p className="text-xl text-gray-900 mt-2">
                  {session?.user?.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">DEPARTMENT</p>
                <p className="font-semibold text-gray-900 mb-4">
                  {studentData.department.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">FACULTY</p>
                <p className="font-semibold text-gray-900 mb-4">
                  {studentData.faculty.name}
                </p>
              </div>

              <div>
                <label
                  className="text-sm text-gray-800 font-extrabold uppercase tracking-wider font-serif"
                  style={{ textShadow: "0.5px 0 0 currentColor" }}
                >
                  Current Level
                </label>
                <p className="text-xl text-gray-900 mt-2">
                  {studentData.level}
                </p>
              </div>

              <div>
                <label
                  className="text-sm text-gray-800 font-extrabold uppercase tracking-wider font-serif"
                  style={{ textShadow: "0.5px 0 0 currentColor" }}
                >
                  Enrollment Year
                </label>
                <p className="text-xl text-gray-900 mt-2">
                  {studentData.enrollmentYear}
                </p>
              </div>

              <div>
                <label
                  className="text-sm text-gray-800 font-extrabold uppercase tracking-wider font-serif"
                  style={{ textShadow: "0.5px 0 0 currentColor" }}
                >
                  Date of Birth
                </label>
                <p className="text-xl text-gray-900 mt-2">
                  {new Date(studentData.dateOfBirth).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label
                  className="text-sm text-gray-800 font-extrabold uppercase tracking-wider font-serif"
                  style={{ textShadow: "0.5px 0 0 currentColor" }}
                >
                  Phone Number
                </label>
                <p className="text-xl text-gray-900 mt-2">
                  {studentData.phone || "Not provided"}
                </p>
              </div>

              <div className="md:col-span-2">
                <label
                  className="text-sm text-gray-800 font-extrabold uppercase tracking-wider font-serif"
                  style={{ textShadow: "0.5px 0 0 currentColor" }}
                >
                  Address
                </label>
                <p className="text-xl text-gray-900 mt-2">
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
