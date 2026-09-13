// src/student/dashboard/StudentHome.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ClipboardList,
  FileText,
  CalendarCheck,
  Bell,
  ChevronRight,
  TrendingUp,
  Award,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { resultsApi } from "../../api/results";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";

const TERM_INFO = {
  weeksGone: 0,
  weeksTotal: 14,
  startDate: "-",
  endDate: "-",
};

const getPerformanceBand = (pct: number) =>
  pct >= 75
    ? { label: "Excellent", color: "var(--success-dark)" }
    : pct >= 60
      ? { label: "Very Good", color: "var(--royal-blue)" }
      : pct >= 50
        ? { label: "Good", color: "var(--warning)" }
        : { label: "Needs Improvement", color: "var(--accent-red)" };

const getAttendanceColor = (pct: number) =>
  pct >= 95
    ? "var(--success-dark)"
    : pct >= 85
      ? "var(--warning)"
      : "var(--accent-red)";

const NotifIcon = ({ type }) => {
  if (type === "warning")
    return (
      <AlertCircle
        size={14}
        style={{ color: "var(--warning)" }}
        className="flex-shrink-0 mt-0.5"
      />
    );
  if (type === "success")
    return (
      <CheckCircle2
        size={14}
        style={{ color: "var(--success-dark)" }}
        className="flex-shrink-0 mt-0.5"
      />
    );
  return (
    <Info
      size={14}
      style={{ color: "var(--info)" }}
      className="flex-shrink-0 mt-0.5"
    />
  );
};

