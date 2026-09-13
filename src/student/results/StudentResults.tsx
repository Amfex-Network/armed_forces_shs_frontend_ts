// src/student/results/StudentResults.jsx
import React, { useState, useEffect } from "react";
import { TrendingUp, Award, ChevronDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { resultsApi } from "../../api/results";
import { subjectsApi } from "../../api/domains";
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
const GRADE_LABEL: Record<string, string> = {
  A1: "Excellent",
  B2: "Very Good",
  B3: "Good",
  C4: "Credit",
  C5: "Credit",
  C6: "Credit",
  D7: "Pass",
  E8: "Pass",
  F9: "Fail",
};
const getGradeColor = (g: string) =>
  GRADE_COLOR[g] || "text-gray-600 bg-gray-50";
const getGradeLabel = (g: string) => GRADE_LABEL[g] || "";
const getPerformanceBand = (pct: number) =>
  pct >= 75
    ? { label: "Excellent", color: "var(--success-dark)" }
    : pct >= 60
      ? { label: "Very Good", color: "var(--royal-blue)" }
      : pct >= 50
        ? { label: "Good", color: "var(--warning)" }
        : { label: "Needs Improvement", color: "var(--accent-red)" };

const GRADE_KEY = [
  { grade: "A1", range: "80–100", label: "Excellent" },
  { grade: "B2", range: "70–79", label: "Very Good" },
  { grade: "B3", range: "65–69", label: "Good" },
  { grade: "C4", range: "60–64", label: "Credit" },
  { grade: "C5", range: "55–59", label: "Credit" },
  { grade: "C6", range: "50–54", label: "Credit" },
  { grade: "D7", range: "45–49", label: "Pass" },
  { grade: "E8", range: "40–44", label: "Weak Pass" },
  { grade: "F9", range: "0–39", label: "Fail" },
];

const BarTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div
        className="bg-white rounded-xl shadow-lg border px-3 py-2"
        style={{ borderColor: "var(--medium-gray)", fontSize: "12px" }}
      >
        <p className="font-bold mb-0.5" style={{ color: "var(--dark-gray)" }}>
          {label}
        </p>
        <p style={{ color: "#6b7280" }}>
          CA:{" "}
          <strong>
            {payload.find((p) => p.dataKey === "ca")?.value ?? "-"}
          </strong>
        </p>
        <p style={{ color: "var(--royal-blue)" }}>
          Exam:{" "}
          <strong>
            {payload.find((p) => p.dataKey === "exam")?.value ?? "-"}
          </strong>
        </p>
        <p style={{ color: "var(--accent-red)", fontWeight: 700 }}>
          Total: {payload.find((p) => p.dataKey === "total")?.value ?? "-"}
        </p>
      </div>
    );
  }
  return null;
};

// Report not yet published gate

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

