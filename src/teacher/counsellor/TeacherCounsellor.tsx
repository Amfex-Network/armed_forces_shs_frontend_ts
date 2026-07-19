// src/teacher/counsellor/TeacherCounsellor.jsx
import React, { useState } from "react";
import {
  Heart,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { COUNSELLOR_DATA } from "../data/teacherData";
import { Avatar, PageHeader } from "../components/TeacherUI";

const PRIORITY_STYLE = {
  high: { bg: "#fff1f2", color: "var(--accent-red)", label: "High" },
  medium: { bg: "#fffbeb", color: "var(--warning)", label: "Medium" },
  low: { bg: "#f0fdf4", color: "var(--success-dark)", label: "Low" },
};

const STATUS_STYLE = {
  ongoing: { bg: "#eef2ff", color: "var(--royal-blue)", label: "Ongoing" },
  resolved: { bg: "#f0fdf4", color: "var(--success-dark)", label: "Resolved" },
  referred: { bg: "#fffbeb", color: "var(--warning)", label: "Referred" },
};

const TeacherCounsellor = () => {
  const [activeTab, setActiveTab] = useState("cases");
  const cd = COUNSELLOR_DATA;
  const ongoing = cd.cases.filter((c) => c.status === "ongoing").length;
  const resolved = cd.cases.filter((c) => c.status === "resolved").length;
  const referred = cd.cases.filter((c) => c.status === "referred").length;

  const tabs = [
    { id: "cases", label: `Cases (${cd.cases.length})` },
    { id: "appointments", label: `Appointments (${cd.appointments.length})` },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#f0fdf4" }}
        >
          <Heart size={16} style={{ color: "var(--success-dark)" }} />
        </div>
        <PageHeader title="Guidance & Counselling Panel" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Sessions",
            value: cd.totalSessions,
            color: "var(--royal-blue)",
          },
          { label: "Ongoing Cases", value: ongoing, color: "var(--warning)" },
          { label: "Resolved", value: resolved, color: "var(--success-dark)" },
          {
            label: "Follow-ups Due",
            value: cd.pendingFollowUps,
            color: "var(--accent-red)",
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
                activeTab === t.id ? "var(--success-dark)" : "transparent",
              color:
                activeTab === t.id ? "var(--success-dark)" : "var(--dark-gray)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Cases */}
      {activeTab === "cases" && (
        <div className="space-y-3">
          {cd.cases.map((c) => {
            const ps = PRIORITY_STYLE[c.priority];
            const ss = STATUS_STYLE[c.status];
            return (
              <div
                key={c.id}
                className="bg-white rounded-xl border shadow-sm p-4"
                style={{
                  borderColor: "var(--medium-gray)",
                  borderLeft: `4px solid ${ps.color}`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Avatar
                      name={c.studentName}
                      size="sm"
                      color="bg-green-700"
                    />
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {c.studentName}
                      </p>
                      <p className="text-xs text-gray-400">{c.class}</p>
                      <p className="text-xs mt-1 font-medium text-gray-600">
                        {c.issue}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {c.sessions} session{c.sessions > 1 ? "s" : ""}{" "}
                        completed
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: ss.bg, color: ss.color }}
                    >
                      {ss.label}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: ps.bg, color: ps.color }}
                    >
                      {ps.label} Priority
                    </span>
                  </div>
                </div>
                {c.nextSession && (
                  <div
                    className="mt-2 flex items-center gap-1 text-xs"
                    style={{ color: "var(--royal-blue)" }}
                  >
                    <Clock size={11} />
                    Next session:{" "}
                    {new Date(c.nextSession).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Appointments */}
      {activeTab === "appointments" && (
        <div
          className="bg-white rounded-xl border shadow-sm overflow-hidden"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div
            className="divide-y"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {cd.appointments.map((a, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <div
                  className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                  style={{ backgroundColor: "var(--royal-blue)" }}
                >
                  <span className="text-xs font-semibold">
                    {new Date(a.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="text-xs">{a.time}</span>
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {a.student}
                  </p>
                  <p className="text-xs text-gray-500">{a.type}</p>
                </div>
                <Calendar size={14} className="text-gray-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCounsellor;
