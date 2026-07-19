// src/teacher/analytics/TeacherAnalytics.jsx
import React from "react";
import { CLASSES_DATA } from "../data/teacherData";
import { LoadBar, PageHeader } from "../components/TeacherUI";

const GRADE_BANDS = [
  { label: "A1 (80–100)", pct: 35, color: "bg-green-500" },
  { label: "B2–B3 (65–79)", pct: 40, color: "bg-blue-500" },
  { label: "C4–C6 (50–64)", pct: 18, color: "bg-yellow-500" },
  { label: "D7–F9 (below 50)", pct: 7, color: "bg-red-500" },
];

const TeacherAnalytics = () => (
  <div className="space-y-5">
    <PageHeader title="Class Performance Analytics" />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {CLASSES_DATA.filter((c) => c.caAvg).map((cls) => (
        <div
          key={cls.id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">
                {(cls.name || "").replace(/\s*[—–-]\s*Track [AB]/g, "").trim()}
              </h3>
              <p className="text-xs text-gray-400">
                {cls.subject} · {cls.students} students
              </p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full font-semibold ${"bg-blue-100 text-blue-700"}`}
            >
              {cls.yearGroup || "Form 1"}
            </span>
          </div>

          {/* Score Averages */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">CA Avg</p>
              <p className="text-lg font-bold text-blue-900">{cls.caAvg}/30</p>
              <LoadBar
                pct={Math.round((cls.caAvg / 30) * 100)}
                showLabel={false}
              />
            </div>
            <div className="text-center bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Exam Avg</p>
              <p className="text-lg font-bold text-gray-700">
                {cls.examAvg ? `${cls.examAvg}/70` : "—"}
              </p>
            </div>
            <div className="text-center bg-green-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Attendance</p>
              <p className="text-lg font-bold text-green-700">
                {cls.attendanceRate}%
              </p>
            </div>
          </div>

          {/* Grade Distribution */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">
              Grade Distribution
            </p>
            <div className="space-y-2">
              {GRADE_BANDS.map(({ label, pct, color }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 w-36 flex-shrink-0">
                    {label}
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-gray-600 w-8 text-right">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Classes with no data yet */}
    {CLASSES_DATA.filter((c) => !c.caAvg).length > 0 && (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-600 mb-3">
          Classes with no scores yet
        </p>
        <div className="flex flex-wrap gap-3">
          {CLASSES_DATA.filter((c) => !c.caAvg).map((cls) => (
            <div
              key={cls.id}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
            >
              <span className={`w-2 h-2 rounded-full ${"bg-blue-400"}`} />
              {(cls.name || "")
                .replace(/\s*[—–-]\s*Track [AB]/g, "")
                .trim()} — {cls.yearGroup || "Form 1"}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default TeacherAnalytics;
