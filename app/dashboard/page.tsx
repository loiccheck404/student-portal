import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import LogoutButton from "../../components/LogoutButton";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  // Fetch student data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { student: true },
  });

  if (!user || !user.student) {
    return <div>Student data not found</div>;
  }

  const student = user.student;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Portal</h1>
          <LogoutButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {student.firstName} {student.lastName}!
          </h2>
          <p className="text-gray-600">Matric Number: {student.matricNumber}</p>
        </div>

        {/* Student Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Your Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-medium">First Name</p>
              <p className="text-gray-900">{student.firstName}</p>
            </div>

            <div>
              <p className="text-gray-600 font-medium">Last Name</p>
              <p className="text-gray-900">{student.lastName}</p>
            </div>

            <div>
              <p className="text-gray-600 font-medium">Email</p>
              <p className="text-gray-900">{user.email}</p>
            </div>

            <div>
              <p className="text-gray-600 font-medium">Matric Number</p>
              <p className="text-gray-900">{student.matricNumber}</p>
            </div>

            <div>
              <p className="text-gray-600 font-medium">Department</p>
              <p className="text-gray-900">{student.department}</p>
            </div>

            <div>
              <p className="text-gray-600 font-medium">Level</p>
              <p className="text-gray-900">{student.level} Level</p>
            </div>

            <div>
              <p className="text-gray-600 font-medium">Date of Birth</p>
              <p className="text-gray-900">
                {new Date(student.dateOfBirth).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-gray-600 font-medium">Enrollment Year</p>
              <p className="text-gray-900">{student.enrollmentYear}</p>
            </div>

            {student.phone && (
              <div>
                <p className="text-gray-600 font-medium">Phone</p>
                <p className="text-gray-900">{student.phone}</p>
              </div>
            )}

            {student.address && (
              <div className="col-span-2">
                <p className="text-gray-600 font-medium">Address</p>
                <p className="text-gray-900">{student.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h4 className="font-bold text-gray-800 mb-2">
              Course Registration
            </h4>
            <p className="text-gray-600 text-sm">Coming soon</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h4 className="font-bold text-gray-800 mb-2">View Results</h4>
            <p className="text-gray-600 text-sm">Coming soon</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h4 className="font-bold text-gray-800 mb-2">Pay Fees</h4>
            <p className="text-gray-600 text-sm">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
