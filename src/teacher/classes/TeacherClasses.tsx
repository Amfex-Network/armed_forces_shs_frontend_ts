// src/teacher/classes/TeacherClasses.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, ClipboardList, CheckCircle2, AlertCircle } from "lucide-react";
import { CLASSES_DATA } from "../data/teacherData";
import { PageHeader } from "../components/TeacherUI";

const TeacherClasses = () => {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title="My Classes & Subjects" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CLASSES_DATA.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden hover:shadow-md transition-all"
          >
            <div
              className={`h-1.5 ${cls.track === "A" ? "bg-yellow-700" : "bg-green-500"}`}
            />
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {cls.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cls.track === "A" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
                    >
                      Track {cls.track}
                    </span>
                    {cls.isFormClass && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                        Form Class
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {cls.program} · {cls.subject}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-900 font-bold text-lg">
                    {cls.students}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">Students</p>
                  <p className="font-bold text-gray-800">{cls.students}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">Attendance</p>
                  <p
                    className={`font-bold ${cls.attendanceRate >= 90 ? "text-green-600" : cls.attendanceRate >= 75 ? "text-yellow-600" : "text-red-500"}`}
                  >
                    {cls.attendanceRate}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">CA Avg</p>
                  <p className="font-bold text-gray-800">
                    {cls.caAvg ? `${cls.caAvg}/30` : "—"}
                  </p>
                </div>
              </div>

              {/* Submission Status */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">CA Scores</span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${cls.caSubmitted ? "text-green-600" : "text-red-500"}`}
                  >
                    {cls.caSubmitted ? (
                      <>
                        <CheckCircle2 size={11} /> Submitted
                      </>
                    ) : (
                      <>
                        <AlertCircle size={11} /> Pending
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Exam Scores</span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${cls.examSubmitted ? "text-green-600" : "text-orange-500"}`}
                  >
                    {cls.examSubmitted ? (
                      <>
                        <CheckCircle2 size={11} /> Submitted
                      </>
                    ) : (
                      <>
                        <AlertCircle size={11} /> Pending
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/teacher/scores")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm bg-[var(--royal-blue)] text-white rounded-lg hover:bg-blue-800 transition"
                >
                  <Edit3 size={13} /> Enter Scores
                </button>
                <button
                  onClick={() => navigate("/teacher/attendance")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                >
                  <ClipboardList size={13} /> Attendance
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherClasses;
