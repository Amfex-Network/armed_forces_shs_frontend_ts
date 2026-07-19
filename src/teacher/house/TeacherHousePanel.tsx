// src/teacher/house/TeacherHousePanel.jsx
import React, { useState } from "react";
import { Home, Users, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { HOUSE_DATA } from "../data/teacherData";
import { Avatar, PageHeader } from "../components/TeacherUI";
import { useAuth } from "../../context/AuthContext";

const FEE_STYLE = {
  paid: { bg: "#f0fdf4", color: "var(--success-dark)", label: "Paid" },
  pending: { bg: "#fffbeb", color: "var(--warning)", label: "Pending" },
  overdue: { bg: "#fff1f2", color: "var(--accent-red)", label: "Overdue" },
};

const STATUS_STYLE = {
  present: { bg: "#f0fdf4", color: "var(--success-dark)", label: "Present" },
  absent: { bg: "#fff1f2", color: "var(--accent-red)", label: "Absent" },
  sick: { bg: "#fffbeb", color: "var(--warning)", label: "Sick Bay" },
};

const TeacherHousePanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("students");
  const hd = HOUSE_DATA;

  const present = hd.students.filter((s) => s.status === "present").length;
  const absent = hd.students.filter((s) => s.status === "absent").length;
  const feeDue = hd.students.filter((s) => s.fees !== "paid").length;

  const tabs = [
    { id: "students", label: "Students" },
    { id: "incidents", label: `Incidents (${hd.incidents.length})` },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#fff1f2" }}
        >
          <Home size={16} style={{ color: "var(--accent-red)" }} />
        </div>
        <PageHeader title={`House Panel — ${hd.houseName}`} />
      </div>

      {/* House banner */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, var(--accent-red-dark), var(--accent-red))`,
        }}
      >
        <div
          className="absolute right-0 top-0 w-40 h-40 rounded-full opacity-10 bg-white"
          style={{ transform: "translate(30%,-30%)" }}
        />
        <p className="text-red-200 text-xs mb-1">
          {user?.title} {user?.lastName} ·{" "}
          {user?.additionalRoles?.includes("House Mistress")
            ? "House Mistress"
            : "House Master"}
        </p>
        <h2 className="font-black text-xl">{hd.houseName}</h2>
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          <span>👥 {hd.totalStudents} students</span>
          <span>♂ {hd.boys} boys</span>
          <span>♀ {hd.girls} girls</span>
          <span>
            🏠 {hd.rooms} rooms · {hd.floors} floors
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: hd.totalStudents,
            color: "var(--royal-blue)",
          },
          {
            label: "Present Today",
            value: present,
            color: "var(--success-dark)",
          },
          { label: "Absent Today", value: absent, color: "var(--accent-red)" },
          {
            label: "Fees Overdue",
            value: feeDue,
            color: feeDue > 0 ? "var(--warning)" : "var(--success-dark)",
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
                activeTab === t.id ? "var(--accent-red)" : "transparent",
              color:
                activeTab === t.id ? "var(--accent-red)" : "var(--dark-gray)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Students tab */}
      {activeTab === "students" && (
        <div
          className="bg-white rounded-xl border shadow-sm overflow-hidden"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead
                className="border-b"
                style={{
                  backgroundColor: "var(--light-gray)",
                  borderColor: "var(--medium-gray)",
                }}
              >
                <tr>
                  {["Student", "Class", "Room", "Status", "Fees"].map((h) => (
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
                {hd.students.map((s) => {
                  const ss = STATUS_STYLE[s.status];
                  const fs = FEE_STYLE[s.fees];
                  return (
                    <tr key={s.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={s.name} size="sm" color="bg-red-600" />
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--dark-gray)" }}
                          >
                            {s.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {s.class}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {s.room}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: ss.bg, color: ss.color }}
                        >
                          {ss.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: fs.bg, color: fs.color }}
                        >
                          {fs.label}
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

      {/* Incidents tab */}
      {activeTab === "incidents" && (
        <div
          className="bg-white rounded-xl border shadow-sm overflow-hidden"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div
            className="divide-y"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {hd.incidents.map((inc, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      size={15}
                      style={{ color: "var(--accent-red)" }}
                      className="flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {inc.student} —{" "}
                        <span style={{ color: "var(--accent-red)" }}>
                          {inc.type}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {inc.description}
                      </p>
                      <p
                        className="text-xs mt-1 font-medium"
                        style={{ color: "var(--success-dark)" }}
                      >
                        Action: {inc.action}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(inc.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherHousePanel;