// Custom tooltip for bar chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="bg-white rounded-xl shadow-lg border px-3 py-2"
        style={{ borderColor: "var(--medium-gray)", fontSize: "12px" }}
      >
        <p className="font-bold" style={{ color: "var(--dark-gray)" }}>
          {label}
        </p>
        <p style={{ color: "var(--royal-blue)" }}>
          Score: <strong>{payload[0].value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

const StudentHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useSettings();
  const CURRENT_TERM = settings.currentTerm;
  const ACADEMIC_YEAR = settings.currentAcademicYear;

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    resultsApi
      .get({ term: CURRENT_TERM, academicYear: ACADEMIC_YEAR })
      .then(setResult)
      .catch(() => setResult(null));
  }, [CURRENT_TERM, ACADEMIC_YEAR]);

  const CURRENT_RESULTS = result || {
    term: CURRENT_TERM,
    academicYear: ACADEMIC_YEAR,
    subjects: [],
    position: 0,
    outOf: 0,
    aggregate: 0,
  };
  const ATTENDANCE_SUMMARY = result?.attendance || {
    present: 0,
    absent: 0,
    late: 0,
    totalDays: 0,
  };
  const PREVIOUS_RESULTS: any[] = [];
  const STUDENT_NOTIFICATIONS: any[] = [];

  const totalScore = CURRENT_RESULTS.subjects.reduce(
    (s, sub) => s + sub.total,
    0,
  );
  const maxScore = CURRENT_RESULTS.subjects.length * 100 || 1;
  const percentage = ((totalScore / maxScore) * 100).toFixed(1);
  const band = getPerformanceBand(parseFloat(percentage));
  const attPct = ATTENDANCE_SUMMARY.totalDays
    ? Math.round(
        ((ATTENDANCE_SUMMARY.present + ATTENDANCE_SUMMARY.late) /
          ATTENDANCE_SUMMARY.totalDays) *
          100,
      )
    : 0;
  const attColor = getAttendanceColor(attPct);
  const termProgress = Math.round(
    (TERM_INFO.weeksGone / TERM_INFO.weeksTotal) * 100,
  );

  // Chart data - subject scores for current term (shortened names)
  const subjectChartData = CURRENT_RESULTS.subjects.map((s) => ({
    name: s.name
      .replace("Integrated ", "Int. ")
      .replace("Language", "Lang.")
      .replace(" Studies", ""),
    score: s.total,
    grade: s.grade,
  }));

  // Term trend data
  const allTerms = [...PREVIOUS_RESULTS.slice().reverse(), CURRENT_RESULTS];
  const trendData = allTerms.map((t) => ({
    term: t.term.replace("Term ", "T"),
    avg: Math.round(
      t.subjects.reduce((s, sub) => s + sub.total, 0) / t.subjects.length,
    ),
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
        }}
      >
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <div className="w-48 h-48 rounded-full bg-white absolute -right-12 -top-12" />
          <div className="w-32 h-32 rounded-full bg-white absolute right-8 bottom-4" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm mb-1">Welcome back,</p>
            <h2 className="text-xl sm:text-2xl font-black">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-blue-300 text-xs mt-0.5">
              {user?.studentId} · {user?.formClass}
            </p>
            <p className="text-blue-300 text-xs">{user?.program} </p>
            <div
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Award size={12} /> {band.label} · {percentage}% overall
            </div>
          </div>
          <div
            className="rounded-xl p-3 text-center min-w-[130px] flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <p className="text-blue-200 text-xs">{ACADEMIC_YEAR}</p>
            <p className="font-bold text-sm">{CURRENT_TERM}</p>
            <p className="text-blue-200 text-xs mt-1"></p>
            <div
              className="mt-1.5 h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${termProgress}%`,
                  backgroundColor: "#facc15",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: BookOpen,
            label: "Subjects",
            value: CURRENT_RESULTS.subjects.length,
            sub: `${CURRENT_RESULTS.subjects.filter((s) => s.type === "Core").length} core · ${CURRENT_RESULTS.subjects.filter((s) => s.type === "Elective").length} elective`,
            color: "var(--royal-blue)",
            path: "/student/results",
          },
          {
            icon: TrendingUp,
            label: "Overall Score",
            value: `${percentage}%`,
            sub: band.label,
            color: band.color,
            path: "/student/results",
          },
          {
            icon: Award,
            label: "Class Position",
            value: `${CURRENT_RESULTS.position}/${CURRENT_RESULTS.totalStudents}`,
            sub: CURRENT_RESULTS.term,
            color: "var(--warning)",
            path: "/student/results",
          },
          {
            icon: CalendarCheck,
            label: "Attendance",
            value: `${attPct}%`,
            sub: `${ATTENDANCE_SUMMARY.present}/${ATTENDANCE_SUMMARY.totalDays} days`,
            color: attColor,
            path: "/student/attendance",
          },
        ].map(({ icon: Icon, label, value, sub, color, path }) => (
          <div
            key={label}
            onClick={() => navigate(path)}
            className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm cursor-pointer hover:shadow-md transition-all"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: color + "18" }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div className="min-w-0">
              <p
                className="text-xl font-black"
                style={{ color: "var(--dark-gray)" }}
              >
                {value}
              </p>
              <p className="text-xs text-gray-500 truncate">{label}</p>
              {sub && (
                <p className="text-xs font-semibold truncate" style={{ color }}>
                  {sub}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject scores bar chart */}
        <div
          className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-5"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="font-semibold text-sm"
                style={{ color: "var(--dark-gray)" }}
              >
                Subject Scores - {CURRENT_RESULTS.term}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Pass mark: 50 · Credit: 50+
              </p>
            </div>
            <button
              onClick={() => navigate("/student/results")}
              className="text-xs flex items-center gap-1"
              style={{ color: "var(--royal-blue)" }}
            >
              Full results <ChevronRight size={12} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={subjectChartData}
              margin={{ top: 5, right: 10, left: -20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#6b7280" }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#6b7280" }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={50}
                stroke="var(--accent-red)"
                strokeDasharray="4 4"
                label={{
                  value: "Pass (50)",
                  position: "insideTopRight",
                  fontSize: 10,
                  fill: "var(--accent-red)",
                }}
              />
              <ReferenceLine
                y={80}
                stroke="var(--success-dark)"
                strokeDasharray="4 4"
                label={{
                  value: "A1 (80)",
                  position: "insideTopRight",
                  fontSize: 10,
                  fill: "var(--success-dark)",
                }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {subjectChartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.score >= 80
                        ? "var(--success-dark)"
                        : entry.score >= 60
                          ? "var(--royal-blue)"
                          : entry.score >= 50
                            ? "var(--warning)"
                            : "var(--accent-red)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Mini legend */}
          <div className="flex flex-wrap gap-3 mt-1 justify-center">
            {[
              { color: "var(--success-dark)", label: "A1 (80+)" },
              { color: "var(--royal-blue)", label: "Credit (60+)" },
              { color: "var(--warning)", label: "Pass (50+)" },
              { color: "var(--accent-red)", label: "Fail (<50)" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div
          className="bg-white rounded-xl border shadow-sm overflow-hidden"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div
            className="flex items-center gap-2 px-5 py-3.5 border-b"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <Bell size={15} style={{ color: "var(--royal-blue)" }} />
            <h3
              className="font-semibold text-sm"
              style={{ color: "var(--dark-gray)" }}
            >
              Notifications
            </h3>
            <span
              className="ml-auto w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
              style={{ backgroundColor: "var(--accent-red)" }}
            >
              {STUDENT_NOTIFICATIONS.length}
            </span>
          </div>
          <div
            className="divide-y"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {STUDENT_NOTIFICATIONS.map((n) => (
              <div key={n.id} className="px-4 py-3 hover:bg-gray-50">
                <div className="flex gap-2">
                  <NotifIcon type={n.type} />
                  <div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Term trend + Attendance + Track */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Term trend chart */}
        <div
          className="bg-white rounded-xl border shadow-sm p-5"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <h3
            className="font-semibold text-sm mb-1"
            style={{ color: "var(--dark-gray)" }}
          >
            Average Score Trend
          </h3>
          <p className="text-xs text-gray-400 mb-4">Across all terms</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={trendData}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="term" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                domain={[0, 100]}
              />
              <Tooltip
                formatter={(v) => [`${v}%`, "Avg Score"]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="avg" fill="var(--royal-blue)" radius={[6, 6, 0, 0]}>
                {trendData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === trendData.length - 1
                        ? "var(--accent-red)"
                        : "var(--royal-blue)"
                    }
                    opacity={i === trendData.length - 1 ? 1 : 0.6}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-center text-gray-400 mt-2">
            Current term highlighted in red
          </p>
        </div>

        {/* Attendance summary */}
        <div
          className="bg-white rounded-xl border shadow-sm overflow-hidden"
          style={{
            borderColor: "var(--medium-gray)",
            borderLeft: `4px solid ${attColor}`,
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-3.5 border-b"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <h3
              className="font-semibold text-sm flex items-center gap-2"
              style={{ color: "var(--dark-gray)" }}
            >
              <CalendarCheck size={15} style={{ color: attColor }} /> Attendance
            </h3>
            <button
              onClick={() => navigate("/student/attendance")}
              className="text-xs flex items-center gap-1"
              style={{ color: attColor }}
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                {
                  label: "Present",
                  value: ATTENDANCE_SUMMARY.present,
                  color: "var(--success-dark)",
                },
                {
                  label: "Absent",
                  value: ATTENDANCE_SUMMARY.absent,
                  color: "var(--accent-red)",
                },
                { label: "Rate", value: `${attPct}%`, color: attColor },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="text-center p-2 rounded-xl"
                  style={{ backgroundColor: "var(--light-gray)" }}
                >
                  <p className="text-lg font-black" style={{ color }}>
                    {value}
                  </p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: "var(--dark-gray)", fontWeight: 600 }}>
                  Attendance Rate
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
              {attPct < 95 && (
                <p className="text-xs mt-1" style={{ color: "var(--warning)" }}>
                  ⚠ Below 95% required threshold
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Track schedule */}
        <div
          className="bg-white rounded-xl border shadow-sm p-5"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <h3
            className="font-semibold text-sm flex items-center gap-2 mb-4"
            style={{ color: "var(--dark-gray)" }}
          >
            <RefreshCw size={15} style={{ color: "var(--royal-blue)" }} />{" "}
            Transitional System
          </h3>
          <div className="space-y-3">
            <div
              className="rounded-xl p-4 border"
              style={{ backgroundColor: "#fefce8", borderColor: "#fde68a" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "var(--warning)" }}
                />
                <span
                  className="font-semibold text-sm"
                  style={{ color: "#78350f" }}
                >
                  Semester 1 - In Session
                </span>
              </div>
              <p className="text-xs" style={{ color: "#92400e" }}>
                {new Date(TERM_INFO.startDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                –{" "}
                {new Date(TERM_INFO.endDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p
                className="text-xs font-semibold mt-1"
                style={{ color: "#78350f" }}
              ></p>
            </div>
            <div
              className="rounded-xl p-4 border"
              style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "var(--success)" }}
                />
                <span
                  className="font-semibold text-sm"
                  style={{ color: "#14532d" }}
                >
                  Semester 2 - On Vacation
                </span>
              </div>
              <p className="text-xs" style={{ color: "#166534" }}>
                Resumes April 14, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