const StudentResults = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const RESULT_TERM = settings.currentTerm;
  const RESULT_YEAR = settings.currentAcademicYear;

  const [selectedTerm, setSelectedTerm] = useState("current");
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState("table"); // 'table' | 'charts'
  const [result, setResult] = useState<any>(null);
  const [subjectTypes, setSubjectTypes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([
      resultsApi.get({ term: RESULT_TERM, academicYear: RESULT_YEAR }),
      subjectsApi.list().catch(() => []),
    ])
      .then(([res, subs]) => {
        if (!alive) return;
        setResult(res);
        const map: Record<string, string> = {};
        subs.forEach((s: any) => {
          map[s.name] = s.type || "elective";
        });
        setSubjectTypes(map);
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
  }, [RESULT_TERM, RESULT_YEAR]);

  if (loading)
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Loading your results…
      </div>
    );
  if (result && result.published === false) return <NotPublished type="results" />;
  if (!result || result.subjects.length === 0)
    return <NotPublished type="results" />;

  const CURRENT_RESULTS = {
    ...result,
    totalStudents: result.outOf,
    subjects: result.subjects.map((sub: any) => ({
      ...sub,
      type: subjectTypes[sub.name] === "core" ? "Core" : "Elective",
    })),
  };
  const PREVIOUS_RESULTS: any[] = [];

  const terms = [
    {
      key: "current",
      label: `${CURRENT_RESULTS.term} · ${CURRENT_RESULTS.academicYear}`,
    },
  ];

  const active = CURRENT_RESULTS;
  const totalScore = active.subjects.reduce(
    (s: number, sub: any) => s + sub.total,
    0,
  );
  const maxScore = active.subjects.length * 100 || 1;
  const percentage = ((totalScore / maxScore) * 100).toFixed(1);
  const totalPoints = active.aggregate;
  const band = getPerformanceBand(parseFloat(percentage));

  // Bar chart - CA vs Exam vs Total per subject
  const barData = active.subjects.map((s) => ({
    name: s.name
      .replace("Integrated ", "Int. ")
      .replace("Language", "Lang.")
      .replace(" Studies", ""),
    ca: s.ca,
    exam: s.exam,
    total: s.total,
  }));

  // Radar chart - subject totals as percentage of 100
  const radarData = active.subjects.map((s) => ({
    subject: s.name
      .replace("Integrated ", "Int. ")
      .replace(" Language", "")
      .replace(" Studies", ""),
    score: s.total,
    fullMark: 100,
  }));

  // Term trend line
  const allTerms = [...PREVIOUS_RESULTS.slice().reverse(), CURRENT_RESULTS];
  const trendData = allTerms.map((t) => ({
    term: `${t.term.replace("Term ", "T")} ${t.academicYear.slice(-4)}`,
    avg: Math.round(
      t.subjects.reduce((s, sub) => s + sub.total, 0) / t.subjects.length,
    ),
    pos: t.position,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            My Results
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {user?.formClass} · {user?.program}
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
            {terms.map((t) => (
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
            <p className="text-blue-200 text-xs mb-0.5">
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

      {/* Tab toggle */}
      <div
        className="flex border-b"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        {[
          { id: "table", label: "Results Table" },
          { id: "charts", label: "Charts & Analysis" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors"
            style={{
              borderColor:
                activeTab === t.id ? "var(--royal-blue)" : "transparent",
              color:
                activeTab === t.id ? "var(--royal-blue)" : "var(--dark-gray)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table view */}
      {activeTab === "table" && (
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
              Subject Results
            </h3>
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition"
              style={{ backgroundColor: "#eef2ff", color: "var(--royal-blue)" }}
            >
              {showKey ? "Hide" : "Show"} Grade Key
            </button>
          </div>

          {showKey && (
            <div
              className="px-5 py-4 border-b grid grid-cols-3 sm:grid-cols-9 gap-2"
              style={{
                borderColor: "var(--medium-gray)",
                backgroundColor: "#f8f9fa",
              }}
            >
              {GRADE_KEY.map((g) => (
                <div
                  key={g.grade}
                  className="text-center p-1.5 rounded-lg"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid var(--medium-gray)",
                  }}
                >
                  <span
                    className={`text-xs font-black ${getGradeColor(g.grade)} px-1.5 py-0.5 rounded`}
                  >
                    {g.grade}
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">{g.range}</p>
                  <p className="text-xs text-gray-500">{g.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
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
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-1.5 text-xs font-black uppercase"
                    style={{
                      backgroundColor: "#eef2ff",
                      color: "var(--royal-blue)",
                    }}
                  >
                    Core Subjects
                  </td>
                </tr>
                {active.subjects
                  .filter((s) => s.type === "Core")
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
                            backgroundColor: "#eef2ff",
                            color: "var(--royal-blue)",
                          }}
                        >
                          Core
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
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-1.5 text-xs font-black uppercase"
                    style={{
                      backgroundColor: "#f0fdf4",
                      color: "var(--success-dark)",
                    }}
                  >
                    Elective Subjects
                  </td>
                </tr>
                {active.subjects
                  .filter((s) => s.type === "Elective")
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
                            backgroundColor: "#f0fdf4",
                            color: "var(--success-dark)",
                          }}
                        >
                          Elective
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
      )}

      {/* Charts view */}
      {activeTab === "charts" && (
        <div className="space-y-6">
          {/* CA vs Exam vs Total bar chart */}
          <div
            className="bg-white rounded-xl border shadow-sm p-5"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <h3
              className="font-semibold text-sm mb-1"
              style={{ color: "var(--dark-gray)" }}
            >
              CA vs Exam vs Total - {active.term}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Breakdown of your scores per subject
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={barData}
                margin={{ top: 5, right: 10, left: -20, bottom: 50 }}
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
                <Tooltip content={<BarTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                />
                <ReferenceLine
                  y={50}
                  stroke="var(--accent-red)"
                  strokeDasharray="4 4"
                />
                <Bar
                  dataKey="ca"
                  name="CA Score"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="exam"
                  name="Exam Score"
                  fill="var(--royal-blue)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="total"
                  name="Total Score"
                  fill="var(--success-dark)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar + Trend line side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar chart */}
            <div
              className="bg-white rounded-xl border shadow-sm p-5"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <h3
                className="font-semibold text-sm mb-1"
                style={{ color: "var(--dark-gray)" }}
              >
                Subject Performance Radar
              </h3>
              <p className="text-xs text-gray-400 mb-2">
                How balanced are your scores?
              </p>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData}>
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
                    name="Score"
                    dataKey="score"
                    stroke="var(--royal-blue)"
                    fill="var(--royal-blue)"
                    fillOpacity={0.25}
                  />
                  <Tooltip
                    formatter={(v) => [`${v}%`, "Score"]}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Term trend line */}
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
              <p className="text-xs text-gray-400 mb-2">
                Your performance across all terms
              </p>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart
                  data={trendData}
                  margin={{ top: 10, right: 20, left: -20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="term"
                    tick={{ fontSize: 10, fill: "#6b7280" }}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#6b7280" }}
                    domain={[40, 100]}
                  />
                  <Tooltip
                    formatter={(v, n) => [
                      n === "avg" ? `${v}%` : `#${v}`,
                      n === "avg" ? "Avg Score" : "Position",
                    ]}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <ReferenceLine
                    y={50}
                    stroke="var(--accent-red)"
                    strokeDasharray="4 4"
                  />
                  <Line
                    type="monotone"
                    dataKey="avg"
                    name="Avg Score (%)"
                    stroke="var(--royal-blue)"
                    strokeWidth={2.5}
                    dot={{ r: 5, fill: "var(--royal-blue)" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentResults;
