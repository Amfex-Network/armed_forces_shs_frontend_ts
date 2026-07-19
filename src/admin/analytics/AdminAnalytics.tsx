// src/admin/analytics/AdminAnalytics.jsx
import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  Award,
  BookOpen,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

// ─── Mock data ────────────────────────────────────────────────────────────────
const TERM_PERFORMANCE = [
  { term: "T1 23/24", avg: 62, passRate: 78, attendance: 88, creditPass: 68 },
  { term: "T2 23/24", avg: 65, passRate: 81, attendance: 90, creditPass: 71 },
  { term: "T3 23/24", avg: 64, passRate: 80, attendance: 87, creditPass: 70 },
  { term: "T1 24/25", avg: 68, passRate: 84, attendance: 91, creditPass: 74 },
  { term: "T2 24/25", avg: 71, passRate: 87, attendance: 91, creditPass: 78 },
];

const DEPT_PERFORMANCE = [
  { dept: "Science", avg: 74, passRate: 91, teachers: 8, students: 148 },
  { dept: "Mathematics", avg: 70, passRate: 87, teachers: 6, students: 486 },
  { dept: "English", avg: 72, passRate: 89, teachers: 5, students: 486 },
  { dept: "Social Std", avg: 68, passRate: 85, teachers: 4, students: 486 },
  { dept: "Technical", avg: 65, passRate: 82, teachers: 7, students: 116 },
  { dept: "Business", avg: 69, passRate: 86, teachers: 5, students: 98 },
  { dept: "Arts", avg: 71, passRate: 88, teachers: 7, students: 124 },
];

const GRADE_DIST = [
  { grade: "A1", count: 142, pct: 29 },
  { grade: "B2", count: 118, pct: 24 },
  { grade: "B3", count: 96, pct: 20 },
  { grade: "C4", count: 72, pct: 15 },
  { grade: "C5", count: 48, pct: 10 },
  { grade: "D7", count: 10, pct: 2 },
];

const SUBJECT_RADAR = [
  { subject: "Core Maths", avg: 70, fullMark: 100 },
  { subject: "English", avg: 72, fullMark: 100 },
  { subject: "Int. Science", avg: 68, fullMark: 100 },
  { subject: "Social Std", avg: 65, fullMark: 100 },
  { subject: "ICT", avg: 75, fullMark: 100 },
  { subject: "Physics", avg: 71, fullMark: 100 },
];

const SCORE_SUBMISSION = [
  { dept: "Science", submitted: 8, pending: 0 },
  { dept: "Maths", submitted: 5, pending: 1 },
  { dept: "English", submitted: 5, pending: 0 },
  { dept: "Social Std", submitted: 3, pending: 1 },
  { dept: "Technical", submitted: 5, pending: 2 },
  { dept: "Business", submitted: 4, pending: 1 },
];

const YEAR_GROUP_PERF = [
  { year: "Form 1", avg: 68, attendance: 94, students: 162 },
  { year: "Form 2", avg: 71, attendance: 90, students: 168 },
  { year: "Form 3", avg: 74, attendance: 88, students: 156 },
];

const COLORS = [
  "#16a34a",
  "#2563eb",
  "#3b82f6",
  "#ca8a04",
  "#ea580c",
  "#dc2626",
];

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white rounded-xl shadow-lg border px-3 py-2 text-xs"
      style={{ borderColor: "var(--medium-gray)" }}
    >
      <p className="font-bold mb-1" style={{ color: "var(--dark-gray)" }}>
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}:{" "}
          <strong>
            {p.value}
            {p.unit || ""}
          </strong>
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ label, value, sub, color, icon: Icon }) => (
  <div
    className="bg-white rounded-xl border p-4 shadow-sm flex items-center gap-3"
    style={{ borderColor: "var(--medium-gray)" }}
  >
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: color + "18" }}
    >
      <Icon size={20} style={{ color }} />
    </div>
    <div className="min-w-0">
      <p className="text-xl font-black" style={{ color: "var(--dark-gray)" }}>
        {value}
      </p>
      <p className="text-xs text-gray-500">{label}</p>
      {sub && (
        <p className="text-xs font-semibold" style={{ color }}>
          {sub}
        </p>
      )}
    </div>
  </div>
);

