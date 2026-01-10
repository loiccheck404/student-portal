"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Student {
  id: string;
  matricNumber: string;
  firstName: string;
  lastName: string;
  level: string;
  department: {
    name: string;
  };
}

interface Dorm {
  id: string;
  name: string;
  description: string;
}

interface Room {
  id: string;
  roomNumber: string;
  dormId: string;
  isOccupied: boolean;
}

interface HostelApplication {
  id: string;
  studentId: string;
  dormId: string | null;
  roomId: string | null;
  feeAmount: number;
  paidAmount: number;
  status: string;
  createdAt: string;
  student: Student;
  dorm: Dorm | null;
  room: Room | null;
}

export default function AdminHostelsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<HostelApplication[]>([]);
  const [dorms, setDorms] = useState<Dorm[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [assigningAppId, setAssigningAppId] = useState<string | null>(null);
  const [selectedDormId, setSelectedDormId] = useState<string>("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDormId) {
      fetchRoomsForDorm(selectedDormId);
    }
  }, [selectedDormId]);

  const fetchData = async () => {
    try {
      const [appsRes, dormsRes] = await Promise.all([
        fetch("/api/admin/hostels"),
        fetch("/api/admin/dorms"),
      ]);

      if (appsRes.ok && dormsRes.ok) {
        const appsData = await appsRes.json();
        const dormsData = await dormsRes.json();
        setApplications(appsData.applications || []);
        setDorms(dormsData.dorms || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomsForDorm = async (dormId: string) => {
    try {
      const response = await fetch(`/api/admin/dorms/${dormId}/rooms`);
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms || []);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleAssignDorm = async (applicationId: string) => {
    if (!selectedDormId || !selectedRoomId) {
      alert("Please select both dorm and room");
      return;
    }

    try {
      const response = await fetch("/api/admin/hostels/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          dormId: selectedDormId,
          roomId: selectedRoomId,
        }),
      });

      if (response.ok) {
        alert("Dorm and room assigned successfully!");
        setAssigningAppId(null);
        setSelectedDormId("");
        setSelectedRoomId("");
        fetchData();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to assign");
      }
    } catch (error) {
      console.error("Error assigning dorm:", error);
      alert("Failed to assign dorm");
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = filter === "All" || app.status === filter;
    const matchesSearch =
      app.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student.matricNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Loading hostel applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Hostel Applications
          </h1>
          <p className="text-gray-600 mt-2">
            Manage student hostel applications and room assignments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-600 font-semibold mb-2">
              Total Applications
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {applications.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-yellow-600 font-semibold mb-2">Pending</p>
            <p className="text-3xl font-bold text-gray-900">
              {applications.filter((a) => a.status === "Pending").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-green-600 font-semibold mb-2">Paid</p>
            <p className="text-3xl font-bold text-gray-900">
              {applications.filter((a) => a.status === "Paid").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-blue-600 font-semibold mb-2">Available Dorms</p>
            <p className="text-3xl font-bold text-gray-900">{dorms.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or matric number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {["All", "Pending", "Paid"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dorm Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {app.student.firstName} {app.student.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {app.student.matricNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          Level {app.student.level}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {app.student.department.name}
                    </td>
                    <td className="px-6 py-4">
                      {app.dorm && app.room ? (
                        <div>
                          <p className="font-semibold text-gray-900">
                            {app.dorm.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Room {app.room.roomNumber}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Paid:{" "}
                          <span className="font-semibold text-green-600">
                            {app.paidAmount.toLocaleString()} FCFA
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Total:{" "}
                          <span className="font-semibold">
                            {app.feeAmount.toLocaleString()} FCFA
                          </span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {app.status === "Pending" && !app.dormId && (
                        <>
                          {assigningAppId === app.id ? (
                            <div className="space-y-3 min-w-[250px]">
                              <select
                                value={selectedDormId}
                                onChange={(e) =>
                                  setSelectedDormId(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Dorm</option>
                                {dorms.map((dorm) => (
                                  <option key={dorm.id} value={dorm.id}>
                                    {dorm.name}
                                  </option>
                                ))}
                              </select>

                              {selectedDormId && (
                                <select
                                  value={selectedRoomId}
                                  onChange={(e) =>
                                    setSelectedRoomId(e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select Room</option>
                                  {rooms
                                    .filter((room) => !room.isOccupied)
                                    .map((room) => (
                                      <option key={room.id} value={room.id}>
                                        Room {room.roomNumber}
                                      </option>
                                    ))}
                                </select>
                              )}

                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAssignDorm(app.id)}
                                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                                >
                                  Assign
                                </button>
                                <button
                                  onClick={() => {
                                    setAssigningAppId(null);
                                    setSelectedDormId("");
                                    setSelectedRoomId("");
                                  }}
                                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setAssigningAppId(app.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                            >
                              Assign Dorm
                            </button>
                          )}
                        </>
                      )}
                      {app.dormId && (
                        <span className="text-green-600 font-semibold text-sm">
                          ✓ Assigned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No applications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
