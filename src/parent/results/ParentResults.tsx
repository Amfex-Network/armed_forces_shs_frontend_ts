// src/parent/results/ParentResults.jsx
import React, { useState } from "react";
import { Award, ChevronDown, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  getGradeColor,
  getGradeLabel,
  getPerformanceBand,
  CHILD_RESULTS,
  CHILD_ATTENDANCE,
} from "../data/parentData";
import { useActiveChild } from "../ParentDashboardLayout";

// ─── Report not yet published gate ───────────────────────────────────────────
const REPORT_PUBLISHED = false; // Set to true when admin publishes — will come from API

const NotPublished = ({ type = "report" }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
      style={{ backgroundColor: "#eef2ff" }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--royal-blue)"
        strokeWidth="2"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    </div>
    <h2
      className="text-lg font-black mb-2"
      style={{ color: "var(--dark-gray)" }}
    >
      {type === "report"
        ? "Report Card Not Yet Available"
        : "Results Not Yet Published"}
    </h2>
    <p className="text-sm text-gray-400 max-w-sm">
      Your {type === "report" ? "report card" : "results"} for this semester
      have not been published yet. Please check back after the admin finalizes
      and publishes the reports.
    </p>
    <div
      className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold"
      style={{ backgroundColor: "#fffbeb", color: "#92400e" }}
    >
      Contact the Admin office if you believe this is an error
    </div>
  </div>
);

