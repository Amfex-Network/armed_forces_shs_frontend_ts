import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Award,
  CalendarCheck,
  ChevronRight,
  BookOpen,
  AlertCircle,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { resultsApi, ReportResult } from "../../api/results";
import { useActiveChild } from "../ParentDashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";

const GRADE_COLOR: Record<string, string> = {
  A1: "text-green-700 bg-green-50",
  B2: "text-blue-700 bg-blue-50",
  B3: "text-blue-600 bg-blue-50",
  C4: "text-yellow-700 bg-yellow-50",
  C5: "text-orange-600 bg-orange-50",
  C6: "text-orange-700 bg-orange-50",
  D7: "text-red-500 bg-red-50",
  E8: "text-red-600 bg-red-50",
  F9: "text-red-700 bg-red-50",
};
const getGradeColor = (g: string) =>
  GRADE_COLOR[g] || "text-gray-600 bg-gray-50";
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

const NoChild = () => (
  <div className="text-center py-16">
    <Users size={48} className="mx-auto mb-3 text-gray-300" />
    <p className="text-gray-400 font-medium">
      No child linked to your account.
    </p>
    <p className="text-gray-400 text-sm mt-1">
      Please contact the Admin office.
    </p>
  </div>
);

const ParentHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    activeChild,
    children,
    activeChildId,
    setActiveChildId,
    loading: childLoading,
  } = useActiveChild();
  const { settings } = useSettings();
  const CURRENT_TERM = settings.currentTerm;
  const ACADEMIC_YEAR = settings.currentAcademicYear;

  const [result, setResult] = useState<ReportResult | null>(null);
  const [loading, setLoading] = useState(true);

  const childId = activeChild?.id;

  useEffect(() => {
    if (!childId) {
      setResult(null);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    resultsApi
      .get({ student: childId, term: CURRENT_TERM, academicYear: ACADEMIC_YEAR })
      .then((res) => {
        if (alive) setResult(res);
      })
      .catch(() => {
        if (alive) setResult(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [childId, CURRENT_TERM, ACADEMIC_YEAR]);

  if (childLoading || loading)
    return (
      <div className="py-20 text-center text-sm text-gray-400">Loading…</div>
    );
  if (!activeChild) return <NoChild />;

  const subjects = result?.subjects || [];
  const totalScore = subjects.reduce((s, sub) => s + sub.total, 0);
  const maxScore = (subjects.length || 1) * 100;
  const percentage = ((totalScore / maxScore) * 100).toFixed(1);
  const band = getPerformanceBand(parseFloat(percentage));
  const att = result?.attendance;
  const attPct = att?.rate ?? 0;
  const attColor = getAttendanceColor(attPct);
  const hasResults = subjects.length > 0;

  const chartData = subjects.map((s) => ({
    name: s.name
      .replace("Integrated ", "Int. ")
      .replace("Language", "Lang.")
      .replace(" Studies", ""),
    score: s.total,
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
            <p className="text-blue-200 text-sm mb-1">
              Welcome, {user?.title} {user?.lastName}
            </p>
            <h2 className="text-xl sm:text-2xl font-black">
              {activeChild.firstName} {activeChild.lastName}
            </h2>
            <p className="text-blue-300 text-xs mt-0.5">
              {activeChild.studentId} · {activeChild.formClass}
            </p>
            <p className="text-blue-300 text-xs">{activeChild.course}</p>
            {hasResults && (
              <div
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <Award size={12} /> {band.label} · {percentage}% overall
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {children.length > 1 && (
              <div className="flex gap-1.5">
                {children.map((child) => {
                  const id = child.id as string;
                  const isActive = id === activeChildId;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveChildId(id)}
                      className="text-xs font-bold px-2.5 py-1 rounded-lg transition"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(255,255,255,0.15)",
                        color: isActive ? "var(--royal-blue)" : "white",
                      }}
                    >
                      {child.firstName}
                    </button>
                  );
                })}
              </div>
            )}
            <div
              className="rounded-xl p-3 text-center min-w-[130px]"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <p className="text-blue-200 text-xs">{ACADEMIC_YEAR}</p>
              <p className="font-bold text-sm">{CURRENT_TERM}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: BookOpen,
            label: "Subjects",
            value: subjects.length,
            sub: hasResults ? `${result?.term}` : "No results yet",
            color: "var(--royal-blue)",
            path: "/parent/results",
          },
          {
            icon: TrendingUp,
            label: "Overall Score",
            value: hasResults ? `${percentage}%` : "-",
            sub: hasResults ? band.label : "Pending",
            color: band.color,
            path: "/parent/results",
          },
          {
            icon: Award,
            label: "Class Position",
            value: hasResults ? `${result?.position}/${result?.outOf}` : "-",
            sub: result?.term || CURRENT_TERM,
            color: "var(--warning)",
            path: "/parent/results",
          },
          {
            icon: CalendarCheck,
            label: "Attendance",
            value: att && att.totalDays > 0 ? `${attPct}%` : "-",
            sub:
              att && att.totalDays > 0
                ? `${att.present}/${att.totalDays} days`
                : "Not recorded",
            color: attColor,
            path: "/parent/attendance",
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

      {/* Attendance alert */}
      {att && att.totalDays > 0 && attPct < 95 && (
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
              Attendance Alert
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#92400e" }}>
              {activeChild.firstName}'s attendance is <strong>{attPct}%</strong>{" "}
              - below the required 95%. Please ensure regular school attendance
              to avoid exam eligibility issues.
            </p>
          </div>
        </div>
      )}

      {!hasResults ? (
        <div
          className="bg-white rounded-xl border shadow-sm py-16 text-center"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <BookOpen size={44} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-400 font-medium">
            No results published for {activeChild.firstName} yet.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Scores will appear here once teachers enter and the admin publishes
            them.
          </p>
        </div>
      ) : (
        <>
          {/* Subject scores chart */}
          <div
            className="bg-white rounded-xl border shadow-sm p-5"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className="font-semibold text-sm"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Subject Scores - {result?.term}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {activeChild.firstName}'s performance per subject
                </p>
              </div>
              <button
                onClick={() => navigate("/parent/results")}
                className="text-xs flex items-center gap-1"
                style={{ color: "var(--royal-blue)" }}
              >
                Full results <ChevronRight size={12} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={chartData}
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
                <Tooltip
                  formatter={(v) => [`${v}%`, "Score"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
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
          </div>

          {/* Results preview */}
          <div
            className="bg-white rounded-xl border shadow-sm overflow-hidden"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div
              className="flex items-center justify-between px-5 py-3.5 border-b"
              style={{
                borderColor: "var(--medium-gray)",
                backgroundColor: "var(--light-gray)",
              }}
            >
              <h3
                className="font-semibold text-sm"
                style={{ color: "var(--dark-gray)" }}
              >
                {result?.term} Results - {result?.academicYear}
              </h3>
              <button
                onClick={() => navigate("/parent/results")}
                className="text-xs flex items-center gap-1"
                style={{ color: "var(--royal-blue)" }}
              >
                Full view <ChevronRight size={12} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[460px]">
                <thead
                  className="border-b"
                  style={{
                    backgroundColor: "var(--light-gray)",
                    borderColor: "var(--medium-gray)",
                  }}
                >
                  <tr>
                    {["Subject", "CA", "Exam", "Total", "Grade"].map((h) => (
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
                  {subjects.map((sub, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td
                        className="px-4 py-3 font-medium"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {sub.name}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {sub.ca}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {sub.exam}
                      </td>
                      <td
                        className="px-4 py-3 text-center font-black"
                        style={{ color: "var(--royal-blue)" }}
                      >
                        {sub.total}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-black ${getGradeColor(sub.grade)}`}
                        >
                          {sub.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ParentHome;
