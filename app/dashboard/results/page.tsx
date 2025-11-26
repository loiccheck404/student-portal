"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Grade {
  id: string;
  score: number;
  letterGrade: string;
  gradePoint: number;
  semester: string;
  academicYear: string;
  remarks: string | null;
  course: {
    courseCode: string;
    courseName: string;
    credits: number;
    courseType: string;
  };
}

interface ResultsData {
  grades: Grade[];
  gpa: string;
}

export default function ResultsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("/api/student/results");
        const data = await response.json();
        setResultsData(data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchResults();
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const getGradeColor = (letterGrade: string) => {
    if (letterGrade.startsWith("A")) return "text-green-600 bg-green-50";
    if (letterGrade.startsWith("B")) return "text-blue-600 bg-blue-50";
    if (letterGrade.startsWith("C")) return "text-yellow-600 bg-yellow-50";
    if (letterGrade.startsWith("D")) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold mb-4 cursor-pointer px-4 py-2 rounded-lg border border-transparent hover:border-blue-200 transition-all"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            My Results
          </h1>
          <p className="text-gray-600 mt-2">View your academic performance</p>
        </div>

        {/* GPA Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 lg:p-8 mb-6">
          <div className="text-center text-white">
            <p className="text-lg lg:text-xl font-semibold mb-2">
              Cumulative GPA
            </p>
            <p className="text-5xl lg:text-6xl font-bold">
              {resultsData?.gpa || "0.00"}
            </p>
            <p className="text-blue-100 mt-2">Out of 4.00</p>
          </div>
        </div>

        {/* Results List */}
        {resultsData?.grades && resultsData.grades.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Course Results ({resultsData.grades.length})
            </h2>

            {resultsData.grades.map((grade) => (
              <div
                key={grade.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Course Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {grade.course.courseCode}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          grade.course.courseType === "Major"
                            ? "bg-blue-100 text-blue-800"
                            : grade.course.courseType === "Minor"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {grade.course.courseType}
                      </span>
                    </div>
                    <p className="text-gray-700 font-semibold mb-1">
                      {grade.course.courseName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {grade.course.credits} Credits • {grade.semester} •{" "}
                      {grade.academicYear}
                    </p>
                  </div>

                  {/* Grade Display */}
                  <div className="flex items-center gap-6">
                    {/* Score */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Score</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {grade.score}
                      </p>
                    </div>

                    {/* Letter Grade */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Grade</p>
                      <div
                        className={`text-3xl font-bold px-4 py-2 rounded-lg ${getGradeColor(
                          grade.letterGrade
                        )}`}
                      >
                        {grade.letterGrade}
                      </div>
                    </div>

                    {/* GPA */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">GPA</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {grade.gradePoint.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                {grade.remarks && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">
                      Remarks:{" "}
                    </span>
                    <span className="text-sm text-gray-600">
                      {grade.remarks}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No Results Yet
            </h3>
            <p className="text-gray-600">
              Your exam results will appear here once they are published.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
