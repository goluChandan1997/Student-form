// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   LogOut,
//   Users,
//   Search,
//   Filter,
//   Download,
//   Eye,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   MessageSquare,
//   Trash2Icon,
// } from "lucide-react";
// import * as XLSX from "xlsx";

// interface Student {
//   _id: string;
//   name: string;
//   fathersName: string;
//   email: string;
//   mobile: string;
//   age: number;
//   studyStartDate: string;
//   studyEndDate: string;
//   studyDuration: {
//     totalDays: number;
//     years: number;
//     months: number;
//     days: number;
//     formatted: string;
//   };
//   picture: string;
//   feedback: string;
//   address: string;
//   createdAt: string;
//   updatedAt: string;
//   id: string;
// }

// interface ApiResponse {
//   students: Student[];
//   pagination: {
//     currentPage: number;
//     totalPages: number;
//     totalStudents: number;
//     hasNext: boolean;
//     hasPrev: boolean;
//   };
// }

// export default function AdminDashboard() {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   useEffect(() => {
//     const filtered = students.filter(
//       (student) =>
//         student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         student.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         student.mobile.includes(searchTerm)
//     );
//     setFilteredStudents(filtered);
//   }, [searchTerm, students]);

//   const fetchStudents = async () => {
//     try {
//       const token = localStorage.getItem("adminToken");
//       if (!token) {
//         router.push("/admin/login");
//         return;
//       }

//       const response = await fetch(
//         "https://be-student-form.onrender.com/api/admin/students",
//         {
//           method: "GET",
//           // credentials: "include",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.ok) {
//         const data: ApiResponse = await response.json();
//         // Extract the students array from the response
//         setStudents(data.students || []);
//         setFilteredStudents(data.students || []);
//       } else {
//         localStorage.removeItem("adminToken");
//         router.push("/admin/login");
//       }
//     } catch (error) {
//       console.error("Error fetching students:", error);
//       // Set empty arrays in case of error
//       setStudents([]);
//       setFilteredStudents([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     router.push("/admin/login");
//   };

//   const exportToCSV = () => {
//     const csvContent = [
//       [
//         "Name",
//         "Father's Name",
//         "Email",
//         "Mobile",
//         "Age",
//         "Study Start Date",
//         "Study End Date",
//         "Study Duration",
//         "Feedback",
//         "Address",
//         "Submitted On",
//       ],
//       ...filteredStudents.map((student) => [
//         student.name,
//         student.fathersName,
//         student.email,
//         student.mobile,
//         student.age,
//         new Date(student.studyStartDate).toLocaleDateString(),
//         new Date(student.studyEndDate).toLocaleDateString(),
//         student.studyDuration.formatted,
//         student.feedback,
//         student.address,
//         new Date(student.createdAt).toLocaleDateString(),
//       ]),
//     ]
//       .map((row) => row.join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "students_data.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const exportToExcel = () => {
//     const worksheetData = [
//       [
//         "Name",
//         "Father's Name",
//         "Email",
//         "Mobile",
//         "Age",
//         "Study Start Date",
//         "Study End Date",
//         "Study Duration",
//         "Feedback",
//         "Address",
//         "Submitted On",
//       ],
//       ...filteredStudents.map((student) => [
//         student.name,
//         student.fathersName,
//         student.email,
//         student.mobile,
//         student.age,
//         new Date(student.studyStartDate).toLocaleDateString(),
//         new Date(student.studyEndDate).toLocaleDateString(),
//         student.studyDuration.formatted,
//         student.feedback,
//         student.address,
//         new Date(student.createdAt).toLocaleDateString(),
//       ]),
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

//     // Trigger download
//     XLSX.writeFile(workbook, "students_data.xlsx");
//   };

//   const viewStudent = (student: Student) => {
//     setSelectedStudent(student);
//     setShowModal(true);
//   };

