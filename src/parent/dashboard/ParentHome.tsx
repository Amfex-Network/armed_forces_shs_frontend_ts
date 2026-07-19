// src/parent/dashboard/ParentHome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Award,
  CalendarCheck,
  Bell,
  ChevronRight,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Info,
  RefreshCw,
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
import {
  TERM_INFO,
  SCHOOL_NOTICES,
  CHILD_RESULTS,
  CHILD_ATTENDANCE,
  getGradeColor,
  getPerformanceBand,
  getAttendanceColor,
} from "../data/parentData";
import { useActiveChild } from "../ParentDashboardLayout";
import { useAuth } from "../../context/AuthContext";

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
  const { activeChild, childIds, setActiveChildId } = useActiveChild();

  if (!activeChild) return <NoChild />;

  const childResults =
    CHILD_RESULTS[activeChild.studentId] ||
    CHILD_RESULTS[Object.keys(CHILD_RESULTS)[0]];
  const childAttData =
    CHILD_ATTENDANCE[activeChild.studentId] ||
    CHILD_ATTENDANCE[Object.keys(CHILD_ATTENDANCE)[0]];
  const results = childResults?.current;
  const att = childAttData?.summary;
  const totalScore =
    results?.subjects?.reduce((s, sub) => s + sub.total, 0) || 0;
  const maxScore = (results?.subjects?.length || 1) * 100;
  const percentage = ((totalScore / maxScore) * 100).toFixed(1);
  const band = getPerformanceBand(parseFloat(percentage));
  const attPct = Math.round((att.present / att.totalDays) * 100);
  const attColor = getAttendanceColor(attPct);
  const termProgress = Math.round(
    (TERM_INFO.weeksGone / TERM_INFO.weeksTotal) * 100,
  );

  // Chart data
  const chartData = results.subjects.map((s) => ({
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
            <p className="text-blue-300 text-xs">
              {activeChild.program} · {activeChild.year || "Form 1"}
            </p>
            <div
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Award size={12} /> {band.label} · {percentage}% overall
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {/* Child tabs if multiple children */}
            {childIds.length > 1 && (
              <div className="flex gap-1.5">
                {childIds.map((id) => {
                  const isActive = id === activeChild.studentId;
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
                      Child {childIds.indexOf(id) + 1}
                    </button>
                  );
                })}
              </div>
            )}
            <div
              className="rounded-xl p-3 text-center min-w-[130px]"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <p className="text-blue-200 text-xs">{TERM_INFO.academicYear}</p>
              <p className="font-bold text-sm">{TERM_INFO.term}</p>
              <p className="text-blue-200 text-xs mt-1">
                Wk {TERM_INFO.weeksGone}/{TERM_INFO.weeksTotal}
              </p>
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: BookOpen,
            label: "Subjects",
            value: results.subjects.length,
            sub: `${results.subjects.filter((s) => s.type === "Core").length} core · ${results.subjects.filter((s) => s.type === "Elective").length} elective`,
            color: "var(--royal-blue)",
            path: "/parent/results",
          },
          {
            icon: TrendingUp,
            label: "Overall Score",
            value: `${percentage}%`,
            sub: band.label,
            color: band.color,
            path: "/parent/results",
          },
          {
            icon: Award,
            label: "Class Position",
            value: `${results.position}/${results.totalStudents}`,
            sub: results.term,
            color: "var(--warning)",
            path: "/parent/results",
          },
          {
            icon: CalendarCheck,
            label: "Attendance",
            value: `${attPct}%`,
            sub: `${att.present}/${att.totalDays} days`,
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

      {/* Alerts */}
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
              Attendance Alert
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#92400e" }}>
              {activeChild.firstName}'s attendance is <strong>{attPct}%</strong>{" "}
              — below the required 95%. Please ensure regular school attendance
              to avoid exam eligibility issues.
            </p>
          </div>
        </div>
      )}

      {/* Chart + Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject scores chart */}
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
                Subject Scores — {results.term}
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

        {/* School notices */}
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
              School Notices
            </h3>
            <span
              className="ml-auto w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
              style={{ backgroundColor: "var(--accent-red)" }}
            >
              {SCHOOL_NOTICES.length}
            </span>
          </div>
          <div
            className="divide-y"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {SCHOOL_NOTICES.map((n) => (
              <div key={n.id} className="px-4 py-3 hover:bg-gray-50">
                <div className="flex gap-2">
                  <NotifIcon type={n.type} />
                  <div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
            {results.term} Results — {results.academicYear}
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
                {["Subject", "Type", "CA", "Exam", "Total", "Grade"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {results.subjects.map((sub, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {sub.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-semibold"
                      style={{
                        backgroundColor:
                          sub.type === "Core" ? "#eef2ff" : "#f0fdf4",
                        color:
                          sub.type === "Core"
                            ? "var(--royal-blue)"
                            : "var(--success-dark)",
                      }}
                    >
                      {sub.type}
                    </span>
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

      {/* Semester schedule */}
      <div
        className="bg-white rounded-xl border shadow-sm p-5"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <h3
          className="font-semibold text-sm flex items-center gap-2 mb-4"
          style={{ color: "var(--dark-gray)" }}
        >
          <RefreshCw size={15} style={{ color: "var(--royal-blue)" }} />{" "}
          Transitional System Schedule
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                Semester 1 — In Session
              </span>
            </div>
            <p className="text-xs" style={{ color: "#92400e" }}>
              {new Date(TERM_INFO.startDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              –{" "}
              {new Date(TERM_INFO.endDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
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
                Semester 2 — On Vacation
              </span>
            </div>
            <p className="text-xs" style={{ color: "#166534" }}>
              Resumes April 14, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentHome;
