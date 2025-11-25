// app/dashboard/courses/CourseCard.tsx
"use client";

interface CourseCardProps {
  course: {
    id: string;
    courseCode: string;
    courseName: string;
    credits: number;
    courseType: string;
    availableSpots: number;
    totalSpots: number;
    description: string | null;
    isRegistered: boolean;
  };
  onRegister: (courseId: string) => void;
  onUnregister: (courseId: string) => void;
  loading: boolean;
}

export default function CourseCard({
  course,
  onRegister,
  onUnregister,
  loading,
}: CourseCardProps) {
  const isFull = course.availableSpots === 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Course Code & Type Badge */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">
            {course.courseCode}
          </h3>
          <p className="text-gray-600 mt-1">{course.courseName}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.courseType === "Major"
              ? "bg-blue-100 text-blue-700"
              : course.courseType === "Minor"
              ? "bg-purple-100 text-purple-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {course.courseType}
        </span>
      </div>

      {/* Description */}
      {course.description && (
        <p className="text-sm text-gray-500 mb-4">{course.description}</p>
      )}

      {/* Course Info */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <span className="font-medium">{course.credits}</span>
          <span>Credits</span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`font-medium ${
              isFull ? "text-red-600" : "text-green-600"
            }`}
          >
            {course.availableSpots}/{course.totalSpots}
          </span>
          <span>Spots</span>
        </div>
      </div>

      {/* Action Button */}
      {course.isRegistered ? (
        <button
          onClick={() => onUnregister(course.id)}
          disabled={loading}
          className="w-full py-2 bg-red-50 text-red-600 rounded-md font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Drop Course"}
        </button>
      ) : (
        <button
          onClick={() => onRegister(course.id)}
          disabled={loading || isFull}
          className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : isFull ? "Course Full" : "Register"}
        </button>
      )}
    </div>
  );
}
