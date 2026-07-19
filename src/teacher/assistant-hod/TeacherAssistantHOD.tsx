// src/teacher/assistant-hod/TeacherAssistantHOD.jsx
import React from "react";
import {
  Shield,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { DEPT_TEACHERS } from "../data/teacherData";
import { Avatar, LoadBar, PageHeader } from "../components/TeacherUI";
import { useAuth } from "../../context/AuthContext";

const TeacherAssistantHOD = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#eef2ff" }}
        >
          <Shield size={16} style={{ color: "var(--royal-blue)" }} />
        </div>
        <PageHeader title={`Assistant HOD — ${user?.department} Department`} />
      </div>

      {/* Notice */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl border"
        style={{
          backgroundColor: "#eef2ff",
          borderColor: "var(--royal-blue-light)",
          color: "var(--royal-blue)",
        }}
      >
        <Shield size={16} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold">Acting in support of the HOD</p>
          <p className="text-xs mt-0.5 opacity-80">
            You assist the Head of Department in managing the {user?.department}{" "}
            department. When the HOD is absent, you assume full departmental
            authority.
          </p>
        </div>
      </div>

      {/* Dept Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Dept Teachers",
            value: DEPT_TEACHERS.length,
            color: "var(--royal-blue)",
          },
          { label: "Dept Classes", value: 14, color: "var(--info)" },
          { label: "Dept Students", value: 524, color: "var(--success-dark)" },
          {
            label: "Avg Load",
            value: `${Math.round(DEPT_TEACHERS.reduce((s, t) => s + t.load, 0) / DEPT_TEACHERS.length)}%`,
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

      {/* Teacher oversight table */}
      <div
        className="bg-white rounded-xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="px-5 py-3.5 border-b flex items-center justify-between"
          style={{
            backgroundColor: "var(--light-gray)",
            borderColor: "var(--medium-gray)",
          }}
        >
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--dark-gray)" }}
          >
            Department Teachers
          </h3>
          <span className="text-xs text-gray-400">
            Monitored by Assistant HOD
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead
              className="border-b"
              style={{
                backgroundColor: "var(--light-gray)",
                borderColor: "var(--medium-gray)",
              }}
            >
              <tr>
                {["Teacher", "Subject", "Classes", "Load", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {DEPT_TEACHERS.map((t, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={t.name}
                        size="sm"
                        color={i === 0 ? "bg-purple-700" : "bg-blue-600"}
                      />
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {t.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {t.subject}
                  </td>
                  <td
                    className="px-4 py-3 text-center font-medium"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {t.classes}
                  </td>
                  <td className="px-4 py-3 min-w-[130px]">
                    <LoadBar pct={t.load} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 text-xs"
                      style={{ color: "var(--success-dark)" }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "var(--success)" }}
                      />{" "}
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending actions */}
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
            Pending Actions
          </h3>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--medium-gray)" }}>
          {[
            {
              task: "Review CA score submissions for Form 1 classes",
              due: "Friday",
              status: "pending",
            },
            {
              task: "Compile department performance report for HOD",
              due: "Next Monday",
              status: "pending",
            },
            {
              task: "Confirm exam timetable with Exam Coordinator",
              due: "Done",
              status: "done",
            },
            {
              task: "Organise department meeting for next term planning",
              due: "End of term",
              status: "pending",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              {item.status === "done" ? (
                <CheckCircle2
                  size={15}
                  style={{ color: "var(--success-dark)" }}
                  className="flex-shrink-0"
                />
              ) : (
                <AlertCircle
                  size={15}
                  style={{ color: "var(--warning)" }}
                  className="flex-shrink-0"
                />
              )}
              <p
                className={`text-sm flex-1 ${item.status === "done" ? "line-through text-gray-400" : ""}`}
                style={{
                  color:
                    item.status === "done" ? undefined : "var(--dark-gray)",
                }}
              >
                {item.task}
              </p>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {item.due}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherAssistantHOD;
