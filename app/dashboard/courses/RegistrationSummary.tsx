// app/dashboard/courses/RegistrationSummary.tsx
"use client";

interface RegistrationSummaryProps {
  totalCourses: number;
  totalCredits: number;
  majorCourses: number;
  minorCourses: number;
  electiveCourses: number;
}

export default function RegistrationSummary({
  totalCourses,
  totalCredits,
  majorCourses,
  minorCourses,
  electiveCourses,
}: RegistrationSummaryProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white mb-6">
      <h2 className="text-xl font-semibold mb-4">Registration Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-sm opacity-90">Total Courses</p>
          <p className="text-3xl font-bold mt-1">{totalCourses}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-sm opacity-90">Total Credits</p>
          <p className="text-3xl font-bold mt-1">{totalCredits}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-sm opacity-90">Major</p>
          <p className="text-3xl font-bold mt-1">{majorCourses}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-sm opacity-90">Minor</p>
          <p className="text-3xl font-bold mt-1">{minorCourses}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-sm opacity-90">Elective</p>
          <p className="text-3xl font-bold mt-1">{electiveCourses}</p>
        </div>
      </div>
    </div>
  );
}
