"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  Trash2Icon,
} from "lucide-react";
import * as XLSX from "xlsx";

interface Student {
  _id: string;
  name: string;
  fathersName: string;
  email: string;
  mobile: string;
  age: number;
  studyStartDate: string;
  studyEndDate: string;
  studyDuration: {
    totalDays: number;
    years: number;
    months: number;
    days: number;
    formatted: string;
  };
  picture: string;
  feedback: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface ApiResponse {
  students: Student[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalStudents: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mobile.includes(searchTerm)
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(
        "https://be-student-form.onrender.com/api/admin/students",
        {
          method: "GET",
          // credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data: ApiResponse = await response.json();
        // Extract the students array from the response
        setStudents(data.students || []);
        setFilteredStudents(data.students || []);
      } else {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      // Set empty arrays in case of error
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        "Name",
        "Father's Name",
        "Email",
        "Mobile",
        "Age",
        "Study Start Date",
        "Study End Date",
        "Study Duration",
        "Feedback",
        "Address",
        "Submitted On",
      ],
      ...filteredStudents.map((student) => [
        student.name,
        student.fathersName,
        student.email,
        student.mobile,
        student.age,
        new Date(student.studyStartDate).toLocaleDateString(),
        new Date(student.studyEndDate).toLocaleDateString(),
        student.studyDuration.formatted,
        student.feedback,
        student.address,
        new Date(student.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    const worksheetData = [
      [
        "Name",
        "Father's Name",
        "Email",
        "Mobile",
        "Age",
        "Study Start Date",
        "Study End Date",
        "Study Duration",
        "Feedback",
        "Address",
        "Submitted On",
      ],
      ...filteredStudents.map((student) => [
        student.name,
        student.fathersName,
        student.email,
        student.mobile,
        student.age,
        new Date(student.studyStartDate).toLocaleDateString(),
        new Date(student.studyEndDate).toLocaleDateString(),
        student.studyDuration.formatted,
        student.feedback,
        student.address,
        new Date(student.createdAt).toLocaleDateString(),
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // Trigger download
    XLSX.writeFile(workbook, "students_data.xlsx");
  };

  const viewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const deleteStudent = async (student: Student) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        const response = await fetch(
          `https://be-student-form.onrender.com/api/students/${student._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setStudents((prev) => prev.filter((s) => s._id !== student._id));
          setFilteredStudents((prev) =>
            prev.filter((s) => s._id !== student._id)
          );
        } else {
          console.error("Failed to delete student");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  console.log("students", students);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">Manage student registrations</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Filter className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Filtered Results</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredStudents.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    students.filter(
                      (s) =>
                        new Date(s.createdAt).getMonth() ===
                        new Date().getMonth()
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Study Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Study Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={
                            `data:image/jpeg;base64,${student.picture}` ||
                            "/api/placeholder/40/40"
                          }
                          alt={student.name}
                          className="h-10 w-10 rounded-full object-cover mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.fathersName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.mobile}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {student.age} years
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {student.studyDuration.years}y{" "}
                        {student.studyDuration.months}m{" "}
                        {student.studyDuration.days}d
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(student.studyStartDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        to {new Date(student.studyEndDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900 text-center">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-6">
                        <button
                          onClick={() => viewStudent(student)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => deleteStudent(student)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center"
                        >
                          <Trash2Icon className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No students found</p>
            </div>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Student Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Section */}
                <div className="flex items-center space-x-8 p-4 bg-gray-50 rounded-xl">
                  <img
                    src={
                      `data:image/jpeg;base64,${selectedStudent.picture}` ||
                      "api/placeholder/80/80"
                    }
                    alt={selectedStudent.name}
                    className="h-40 w-40 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-gray-600">
                      Father: {selectedStudent.fathersName}
                    </p>
                    <p className="text-gray-600">
                      Age: {selectedStudent.age} years
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Mobile</p>
                      <p className="font-medium">{selectedStudent.mobile}</p>
                    </div>
                  </div>
                </div>

                {/* Study Duration */}
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">
                      Study Duration
                    </h4>
                  </div>
                  <p className="text-gray-700 mb-2">
                    {selectedStudent.studyDuration.formatted}
                  </p>
                  <div className="text-sm text-gray-600">
                    <p>
                      Start:{" "}
                      {new Date(
                        selectedStudent.studyStartDate
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      End:{" "}
                      {new Date(
                        selectedStudent.studyEndDate
                      ).toLocaleDateString()}
                    </p>
                    <p>Total Days: {selectedStudent.studyDuration.totalDays}</p>
                  </div>
                </div>

                {/* Feedback */}
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-semibold text-gray-900">Feedback</h4>
                  </div>
                  <p className="text-gray-700">{selectedStudent.feedback}</p>
                </div>

                {/* Address */}
                <div className="p-4 bg-red-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-gray-900">Address</h4>
                  </div>
                  <p className="text-gray-700">{selectedStudent.address}</p>
                </div>

                {/* Submission Date */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Submitted on</p>
                      <p className="font-medium">
                        {new Date(selectedStudent.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Last updated:{" "}
                        {new Date(selectedStudent.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