const Card = ({ title, subtitle, children }) => (
  <div
    className="bg-white rounded-xl border shadow-sm overflow-hidden"
    style={{ borderColor: "var(--medium-gray)" }}
  >
    <div
      className="px-5 py-3.5 border-b"
      style={{
        borderColor: "var(--medium-gray)",
        backgroundColor: "var(--light-gray)",
      }}
    >
      <p
        className="font-semibold text-sm"
        style={{ color: "var(--dark-gray)" }}
      >
        {title}
      </p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const AdminAnalytics = () => {
  const [termFilter, setTermFilter] = useState("T2 24/25");
  const totalPending = SCORE_SUBMISSION.reduce((s, d) => s + d.pending, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            School Analytics
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            2024/2025 · Term 2 · Armed Forces SHTS
          </p>
        </div>
        <div className="relative">
          <select
            value={termFilter}
            onChange={(e) => setTermFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm font-semibold rounded-xl border-2 outline-none cursor-pointer"
            style={{
              borderColor: "var(--royal-blue)",
              color: "var(--royal-blue)",
              backgroundColor: "#eef2ff",
            }}
          >
            {TERM_PERFORMANCE.map((t) => (
              <option key={t.term} value={t.term}>
                {t.term}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Award}
          label="School Pass Rate"
          value="87%"
          sub="credit & above"
          color="var(--success-dark)"
        />
        <StatCard
          icon={TrendingUp}
          label="Average Score"
          value="71%"
          sub="all subjects"
          color="var(--royal-blue)"
        />
        <StatCard
          icon={Users}
          label="Attendance Rate"
          value="91%"
          sub="this term"
          color="var(--info)"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Submissions"
          value={totalPending}
          sub="need follow-up"
          color={totalPending > 0 ? "var(--accent-red)" : "var(--success-dark)"}
        />
      </div>

      {/* Row 1 — Term trend + Grade distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Performance Trend"
          subtitle="Avg score, pass rate & attendance across 5 terms"
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={TERM_PERFORMANCE}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="avgG" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--royal-blue)"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--royal-blue)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="passG" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--success-dark)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--success-dark)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="term" tick={{ fontSize: 10, fill: "#6b7280" }} />
              <YAxis
                tick={{ fontSize: 10, fill: "#6b7280" }}
                domain={[50, 100]}
              />
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="avg"
                name="Avg Score (%)"
                stroke="var(--royal-blue)"
                fill="url(#avgG)"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="passRate"
                name="Pass Rate (%)"
                stroke="var(--success-dark)"
                fill="url(#passG)"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="creditPass"
                name="Credit Pass (%)"
                stroke="var(--warning)"
                strokeWidth={2}
                dot={{ r: 3 }}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card
          title="Grade Distribution"
          subtitle="Current term — all 486 students"
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={GRADE_DIST}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="grade" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                {GRADE_DIST.map((e, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div
              className="text-center p-2 rounded-lg"
              style={{ backgroundColor: "#f0fdf4" }}
            >
              <p
                className="text-lg font-black"
                style={{ color: "var(--success-dark)" }}
              >
                {GRADE_DIST.slice(0, 3).reduce((s, g) => s + g.count, 0)}
              </p>
              <p className="text-xs text-gray-500">A1–B3 (Strong)</p>
            </div>
            <div
              className="text-center p-2 rounded-lg"
              style={{ backgroundColor: "#fffbeb" }}
            >
              <p
                className="text-lg font-black"
                style={{ color: "var(--warning)" }}
              >
                {GRADE_DIST.slice(3).reduce((s, g) => s + g.count, 0)}
              </p>
              <p className="text-xs text-gray-500">C4–D7 (Average/Below)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2 — Dept performance + Year group */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Department Performance"
            subtitle="Average score & pass rate by department"
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={DEPT_PERFORMANCE}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="dept"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  domain={[0, 100]}
                />
                <Tooltip content={<Tip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar
                  dataKey="avg"
                  name="Avg Score (%)"
                  fill="var(--royal-blue)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="passRate"
                  name="Pass Rate (%)"
                  fill="var(--success-dark)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <Card
          title="Subject Radar"
          subtitle="Average scores across core subjects"
        >
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={SUBJECT_RADAR}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 10, fill: "#6b7280" }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 9 }}
              />
              <Radar
                name="Avg Score"
                dataKey="avg"
                stroke="var(--royal-blue)"
                fill="var(--royal-blue)"
                fillOpacity={0.25}
              />
              <Tooltip
                formatter={(v) => [`${v}%`, "Avg Score"]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 3 — Year groups + Score submission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Year Group Analysis" subtitle="Performance by form year">
          <div className="space-y-4">
            {YEAR_GROUP_PERF.map((y) => (
              <div
                key={y.year}
                className="p-4 rounded-xl border"
                style={{
                  borderColor: "var(--medium-gray)",
                  backgroundColor: "var(--light-gray)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p
                    className="font-bold text-sm"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {y.year}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span
                      style={{ color: "var(--royal-blue)", fontWeight: 700 }}
                    >
                      {y.avg}% avg
                    </span>
                    <span
                      style={{ color: "var(--success-dark)", fontWeight: 700 }}
                    >
                      {y.attendance}% att
                    </span>
                    <span className="text-gray-400">{y.students} students</span>
                  </div>
                </div>
                <div
                  className="h-2.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--medium-gray)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${y.avg}%`,
                      backgroundColor:
                        y.avg >= 70
                          ? "var(--success-dark)"
                          : y.avg >= 60
                            ? "var(--royal-blue)"
                            : "var(--warning)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Score Submission Status"
          subtitle="Current term — by department"
        >
          <div className="space-y-3">
            {SCORE_SUBMISSION.map((d) => (
              <div key={d.dept} className="flex items-center gap-3">
                <div
                  className="w-24 text-xs font-semibold flex-shrink-0"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {d.dept}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div
                    className="flex-1 h-3 rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--medium-gray)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((d.submitted / (d.submitted + d.pending)) * 100)}%`,
                        backgroundColor:
                          d.pending > 0
                            ? "var(--warning)"
                            : "var(--success-dark)",
                      }}
                    />
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <span
                      className="text-xs font-bold"
                      style={{ color: "var(--success-dark)" }}
                    >
                      {d.submitted} ✓
                    </span>
                    {d.pending > 0 && (
                      <span
                        className="text-xs font-bold"
                        style={{ color: "var(--accent-red)" }}
                      >
                        {d.pending} ⏱
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="mt-4 p-3 rounded-xl"
            style={{
              backgroundColor: totalPending > 0 ? "#fffbeb" : "#f0fdf4",
            }}
          >
            <p
              className="text-xs font-semibold"
              style={{
                color: totalPending > 0 ? "#92400e" : "var(--success-dark)",
              }}
            >
              {totalPending > 0
                ? `⚠ ${totalPending} submission(s) pending — follow up with department heads`
                : "✓ All scores submitted for this term"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
