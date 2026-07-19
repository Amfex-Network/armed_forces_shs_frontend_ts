// src/student/attendance/StudentAttendance.jsx
import React, { useState } from "react";
import { CalendarCheck, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ATTENDANCE_SUMMARY,
  ATTENDANCE_RECORDS,
  PREVIOUS_RESULTS,
  CURRENT_RESULTS,
  TERM_INFO,
  STATUS_STYLE,
  getAttendanceColor,
} from "../data/studentData";
import { useAuth } from "../../context/AuthContext";

// Custom donut label
const DonutLabel = ({ cx, cy, pct }) => (
  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
    <tspan
      x={cx}
      dy="-0.4em"
      style={{ fontSize: 28, fontWeight: 900, fill: "var(--royal-blue)" }}
    >
      {pct}%
    </tspan>
    <tspan x={cx} dy="1.6em" style={{ fontSize: 12, fill: "#6b7280" }}>
      Attendance
    </tspan>
  </text>
);

const StudentAttendance = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");

  const attPct = Math.round(
    (ATTENDANCE_SUMMARY.present / ATTENDANCE_SUMMARY.totalDays) * 100,
  );
  const attColor = getAttendanceColor(attPct);

  const filtered =
    filter === "all"
      ? ATTENDANCE_RECORDS
      : ATTENDANCE_RECORDS.filter((r) => r.status === filter);

  // Donut chart data
  const pieData = [
    {
      name: "Present",
      value: ATTENDANCE_SUMMARY.present,
      color: "var(--success-dark)",
    },
    {
      name: "Absent",
      value: ATTENDANCE_SUMMARY.absent,
      color: "var(--accent-red)",
    },
    { name: "Late", value: ATTENDANCE_SUMMARY.late, color: "var(--warning)" },
  ].filter((d) => d.value > 0);

  // Weekly attendance bar (last 3 weeks mock)
  const weeklyData = [
    { week: "Wk 7", present: 5, absent: 0, late: 0 },
    { week: "Wk 8", present: 4, absent: 1, late: 0 },
    { week: "Wk 9", present: 4, absent: 0, late: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-xl font-black"
          style={{ color: "var(--dark-gray)" }}
        >
          Attendance
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {user?.formClass} · {TERM_INFO.term} · {TERM_INFO.academicYear}
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Days",
            value: ATTENDANCE_SUMMARY.totalDays,
            icon: CalendarCheck,
            color: "var(--royal-blue)",
          },
          {
            label: "Present",
            value: ATTENDANCE_SUMMARY.present,
            icon: CheckCircle2,
            color: "var(--success-dark)",
          },
          {
            label: "Absent",
            value: ATTENDANCE_SUMMARY.absent,
            icon: AlertCircle,
            color: "var(--accent-red)",
          },
          {
            label: "Late",
            value: ATTENDANCE_SUMMARY.late,
            icon: Clock,
            color: "var(--warning)",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: color + "18" }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color }}>
                {value}
              </p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut chart */}
        <div
          className="bg-white rounded-xl border shadow-sm p-5"
          style={{
            borderColor: "var(--medium-gray)",
            borderLeft: `4px solid ${attColor}`,
          }}
        >
          <h3
            className="font-semibold text-sm mb-1"
            style={{ color: "var(--dark-gray)" }}
          >
            Attendance Breakdown
          </h3>
          <p className="text-xs text-gray-400 mb-2">
            {TERM_INFO.term} · {TERM_INFO.academicYear}
          </p>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n) => [`${v} days`, n]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {/* Centre label */}
              <text
                x="50%"
                y="46%"
                textAnchor="middle"
                dominantBaseline="central"
              >
                <tspan
                  x="50%"
                  dy="0"
                  style={{ fontSize: 26, fontWeight: 900, fill: attColor }}
                >
                  {attPct}%
                </tspan>
              </text>
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                dominantBaseline="central"
              >
                <tspan x="50%" dy="0" style={{ fontSize: 11, fill: "#6b7280" }}>
                  Attendance
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>

          {/* 95% warning */}
          {attPct < 95 ? (
            <div
              className="mt-2 p-3 rounded-xl text-xs font-semibold"
              style={{ backgroundColor: "#fffbeb", color: "#92400e" }}
            >
              ⚠ Below 95% — you need{" "}
              {Math.ceil(0.95 * ATTENDANCE_SUMMARY.totalDays) -
                ATTENDANCE_SUMMARY.present}{" "}
              more days present to meet the exam requirement.
            </div>
          ) : (
            <div
              className="mt-2 p-3 rounded-xl text-xs font-semibold"
              style={{
                backgroundColor: "#f0fdf4",
                color: "var(--success-dark)",
              }}
            >
              ✓ Excellent! You meet the 95% attendance requirement.
            </div>
          )}
        </div>

        {/* Weekly breakdown bar */}
        <div
          className="bg-white rounded-xl border shadow-sm p-5"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <h3
            className="font-semibold text-sm mb-1"
            style={{ color: "var(--dark-gray)" }}
          >
            Weekly Attendance
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Days per week — last 3 weeks
          </p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart
              data={weeklyData}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="present"
                name="Present"
                fill="var(--success-dark)"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
              <Bar
                dataKey="absent"
                name="Absent"
                fill="var(--accent-red)"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
              <Bar
                dataKey="late"
                name="Late"
                fill="var(--warning)"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: "var(--dark-gray)", fontWeight: 600 }}>
                Overall Rate
              </span>
              <span style={{ color: attColor, fontWeight: 700 }}>
                {attPct}%
              </span>
            </div>
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--medium-gray)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${attPct}%`, backgroundColor: attColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Records table */}
      <div
        className="bg-white rounded-xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-3.5 border-b"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
          }}
        >
          <h3
            className="font-semibold text-sm"
            style={{ color: "var(--dark-gray)" }}
          >
            Daily Records
          </h3>
          <div className="flex gap-2 flex-wrap">
            {["all", "present", "absent", "late"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg capitalize transition"
                style={{
                  backgroundColor: filter === f ? "var(--royal-blue)" : "white",
                  color: filter === f ? "white" : "var(--dark-gray)",
                  border: "1px solid var(--medium-gray)",
                }}
              >
                {f === "all"
                  ? `All (${ATTENDANCE_RECORDS.length})`
                  : `${f} (${ATTENDANCE_RECORDS.filter((r) => r.status === f).length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[440px]">
            <thead
              className="border-b"
              style={{
                backgroundColor: "var(--light-gray)",
                borderColor: "var(--medium-gray)",
              }}
            >
              <tr>
                {["Date", "Day", "Status", "Remark"].map((h) => (
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
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-gray-400"
                  >
                    No records
                  </td>
                </tr>
              ) : (
                filtered.map((rec, i) => {
                  const ss = STATUS_STYLE[rec.status];
                  return (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td
                        className="px-4 py-3 font-medium text-sm"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {new Date(rec.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{rec.day}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-bold"
                          style={{ backgroundColor: ss.bg, color: ss.color }}
                        >
                          {ss.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {rec.remark || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