const ParentResults = () => {
  const { activeChild } = useActiveChild();
  const [selectedTerm, setSelectedTerm] = useState("current");

  if (!REPORT_PUBLISHED) return <NotPublished type="results" />;
  if (!activeChild)
    return (
      <div className="text-center py-12 text-gray-400">No child selected.</div>
    );

  const childResults =
    CHILD_RESULTS[activeChild.studentId] ||
    CHILD_RESULTS[Object.keys(CHILD_RESULTS)[0]];

  const allTerms = [
    {
      key: "current",
      label: `${childResults?.current?.term || "Semester 1"} · ${childResults?.current?.academicYear || "2024/2025"}`,
    },
    ...(childResults?.previous || []).map((r, i) => ({
      key: `prev_${i}`,
      label: `${r.term} · ${r.academicYear}`,
    })),
  ];

  const active =
    selectedTerm === "current"
      ? childResults?.current
      : childResults?.previous?.[parseInt(selectedTerm.split("_")[1])];
  const totalScore = active.subjects.reduce((s, sub) => s + sub.total, 0);
  const maxScore = active.subjects.length * 100;
  const percentage = ((totalScore / maxScore) * 100).toFixed(1);
  const band = getPerformanceBand(parseFloat(percentage));
  const totalPoints = 0; // Grade points removed

  const barData = active.subjects.map((s) => ({
    name: s.name
      .replace("Integrated ", "Int. ")
      .replace("Language", "Lang.")
      .replace(" Studies", ""),
    total: s.total,
  }));

  const trendData = [
    ...(childResults?.previous || []).slice().reverse(),
    childResults?.current,
  ]
    .filter(Boolean)
    .map((t) => ({
      term: t.term.replace("Term ", "T"),
      avg: Math.round(
        t.subjects.reduce((s, sub) => s + sub.total, 0) / t.subjects.length,
      ),
    }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            {activeChild.firstName}'s Results
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {activeChild.formClass} · {activeChild.program}
          </p>
        </div>
        <div className="relative">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm font-semibold rounded-xl border-2 outline-none cursor-pointer"
            style={{
              borderColor: "var(--royal-blue)",
              color: "var(--royal-blue)",
              backgroundColor: "#eef2ff",
            }}
          >
            {allTerms.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--royal-blue)" }}
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Score",
            value: `${totalScore}/${maxScore}`,
            color: "var(--royal-blue)",
          },
          { label: "Overall %", value: `${percentage}%`, color: band.color },
          {
            label: "Class Position",
            value: `${active.position}/${active.totalStudents}`,
            color: "var(--warning)",
          },
          {
            label: "Aggregate",
            value: totalPoints,
            color:
              totalPoints <= 12 ? "var(--success-dark)" : "var(--accent-red)",
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

      {/* Performance banner */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
        }}
      >
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
          <Award size={80} />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-blue-200 text-xs">
              {active.term} · {active.academicYear}
            </p>
            <p className="font-black text-2xl">{band.label}</p>
            <p className="text-blue-200 text-sm">
              Overall: {percentage}% · Position: {active.position} of{" "}
              {active.totalStudents}
            </p>
          </div>
          <div className="flex gap-3">
            <div
              className="text-center px-4 py-2 rounded-xl"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              <p className="font-black text-xl">{totalPoints}</p>
              <p className="text-blue-200 text-xs">Aggregate</p>
            </div>
            <div
              className="text-center px-4 py-2 rounded-xl"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              <p className="font-black text-xl">
                {
                  active.subjects.filter((s) =>
                    ["A1", "B2", "B3", "C4", "C5", "C6"].includes(s.grade),
                  ).length
                }
              </p>
              <p className="text-blue-200 text-xs">Credit Passes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="bg-white rounded-xl border shadow-sm p-5"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <h3
            className="font-semibold text-sm mb-4"
            style={{ color: "var(--dark-gray)" }}
          >
            Subject Scores
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={barData}
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
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {barData.map((e, i) => (
                  <Cell
                    key={i}
                    fill={
                      e.total >= 80
                        ? "var(--success-dark)"
                        : e.total >= 60
                          ? "var(--royal-blue)"
                          : e.total >= 50
                            ? "var(--warning)"
                            : "var(--accent-red)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {trendData.length > 1 && (
          <div
            className="bg-white rounded-xl border shadow-sm p-5"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <h3
              className="font-semibold text-sm mb-4"
              style={{ color: "var(--dark-gray)" }}
            >
              Score Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={trendData}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="term"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  domain={[40, 100]}
                />
                <Tooltip
                  formatter={(v) => [`${v}%`, "Avg Score"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="var(--royal-blue)"
                  strokeWidth={2.5}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Results table */}
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
          <h3
            className="font-semibold text-sm"
            style={{ color: "var(--dark-gray)" }}
          >
            Detailed Results
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[540px]">
            <thead
              className="border-b"
              style={{
                backgroundColor: "var(--light-gray)",
                borderColor: "var(--medium-gray)",
              }}
            >
              <tr>
                {[
                  "Subject",
                  "Type",
                  "CA (30)",
                  "Exam (70)",
                  "Total (100)",
                  "Grade",
                  "Remark",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["Core", "Elective"].map((type) => (
                <React.Fragment key={type}>
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-1.5 text-xs font-black uppercase"
                      style={{
                        backgroundColor:
                          type === "Core" ? "#eef2ff" : "#f0fdf4",
                        color:
                          type === "Core"
                            ? "var(--royal-blue)"
                            : "var(--success-dark)",
                      }}
                    >
                      {type} Subjects
                    </td>
                  </tr>
                  {active.subjects
                    .filter((s) => s.type === type)
                    .map((sub, i) => (
                      <tr
                        key={i}
                        className="border-b hover:bg-gray-50"
                        style={{ borderColor: "var(--medium-gray)" }}
                      >
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
                                type === "Core" ? "#eef2ff" : "#f0fdf4",
                              color:
                                type === "Core"
                                  ? "var(--royal-blue)"
                                  : "var(--success-dark)",
                            }}
                          >
                            {type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">{sub.ca}</td>
                        <td className="px-4 py-3 text-center">{sub.exam}</td>
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
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {getGradeLabel(sub.grade)}
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: "var(--light-gray)" }}>
                <td
                  className="px-4 py-3 font-black"
                  colSpan={4}
                  style={{ color: "var(--dark-gray)" }}
                >
                  TOTAL
                </td>
                <td
                  className="px-4 py-3 text-center font-black text-lg"
                  style={{ color: "var(--royal-blue)" }}
                >
                  {totalScore}
                </td>
                <td colSpan={2} className="px-4 py-3">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded"
                    style={{
                      backgroundColor: band.color + "15",
                      color: band.color,
                    }}
                  >
                    {band.label} · {percentage}%
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParentResults;
