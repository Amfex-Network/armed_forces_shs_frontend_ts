// admin/reportTemplate/StudentSelector.jsx
import React, { useState } from "react";

const StudentSelector = ({ students, onSelectStudent, selectedStudent }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredStudents = students.filter((student) =>
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
      {/* Header - Click to toggle */}
      <div
        className="p-4 bg-gradient-to-r from-red-50 to-white border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Select Cadet</h3>
              {selectedStudent && (
                <p className="text-sm text-gray-600">
                  Current:{" "}
                  <span className="font-semibold text-red-600">
                    {selectedStudent.name}
                  </span>
                </p>
              )}
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="p-4">
          {/* Search */}
          <div className="relative mb-4">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by User ID..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Student List */}
          <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No cadets found
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-3 text-left">Service No.</th>
                    <th className="p-3 text-left">Cadet Name</th>
                    <th className="p-3 text-left">Program</th>
                    <th className="p-3 text-left">Class</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 font-mono text-sm">
                        {student.studentId}
                      </td>
                      <td className="p-3 font-medium">{student.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                          {student.program}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{student.class}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            onSelectStudent(student);
                            setIsOpen(false);
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Selected Student Info Bar */}
      {selectedStudent && !isOpen && (
        <div className="p-4 bg-gray-50 rounded-b-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Service No.:</span>
              <span className="ml-2 font-medium">
                {selectedStudent.studentId}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Cadet Name:</span>
              <span className="ml-2 font-medium">{selectedStudent.name}</span>
            </div>
            <div>
              <span className="text-gray-500">Program:</span>
              <span className="ml-2 font-medium">
                {selectedStudent.program}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Class:</span>
              <span className="ml-2 font-medium">{selectedStudent.class}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSelector;
