// src/parent/attendance/ParentAttendance.jsx
import React, { useState } from "react";
import { CalendarCheck, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  STATUS_STYLE,
  getAttendanceColor,
  CHILD_ATTENDANCE,
} from "../data/parentData";
import { useActiveChild } from "../ParentDashboardLayout";

const ParentAttendance = () => {
  const { activeChild } = useActiveChild();
  const [filter, setFilter] = useState("all");

  if (!activeChild)
    return (
      <div className="text-center py-12 text-gray-400">No child selected.</div>
    );

  const childAttData = CHILD_ATTENDANCE
    ? CHILD_ATTENDANCE[activeChild?.studentId] ||
      CHILD_ATTENDANCE[Object.keys(CHILD_ATTENDANCE)[0]]
    : null;

  const att = childAttData?.summary || {
    totalDays: 0,
    present: 0,
    absent: 0,
    percentage: 0,
  };
  const records = childAttData?.records || [];
  const attPct =
    att.totalDays > 0 ? Math.round((att.present / att.totalDays) * 100) : 0;
  const attColor = getAttendanceColor(attPct);

  const filtered =
    filter === "all" ? records : records.filter((r) => r.status === filter);

  const pieData = [
    { name: "Present", value: att.present, color: "var(--success-dark)" },
    { name: "Absent", value: att.absent, color: "var(--accent-red)" },
    { name: "Late", value: att.late, color: "var(--warning)" },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-xl font-black"
          style={{ color: "var(--dark-gray)" }}
        >
          {activeChild.firstName}'s Attendance
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {activeChild.formClass} · {activeChild.program}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Days",
            value: att.totalDays,
            icon: CalendarCheck,
            color: "var(--royal-blue)",
          },
          {
            label: "Present",
            value: att.present,
            icon: CheckCircle2,
            color: "var(--success-dark)",
          },
          {
            label: "Absent",
            value: att.absent,
            icon: AlertCircle,
            color: "var(--accent-red)",
          },
          {
            label: "Late",
            value: att.late,
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

      {/* Alert */}
      {attPct < 95 && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl border"
          style={{ backgroundColor: "#fffbeb", borderColor: "#fcd34d" }}
        >
          <AlertCircle
            size={16}
            style={{ color: "var(--warning)" }}
            className="flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm font-bold" style={{ color: "#92400e" }}>
              Attendance Below Required Level
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#92400e" }}>
              {activeChild.firstName}'s attendance is <strong>{attPct}%</strong>
              . The required minimum is 95%. Please ensure your ward attends
              school regularly.
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <p className="text-xs text-gray-400 mb-2">This term</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
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
              <text
                x="50%"
                y="45%"
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
        </div>

        {/* Progress */}
        <div
          className="bg-white rounded-xl border shadow-sm p-5"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <h3
            className="font-semibold text-sm mb-4"
            style={{ color: "var(--dark-gray)" }}
          >
            Attendance Rate
          </h3>
          <div className="space-y-4">
            {[
              {
                label: "Present",
                value: att.present,
                total: att.totalDays,
                color: "var(--success-dark)",
              },
              {
                label: "Absent",
                value: att.absent,
                total: att.totalDays,
                color: "var(--accent-red)",
              },
              {
                label: "Late",
                value: att.late,
                total: att.totalDays,
                color: "var(--warning)",
              },
            ].map(({ label, value, total, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "var(--dark-gray)", fontWeight: 600 }}>
                    {label}
                  </span>
                  <span style={{ color, fontWeight: 700 }}>
                    {value} days ({Math.round((value / total) * 100)}%)
                  </span>
                </div>
                <div
                  className="h-3 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--medium-gray)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(value / total) * 100}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            className="mt-5 p-3 rounded-xl"
            style={{ backgroundColor: attPct >= 95 ? "#f0fdf4" : "#fffbeb" }}
          >
            <p
              className="text-xs font-semibold"
              style={{
                color: attPct >= 95 ? "var(--success-dark)" : "#92400e",
              }}
            >
              {attPct >= 95
                ? `${activeChild.firstName} meets the 95% attendance requirement.`
                : `⚠ ${attPct}% — below the 95% exam requirement.`}
            </p>
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
                  ? `All (${records.length})`
                  : `${f} (${records.filter((r) => r.status === f).length})`}
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

export default ParentAttendance;
