// app/dashboard/courses/page.tsx
// UPDATED: app/dashboard/courses/page.tsx
// CHANGES: Made user info text darker and bolder for better visibility

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CourseCard from "./CourseCard";
import RegistrationSummary from "./RegistrationSummary";

interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  courseType: string;
  availableSpots: number;
  totalSpots: number;
  description: string | null;
  isRegistered: boolean;
}

interface Student {
  firstName: string;
  lastName: string;
  level: string;
  department: {
    name: string;
  };
}

export default function CoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      const data = await response.json();

      if (response.ok) {
        setCourses(data.courses);
        setStudent(data.student);
      } else {
        alert(data.error || "Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (courseId: string) => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/courses/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setCourses((prev) =>
          prev.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  isRegistered: true,
                  availableSpots: course.availableSpots - 1,
                }
              : course
          )
        );
        alert("Successfully registered for course!");
      } else {
        alert(data.error || "Failed to register");
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("Failed to register for course");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async (courseId: string) => {
    if (!confirm("Are you sure you want to drop this course?")) return;

    setActionLoading(true);
    try {
      const response = await fetch("/api/courses/register", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setCourses((prev) =>
          prev.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  isRegistered: false,
                  availableSpots: course.availableSpots + 1,
                }
              : course
          )
        );
        alert("Successfully dropped course!");
      } else {
        alert(data.error || "Failed to unregister");
      }
    } catch (error) {
      console.error("Error unregistering:", error);
      alert("Failed to drop course");
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate summary stats
  const registeredCourses = courses.filter((c) => c.isRegistered);
  const totalCredits = registeredCourses.reduce((sum, c) => sum + c.credits, 0);
  const majorCourses = registeredCourses.filter(
    (c) => c.courseType === "Major"
  ).length;
  const minorCourses = registeredCourses.filter(
    (c) => c.courseType === "Minor"
  ).length;
  const electiveCourses = registeredCourses.filter(
    (c) => c.courseType === "Elective"
  ).length;

  // Filter courses
  const filteredCourses =
    filter === "All"
      ? courses
      : filter === "Registered"
      ? courses.filter((c) => c.isRegistered)
      : courses.filter((c) => c.courseType === filter);

  // Group courses by type
  const coursesByType = {
    Major: filteredCourses.filter((c) => c.courseType === "Major"),
    Minor: filteredCourses.filter((c) => c.courseType === "Minor"),
    Elective: filteredCourses.filter((c) => c.courseType === "Elective"),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - MORE VISIBLE TEXT */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Course Registration
          </h1>
          {student && (
            <p className="text-gray-900 font-semibold mt-2 text-lg">
              {student.firstName} {student.lastName} • Level {student.level} •{" "}
              {student.department.name}
            </p>
          )}
        </div>

        {/* Registration Summary */}
        <RegistrationSummary
          totalCourses={registeredCourses.length}
          totalCredits={totalCredits}
          majorCourses={majorCourses}
          minorCourses={minorCourses}
          electiveCourses={electiveCourses}
        />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["All", "Registered", "Major", "Minor", "Elective"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {filter === "All" || filter === "Registered" ? (
          <>
            {Object.entries(coursesByType).map(
              ([type, typeCourses]) =>
                typeCourses.length > 0 && (
                  <div key={type} className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {type} Courses ({typeCourses.length})
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {typeCourses.map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          onRegister={handleRegister}
                          onUnregister={handleUnregister}
                          loading={actionLoading}
                        />
                      ))}
                    </div>
                  </div>
                )
            )}
          </>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onRegister={handleRegister}
                onUnregister={handleUnregister}
                loading={actionLoading}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {filter === "Registered"
                ? "You haven't registered for any courses yet."
                : `No ${filter} courses available.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
