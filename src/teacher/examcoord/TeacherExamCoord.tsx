// src/teacher/examcoord/TeacherExamCoord.jsx
import React, { useState } from "react";
import {
  ClipboardList,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { EXAM_DATA } from "../data/teacherData";
import { PageHeader } from "../components/TeacherUI";

const STATUS_STYLE = {
  scheduled: { bg: "#eef2ff", color: "var(--royal-blue)", label: "Scheduled" },
  ongoing: { bg: "#fffbeb", color: "var(--warning)", label: "Ongoing" },
  completed: {
    bg: "#f0fdf4",
    color: "var(--success-dark)",
    label: "Completed",
  },
};

const TeacherExamCoord = () => {
  const [activeTab, setActiveTab] = useState("timetable");
  const ed = EXAM_DATA;

  const tabs = [
    { id: "timetable", label: "Exam Timetable" },
    { id: "pending", label: `Pending Scores (${ed.pendingScores.length})` },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#fffbeb" }}
        >
          <ClipboardList size={16} style={{ color: "var(--warning)" }} />
        </div>
        <PageHeader title="Exam Coordinator Panel" />
      </div>

      {/* Exam banner */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))`,
        }}
      >
        <div
          className="absolute right-0 top-0 w-40 h-40 rounded-full opacity-10"
          style={{ background: "white", transform: "translate(30%,-30%)" }}
        />
        <p className="text-blue-200 text-xs mb-1">Current Examination</p>
        <h2 className="font-black text-lg">{ed.examTitle}</h2>
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          <span>
            📅{" "}
            {new Date(ed.startDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}{" "}
            –{" "}
            {new Date(ed.endDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span>📚 {ed.totalSubjects} subjects</span>
          <span>🏫 {ed.totalClasses} classes</span>
          <span>🏛 {ed.examCentre || "AFTS"}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Subjects",
            value: ed.totalSubjects,
            color: "var(--royal-blue)",
          },
          {
            label: "Total Classes",
            value: ed.totalClasses,
            color: "var(--info)",
          },
          {
            label: "Pending Scores",
            value: ed.pendingScores.length,
            color:
              ed.pendingScores.length > 0
                ? "var(--accent-red)"
                : "var(--success-dark)",
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

      {/* Tabs */}
      <div
        className="flex border-b"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors"
            style={{
              borderColor:
                activeTab === t.id ? "var(--royal-blue)" : "transparent",
              color:
                activeTab === t.id ? "var(--royal-blue)" : "var(--dark-gray)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Timetable */}
      {activeTab === "timetable" && (
        <div
          className="bg-white rounded-xl border shadow-sm overflow-hidden"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead
                className="border-b"
                style={{
                  backgroundColor: "var(--light-gray)",
                  borderColor: "var(--medium-gray)",
                }}
              >
                <tr>
                  {[
                    "Subject",
                    "Code",
                    "Date",
                    "Time",
                    "Duration",
                    "Status",
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
                {ed.subjects.map((s, i) => {
                  const st = STATUS_STYLE[s.status] || STATUS_STYLE.scheduled;
                  return (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td
                        className="px-4 py-3 font-medium"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {s.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {s.code}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(s.date).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{s.time}</td>
                      <td className="px-4 py-3 text-gray-600">{s.duration}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: st.bg, color: st.color }}
                        >
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending Scores */}
      {activeTab === "pending" && (
        <div
          className="bg-white rounded-xl border shadow-sm overflow-hidden"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          {ed.pendingScores.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2
                size={36}
                className="mx-auto mb-3"
                style={{ color: "var(--success)" }}
              />
              <p className="text-sm font-medium text-gray-600">
                All scores submitted!
              </p>
            </div>
          ) : (
            <div
              className="divide-y"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {ed.pendingScores.map((p, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3">
                  <AlertCircle
                    size={15}
                    style={{ color: "var(--accent-red)" }}
                    className="flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {p.teacher} — {p.subject}
                    </p>
                    <p className="text-xs text-gray-400">{p.class}</p>
                  </div>
                  <div
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "var(--accent-red)" }}
                  >
                    <Clock size={11} />
                    Deadline:{" "}
                    {new Date(p.deadline).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherExamCoord;
