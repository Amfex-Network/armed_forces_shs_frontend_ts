// src/teacher/attendance/TeacherAttendance.jsx
import React, { useState } from "react";
import { Save } from "lucide-react";
import { CLASSES_DATA, ATTENDANCE_STUDENTS } from "../data/teacherData";
import { Avatar, PageHeader } from "../components/TeacherUI";

const STATUS_STYLES = {
  present: {
    btn: "border-green-300 bg-green-100 text-green-700",
    dot: "bg-green-500",
    label: "Present",
  },
  absent: {
    btn: "border-red-300 bg-red-100 text-red-700",
    dot: "bg-red-500",
    label: "Absent",
  },
  late: {
    btn: "border-yellow-300 bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
    label: "Late",
  },
};

const TeacherAttendance = () => {
  const [selectedClass, setSelectedClass] = useState(CLASSES_DATA[0]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState(
    ATTENDANCE_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: s.status }), {}),
  );

  const setAll = (status) =>
    setAttendance(
      ATTENDANCE_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: status }), {}),
    );

  const counts = {
    present: Object.values(attendance).filter((v) => v === "present").length,
    absent: Object.values(attendance).filter((v) => v === "absent").length,
    late: Object.values(attendance).filter((v) => v === "late").length,
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Mark Attendance" />

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-4 flex-wrap">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Class
          </label>
          <select
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            value={selectedClass.id}
            onChange={(e) =>
              setSelectedClass(
                CLASSES_DATA.find((c) => c.id === parseInt(e.target.value)),
              )
            }
          >
            {CLASSES_DATA.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 w-full sm:w-auto"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={() => setAll("present")}
            className="px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            All Present
          </button>
          <button
            onClick={() => setAll("absent")}
            className="px-3 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            All Absent
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {["present", "absent", "late"].map((s) => (
          <div
            key={s}
            className={`rounded-xl p-3 text-center border ${STATUS_STYLES[s].btn}`}
          >
            <p className="text-2xl font-bold">{counts[s]}</p>
            <p className="text-xs font-medium capitalize">{s}</p>
          </div>
        ))}
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-700">
            {selectedClass.name} — {ATTENDANCE_STUDENTS.length} students
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {ATTENDANCE_STUDENTS.map((student, idx) => {
            const status = attendance[student.id];
            return (
              <div
                key={student.id}
                className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-gray-50 transition"
              >
                <span className="text-xs text-gray-400 w-5 flex-shrink-0">
                  {idx + 1}
                </span>
                <Avatar name={student.name} size="sm" color="bg-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {student.name}
                  </p>
                  <p className="text-xs text-gray-400 font-mono hidden sm:block">
                    {student.studentId}
                  </p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  {["present", "absent", "late"].map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        setAttendance((prev) => ({ ...prev, [student.id]: s }))
                      }
                      className={`px-2 sm:px-2.5 py-1 text-xs rounded-lg border font-medium transition ${status === s ? STATUS_STYLES[s].btn : "border-gray-200 text-gray-400 hover:bg-gray-50"}`}
                    >
                      <span className="hidden sm:inline">
                        {STATUS_STYLES[s].label}
                      </span>
                      <span className="sm:hidden">
                        {STATUS_STYLES[s].label[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-gray-200 flex justify-end bg-gray-50">
          <button className="flex items-center gap-1.5 px-5 py-2 text-sm bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-medium">
            <Save size={13} /> Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