//   const deleteStudent = async (student: Student) => {
//     const token = localStorage.getItem("adminToken");
//     if (!token) {
//       router.push("/admin/login");
//       return;
//     }

//     if (confirm(`Are you sure you want to delete ${student.name}?`)) {
//       try {
//         const response = await fetch(
//           `https://be-student-form.onrender.com/api/students/${student._id}`,
//           {
//             method: "DELETE",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.ok) {
//           setStudents((prev) => prev.filter((s) => s._id !== student._id));
//           setFilteredStudents((prev) =>
//             prev.filter((s) => s._id !== student._id)
//           );
//         } else {
//           console.error("Failed to delete student");
//         }
//       } catch (error) {
//         console.error("Error deleting student:", error);
//       }
//     }
//   };

//   console.log("students", students);
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
//                 <Users className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   Admin Dashboard
//                 </h1>
//                 <p className="text-gray-600">Manage student registrations</p>
//               </div>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               <LogOut className="h-4 w-4 mr-2" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center">
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <Users className="h-6 w-6 text-blue-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm text-gray-600">Total Students</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {students.length}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center">
//               <div className="bg-green-100 p-3 rounded-lg">
//                 <Filter className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm text-gray-600">Filtered Results</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {filteredStudents.length}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center">
//               <div className="bg-purple-100 p-3 rounded-lg">
//                 <Calendar className="h-6 w-6 text-purple-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm text-gray-600">This Month</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {
//                     students.filter(
//                       (s) =>
//                         new Date(s.createdAt).getMonth() ===
//                         new Date().getMonth()
//                     ).length
//                   }
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search and Actions */}
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search students..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <button
//               onClick={exportToCSV}
//               className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               <Download className="h-4 w-4 mr-2" />
//               Export CSV
//             </button>
//             <button
//               onClick={exportToExcel}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Download className="h-4 w-4 mr-2" />
//               Export Excel
//             </button>
//           </div>
//         </div>

