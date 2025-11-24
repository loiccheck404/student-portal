"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Course = {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  courseType: string;
  availableSpots: number;
  totalSpots: number;
  description: string | null;
  isRegistered?: boolean;
};

export default function CoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Major" | "Minor" | "Elective">(
    "Major"
  );
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchCourses();
  }, [activeTab]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/courses?type=${activeTab}`);
      const data = await response.json();
      setCourses(data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (courseId: string) => {
    setRegistering(courseId);
    try {
      const response = await fetch("/api/courses/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Course registered successfully!");
        fetchCourses(); // Refresh the list
      } else {
        alert(data.error || "Failed to register");
      }
    } catch (error) {
      alert("Error registering for course");
    } finally {
      setRegistering(null);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Course Registration
          </h1>
          <p className="text-gray-600 mt-2">
            Select and register for your courses
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {["Major", "Minor", "Elective"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-4 px-8 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab} Courses
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Course Cards */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">
              No courses available in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
              >
                {/* Course Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {course.courseCode}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {course.courseName}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded">
                    {course.credits} Credits
                  </span>
                </div>

                {/* Description */}
                {course.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                )}

                {/* Available Spots */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Available Spots</span>
                    <span className="font-semibold text-gray-900">
                      {course.availableSpots} / {course.totalSpots}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        course.availableSpots > 10
                          ? "bg-green-500"
                          : course.availableSpots > 0
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${
                          (course.availableSpots / course.totalSpots) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Register Button */}
                {course.isRegistered ? (
                  <button
                    disabled
                    className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-lg font-medium cursor-not-allowed"
                  >
                    ✓ Registered
                  </button>
                ) : course.availableSpots === 0 ? (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed"
                  >
                    Course Full
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(course.id)}
                    disabled={registering === course.id}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                  >
                    {registering === course.id ? "Registering..." : "Register"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
