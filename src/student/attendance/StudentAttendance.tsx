// src/student/attendance/StudentAttendance.tsx
import React, { useState, useEffect } from "react";
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
import { attendanceApi } from "../../api/attendance";
import { useAuth } from "../../context/AuthContext";

const STATUS_STYLE: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  present: { bg: "#f0fdf4", color: "var(--success-dark)", label: "Present" },
  absent: { bg: "#fff1f2", color: "var(--accent-red)", label: "Absent" },
  late: { bg: "#fffbeb", color: "var(--warning)", label: "Late" },
  excused: { bg: "#eef2ff", color: "var(--royal-blue)", label: "Excused" },
};

const getAttendanceColor = (pct: number) =>
  pct >= 95
    ? "var(--success-dark)"
    : pct >= 85
      ? "var(--warning)"
      : "var(--accent-red)";

const weekKey = (dateStr: string) => {
  const d = new Date(dateStr);
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7,
  );
  return `Wk ${week}`;
};

const StudentAttendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let active = true;
    attendanceApi
      .list()
      .then((recs) => {
        if (active) setRecords(recs);
      })
      .catch(() => {
        if (active) setRecords([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const summary = {
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
    totalDays: records.length,
  };
  const attPct = summary.totalDays
    ? Math.round(((summary.present + summary.late) / summary.totalDays) * 100)
    : 0;
  const attColor = getAttendanceColor(attPct);

  const filtered =
    filter === "all" ? records : records.filter((r) => r.status === filter);

  const pieData = [
    { name: "Present", value: summary.present, color: "var(--success-dark)" },
    { name: "Absent", value: summary.absent, color: "var(--accent-red)" },
    { name: "Late", value: summary.late, color: "var(--warning)" },
  ].filter((d) => d.value > 0);

  const weeklyMap: Record<string, any> = {};
  records.forEach((r) => {
    const k = weekKey(r.date);
    if (!weeklyMap[k])
      weeklyMap[k] = { week: k, present: 0, absent: 0, late: 0 };
    if (weeklyMap[k][r.status] !== undefined) weeklyMap[k][r.status] += 1;
  });
  const weeklyData = Object.values(weeklyMap).slice(-4);

  if (loading)
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Loading attendance…
      </div>
    );

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
          {user?.formClass || "Your attendance record"}
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Days",
            value: summary.totalDays,
            icon: CalendarCheck,
            color: "var(--royal-blue)",
          },
          {
            label: "Present",
            value: summary.present,
            icon: CheckCircle2,
            color: "var(--success-dark)",
          },
          {
            label: "Absent",
            value: summary.absent,
            icon: AlertCircle,
            color: "var(--accent-red)",
          },
          {
            label: "Late",
            value: summary.late,
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

      {summary.totalDays === 0 ? (
        <div
          className="bg-white rounded-xl border shadow-sm p-12 text-center text-sm text-gray-400"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          No attendance has been recorded for you yet.
        </div>
      ) : (
        <>
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
                </PieChart>
              </ResponsiveContainer>

              {attPct < 95 ? (
                <div
                  className="mt-2 p-3 rounded-xl text-xs font-semibold"
                  style={{ backgroundColor: "#fffbeb", color: "#92400e" }}
                >
                  ⚠ Below the 95% attendance requirement for exams.
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
                Days per week — recent weeks
              </p>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart
                  data={weeklyData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
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
        </>
      )}

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
                  const ss = STATUS_STYLE[rec.status] || STATUS_STYLE.present;
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
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(rec.date).toLocaleDateString("en-GB", {
                          weekday: "long",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-bold"
                          style={{ backgroundColor: ss.bg, color: ss.color }}
                        >
                          {ss.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {rec.note || "—"}
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
