// src/teacher/yeargroup/TeacherYearGroup.jsx
import React from "react";
import { Users, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { YEAR_GROUP_DATA } from "../data/teacherData";
import { Avatar, LoadBar, PageHeader } from "../components/TeacherUI";

const TeacherYearGroup = () => {
  const yg = YEAR_GROUP_DATA;
  const submitted = yg.formTeachers.filter((t) => t.caSubmitted).length;
  const notSubmitted = yg.formTeachers.filter((t) => !t.caSubmitted).length;
  const avgAttendance = Math.round(
    yg.formTeachers.reduce((s, t) => s + t.attendance, 0) /
      yg.formTeachers.length,
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#ecfdf5" }}
        >
          <Users size={16} style={{ color: "var(--success-dark)" }} />
        </div>
        <PageHeader title={`Year Group Coordinator — ${yg.yearGroup}`} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: yg.totalStudents,
            color: "var(--royal-blue)",
          },
          { label: "Classes", value: yg.totalClasses, color: "var(--info)" },
          {
            label: "CA Submitted",
            value: submitted,
            color: "var(--success-dark)",
          },
          {
            label: "Avg Attendance",
            value: `${avgAttendance}%`,
            color: "var(--warning)",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border p-4 text-center shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <p className="text-2xl font-black" style={{ color }}>
              {value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* CA submission alert */}
      {notSubmitted > 0 && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl border"
          style={{
            backgroundColor: "#fffbeb",
            borderColor: "var(--warning)",
            color: "var(--dark-gray)",
          }}
        >
          <AlertCircle
            size={16}
            style={{ color: "var(--warning)" }}
            className="flex-shrink-0 mt-0.5"
          />
          <p className="text-sm">
            <span className="font-bold" style={{ color: "var(--warning)" }}>
              {notSubmitted} class{notSubmitted > 1 ? "es" : ""}
            </span>{" "}
            have not submitted CA scores. Follow up with their Form Teachers.
          </p>
        </div>
      )}

      {/* Form Teachers overview */}
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
            {yg.yearGroup} — Form Teachers Overview
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
                  "Form Teacher",
                  "Class",
                  "Students",
                  "Attendance",
                  "CA Scores",
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
              {yg.formTeachers.map((t, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={t.name} size="sm" color="bg-blue-700" />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {t.name}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{ color: "var(--royal-blue)" }}
                  >
                    {t.class}
                  </td>
                  <td
                    className="px-4 py-3 text-center font-medium"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {t.students}
                  </td>
                  <td className="px-4 py-3 min-w-[130px]">
                    <LoadBar pct={t.attendance} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: t.caSubmitted ? "#f0fdf4" : "#fffbeb",
                        color: t.caSubmitted
                          ? "var(--success-dark)"
                          : "var(--warning)",
                      }}
                    >
                      {t.caSubmitted ? (
                        <>
                          <CheckCircle2 size={11} /> Submitted
                        </>
                      ) : (
                        <>
                          <AlertCircle size={11} /> Pending
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Year group summary */}
      <div
        className="bg-white rounded-xl border shadow-sm p-5"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <h3
          className="text-sm font-semibold mb-4 flex items-center gap-2"
          style={{ color: "var(--dark-gray)" }}
        >
          <TrendingUp size={15} style={{ color: "var(--royal-blue)" }} />
          Year Group Performance Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="text-center p-4 rounded-xl"
            style={{ backgroundColor: "var(--light-gray)" }}
          >
            <p
              className="text-3xl font-black"
              style={{ color: "var(--royal-blue)" }}
            >
              {Math.round((submitted / yg.totalClasses) * 100)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">CA Submission Rate</p>
          </div>
          <div
            className="text-center p-4 rounded-xl"
            style={{ backgroundColor: "var(--light-gray)" }}
          >
            <p
              className="text-3xl font-black"
              style={{ color: "var(--success-dark)" }}
            >
              {avgAttendance}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Average Attendance</p>
          </div>
          <div
            className="text-center p-4 rounded-xl"
            style={{ backgroundColor: "var(--light-gray)" }}
          >
            <p
              className="text-3xl font-black"
              style={{ color: "var(--warning)" }}
            >
              {notSubmitted}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Classes Needing Attention
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherYearGroup;
