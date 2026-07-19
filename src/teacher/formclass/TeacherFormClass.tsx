// src/teacher/formclass/TeacherFormClass.jsx
import React from "react";
import { Users, Star } from "lucide-react";
import { FORM_CLASS_STUDENTS, getGradeColor } from "../data/teacherData";
import { Avatar, LoadBar, PageHeader } from "../components/TeacherUI";
import { useAuth } from "../../context/AuthContext";

const TeacherFormClass = () => {
  const { user } = useAuth();

  const avgScore = Math.round(
    FORM_CLASS_STUDENTS.reduce((s, st) => s + st.total, 0) /
      FORM_CLASS_STUDENTS.length,
  );
  const avgAttendance = Math.round(
    FORM_CLASS_STUDENTS.reduce((s, st) => s + st.attendance, 0) /
      FORM_CLASS_STUDENTS.length,
  );
  const a1Count = FORM_CLASS_STUDENTS.filter((s) => s.grade === "A1").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#eef2ff" }}
        >
          <Users size={16} style={{ color: "var(--royal-blue)" }} />
        </div>
        <PageHeader
          title={`Form Class — ${user?.formClass || "My Form Class"}`}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Class Size",
            value: FORM_CLASS_STUDENTS.length,
            color: "var(--royal-blue)",
          },
          {
            label: "Avg Score",
            value: `${avgScore}%`,
            color: "var(--success-dark)",
          },
          { label: "A1 Grades", value: a1Count, color: "var(--warning)" },
          {
            label: "Avg Attendance",
            value: `${avgAttendance}%`,
            color: "#7c3aed",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border p-4 text-center shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: `${color}18` }}
            >
              <Star size={15} style={{ color }} />
            </div>
            <p className="text-xl font-black" style={{ color }}>
              {value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Student table */}
      <div
        className="bg-white rounded-xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="px-5 py-3.5 border-b"
          style={{
            backgroundColor: "var(--light-gray)",
            borderColor: "var(--medium-gray)",
          }}
        >
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--dark-gray)" }}
          >
            Student Overview — {user?.formClass || "Form Class"}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead
              className="border-b"
              style={{
                backgroundColor: "var(--light-gray)",
                borderColor: "var(--medium-gray)",
              }}
            >
              <tr>
                {[
                  "#",
                  "Student",
                  "CA",
                  "Exam",
                  "Total",
                  "Grade",
                  "Attendance",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {FORM_CLASS_STUDENTS.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-xs text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={s.name} size="sm" color="bg-blue-700" />
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: "var(--dark-gray)" }}
                        >
                          {s.name}
                        </p>
                        <p className="text-xs text-gray-400 font-mono hidden sm:block">
                          {s.studentId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {s.ca}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {s.exam}
                  </td>
                  <td
                    className="px-4 py-3 text-center font-black"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {s.total}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-black ${getGradeColor(s.grade)}`}
                    >
                      {s.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 min-w-[120px]">
                    <LoadBar pct={s.attendance} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherFormClass;