//         {/* Students Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Student
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Contact
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Age
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Study Duration
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Study Period
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Submitted
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredStudents.map((student) => (
//                   <tr key={student._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <img
//                           src={
//                             `data:image/jpeg;base64,${student.picture}` ||
//                             "/api/placeholder/40/40"
//                           }
//                           alt={student.name}
//                           className="h-10 w-10 rounded-full object-cover mr-4"
//                         />
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {student.name}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {student.fathersName}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {student.email}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {student.mobile}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="text-sm text-gray-900">
//                         {student.age} years
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="text-sm text-gray-900">
//                         {student.studyDuration.years}y{" "}
//                         {student.studyDuration.months}m{" "}
//                         {student.studyDuration.days}d
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {new Date(student.studyStartDate).toLocaleDateString()}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         to {new Date(student.studyEndDate).toLocaleDateString()}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <span className="text-sm text-gray-900 text-center">
//                         {new Date(student.createdAt).toLocaleDateString()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex gap-6">
//                         <button
//                           onClick={() => viewStudent(student)}
//                           className="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center"
//                         >
//                           <Eye className="h-4 w-4 mr-1" />
//                           View
//                         </button>
//                         <button
//                           onClick={() => deleteStudent(student)}
//                           className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center"
//                         >
//                           <Trash2Icon className="h-4 w-4 mr-1" />
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {filteredStudents.length === 0 && (
//             <div className="text-center py-12">
//               <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500">No students found</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Student Detail Modal */}
//       {showModal && selectedStudent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   Student Details
//                 </h2>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="text-gray-400 hover:text-gray-600 text-xl"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 {/* Profile Section */}
//                 <div className="flex items-center space-x-8 p-4 bg-gray-50 rounded-xl">
//                   <img
//                     src={
//                       `data:image/jpeg;base64,${selectedStudent.picture}` ||
//                       "api/placeholder/80/80"
//                     }
//                     alt={selectedStudent.name}
//                     className="h-40 w-40 rounded-full object-cover"
//                   />
//                   <div>
//                     <h3 className="text-xl font-semibold text-gray-900">
//                       {selectedStudent.name}
//                     </h3>
//                     <p className="text-gray-600">
//                       Father: {selectedStudent.fathersName}
//                     </p>
//                     <p className="text-gray-600">
//                       Age: {selectedStudent.age} years
//                     </p>
//                   </div>
//                 </div>

//                 {/* Contact Information */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
//                     <Mail className="h-5 w-5 text-blue-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Email</p>
//                       <p className="font-medium">{selectedStudent.email}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
//                     <Phone className="h-5 w-5 text-green-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Mobile</p>
//                       <p className="font-medium">{selectedStudent.mobile}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Study Duration */}
//                 <div className="p-4 bg-purple-50 rounded-xl">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <Calendar className="h-5 w-5 text-purple-600" />
//                     <h4 className="font-semibold text-gray-900">
//                       Study Duration
//                     </h4>
//                   </div>
//                   <p className="text-gray-700 mb-2">
//                     {selectedStudent.studyDuration.formatted}
//                   </p>
//                   <div className="text-sm text-gray-600">
//                     <p>
//                       Start:{" "}
//                       {new Date(
//                         selectedStudent.studyStartDate
//                       ).toLocaleDateString()}
//                     </p>
//                     <p>
//                       End:{" "}
//                       {new Date(
//                         selectedStudent.studyEndDate
//                       ).toLocaleDateString()}
//                     </p>
//                     <p>Total Days: {selectedStudent.studyDuration.totalDays}</p>
//                   </div>
//                 </div>

//                 {/* Feedback */}
//                 <div className="p-4 bg-yellow-50 rounded-xl">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <MessageSquare className="h-5 w-5 text-yellow-600" />
//                     <h4 className="font-semibold text-gray-900">Feedback</h4>
//                   </div>
//                   <p className="text-gray-700">{selectedStudent.feedback}</p>
//                 </div>

//                 {/* Address */}
//                 <div className="p-4 bg-red-50 rounded-xl">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <MapPin className="h-5 w-5 text-red-600" />
//                     <h4 className="font-semibold text-gray-900">Address</h4>
//                   </div>
//                   <p className="text-gray-700">{selectedStudent.address}</p>
//                 </div>

//                 {/* Submission Date */}
//                 <div className="p-4 bg-gray-50 rounded-xl">
//                   <div className="flex items-center space-x-2">
//                     <Calendar className="h-5 w-5 text-gray-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Submitted on</p>
//                       <p className="font-medium">
//                         {new Date(selectedStudent.createdAt).toLocaleString()}
//                       </p>
//                       <p className="text-sm text-gray-500 mt-1">
//                         Last updated:{" "}
//                         {new Date(selectedStudent.updatedAt).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import * as XLSX from 'xlsx';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [isUsingSearch, setIsUsingSearch] = useState(false);
  const router = useRouter();

  const ITEMS_PER_PAGE = 10;

  // Check if any search parameters are active
  const hasSearchParams = useMemo(() => {
    return searchTerm.trim() || startDate || endDate;
  }, [searchTerm, startDate, endDate]);

  // Fetch students with pagination
  const fetchStudents = async (page = 1) => {
    try {
      setIsLoading(page === 1);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(
        `https://be-student-form.onrender.com/api/admin/students?page=${page}&limit=${ITEMS_PER_PAGE}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data: ApiResponse = await response.json();
        setStudents(data.students || []);
        setPagination({
          currentPage: page,
          totalPages: data.pagination.totalPages,
          totalStudents: data.pagination.totalStudents,
          hasNext: data.pagination.hasNext,
          hasPrev: data.pagination.hasPrev,
        });
        setIsUsingSearch(false);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Search students with pagination
  const searchStudents = async (page = 1) => {
    if (!hasSearchParams) {
      fetchStudents(page);
      return;
    }

    try {
      setIsSearching(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const searchParams = new URLSearchParams();
      if (searchTerm.trim()) searchParams.append('q', searchTerm.trim());
      if (startDate) searchParams.append('startDate', startDate);
      if (endDate) searchParams.append('endDate', endDate);
      searchParams.append('page', page.toString());
      searchParams.append('limit', ITEMS_PER_PAGE.toString());
      searchParams.append('includePicture', 'true');

      const response = await fetch(
        `https://be-student-form.onrender.com/api/students/search?${searchParams.toString()}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();

        // Handle both paginated and non-paginated search responses
        if (data.students && data.pagination) {
          // Paginated response
          setStudents(data.students);
          setPagination({
            currentPage: page,
            totalPages: data.pagination.totalPages,
            totalStudents: data.pagination.totalStudents,
            hasNext: data.pagination.hasNext,
            hasPrev: data.pagination.hasPrev,
          });
        } else if (Array.isArray(data)) {
          // Non-paginated response - handle client-side pagination
          setStudents(data);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalStudents: data.length,
            hasNext: false,
            hasPrev: false,
          });
        }

        setIsUsingSearch(true);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      } else {
        console.error('Search failed');
        setStudents([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalStudents: 0,
          hasNext: false,
          hasPrev: false,
        });
      }
    } catch (error) {
      console.error('Error searching students:', error);
      setStudents([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalStudents: 0,
        hasNext: false,
        hasPrev: false,
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Load data when component mounts or page changes
  useEffect(() => {
    if (hasSearchParams) {
      searchStudents(pagination.currentPage);
    } else {
      fetchStudents(pagination.currentPage);
    }
  }, [pagination.currentPage]); // Only depend on currentPage

  // Debounced search effect for search parameters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Reset to page 1 when search parameters change
      if (pagination.currentPage !== 1) {
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
      } else {
        if (hasSearchParams) {
          searchStudents(1);
        } else {
          fetchStudents(1);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, startDate, endDate]); // Only depend on search parameters

  const handleClearSearch = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setIsUsingSearch(false);
    // Reset pagination and fetch first page
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchStudents(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.currentPage) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        'Name',
        "Father's Name",
        'Email',
        'Mobile',
        'Age',
        'Study Start Date',
        'Study End Date',
        'Study Duration',
        'Feedback',
        'Address',
        'Submitted On',
      ],
      ...students.map((student) => [
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
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_data_${isUsingSearch ? 'search_' : ''}${
      new Date().toISOString().split('T')[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    const worksheetData = [
      [
        'Name',
        "Father's Name",
        'Email',
        'Mobile',
        'Age',
        'Study Start Date',
        'Study End Date',
        'Study Duration',
        'Feedback',
        'Address',
        'Submitted On',
      ],
      ...students.map((student) => [
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    XLSX.writeFile(
      workbook,
      `students_data_${isUsingSearch ? 'search_' : ''}${
        new Date().toISOString().split('T')[0]
      }.xlsx`,
    );
  };

  const viewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const deleteStudent = async (student: Student) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        const response = await fetch(
          `https://be-student-form.onrender.com/api/students/${student._id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          // Remove the student from current list
          setStudents((prev) => prev.filter((s) => s._id !== student._id));

          // Update pagination count
          setPagination((prev) => ({
            ...prev,
            totalStudents: prev.totalStudents - 1,
          }));

          // If current page becomes empty and it's not the first page, go to previous page
          const remainingStudents = students.length - 1;
          if (remainingStudents === 0 && pagination.currentPage > 1) {
            handlePageChange(pagination.currentPage - 1);
          }
        } else {
          console.error('Failed to delete student');
          alert('Failed to delete student. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student. Please try again.');
      }
    }
  };

  const hasActiveFilters = searchTerm || startDate || endDate;

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
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
                <p className="text-sm text-gray-600">
                  {isUsingSearch ? 'Search Results' : 'Total Students'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{pagination.totalStudents}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Filter className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Current Page</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isUsingSearch ? 'Filtered' : 'This Month'}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isUsingSearch
                    ? students.length
                    : students.filter(
                        (s) => new Date(s.createdAt).getMonth() === new Date().getMonth(),
                      ).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden  mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Student Search & Export</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Find and export student records efficiently
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center px-3 py-2 bg-purple text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Search Controls */}
          <div className="p-6">
            {/* Main Search Bar - Always Visible */}
            <div className="relative mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, mobile, or father's name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-2 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Date Filters - Responsive */}
            <div
              className={`transition-all duration-300 ${
                showFilters || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="flex items-end">
                    <button
                      onClick={handleClearSearch}
                      className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status and Export Section */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-4 bg-gray-50 rounded-xl">
              {/* Status Indicators */}
              <div className="flex flex-col sm:flex-row gap-3">
                {isSearching && (
                  <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm font-medium">Searching...</span>
                  </div>
                )}

                {isUsingSearch && (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">{students.length} students found</span>
                  </div>
                )}

                {!isSearching && !isUsingSearch && (
                  <div className="flex items-center gap-2 text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium">Total: {students.length} students</span>
                  </div>
                )}
              </div>

              {/* Export Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={exportToCSV}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export CSV
                </button>
                <button
                  onClick={exportToExcel}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Excel
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Active Filters:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Search: "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-2 p-0.5 hover:bg-blue-200 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {startDate && (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      From: {startDate}
                      <button
                        onClick={() => setStartDate('')}
                        className="ml-2 p-0.5 hover:bg-blue-200 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {endDate && (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      To: {endDate}
                      <button
                        onClick={() => setEndDate('')}
                        className="ml-2 p-0.5 hover:bg-blue-200 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
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
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={
                            `data:image/jpeg;base64,${student.picture}` || '/api/placeholder/40/40'
                          }
                          alt={student.name}
                          className="h-10 w-10 rounded-full object-cover mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.fathersName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.email}</div>
                      <div className="text-sm text-gray-500">{student.mobile}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{student.age} years</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {student.studyDuration.years}y {student.studyDuration.months}m{' '}
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

          {students.length === 0 && !isSearching && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {isUsingSearch ? 'No students found matching your search' : 'No students found'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isUsingSearch && pagination.totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {pagination.currentPage} of {pagination.totalPages}
                <span className="ml-2">({pagination.totalStudents} total students)</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className={`flex items-center px-3 py-2 rounded-lg border ${
                    pagination.hasPrev
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, current page, and pages around current
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.currentPage) <= 2
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const showEllipsis = index > 0 && page - array[index - 1] > 1;
                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsis && <span className="px-2 py-1 text-gray-500">...</span>}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 rounded-lg border ${
                              page === pagination.currentPage
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className={`flex items-center px-3 py-2 rounded-lg border ${
                    pagination.hasNext
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Student Details</h2>
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
                      `data:image/jpeg;base64,${selectedStudent.picture}` || 'api/placeholder/80/80'
                    }
                    alt={selectedStudent.name}
                    className="h-40 w-40 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedStudent.name}</h3>
                    <p className="text-gray-600">Father: {selectedStudent.fathersName}</p>
                    <p className="text-gray-600">Age: {selectedStudent.age} years</p>
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
                    <h4 className="font-semibold text-gray-900">Study Duration</h4>
                  </div>
                  <p className="text-gray-700 mb-2">{selectedStudent.studyDuration.formatted}</p>
                  <div className="text-sm text-gray-600">
                    <p>Start: {new Date(selectedStudent.studyStartDate).toLocaleDateString()}</p>
                    <p>End: {new Date(selectedStudent.studyEndDate).toLocaleDateString()}</p>
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
                        Last updated: {new Date(selectedStudent.updatedAt).toLocaleString()}
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
