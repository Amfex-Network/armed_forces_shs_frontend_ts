import React, { useState } from "react";
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
import { Download, FileDown } from "lucide-react";
import type { AnalyticsReport, StudentRow } from "../../api/analytics";
import {
  ANALYTICS_SECTIONS,
  downloadAnalyticsPdf,
  type SectionKey,
} from "../../utils/analyticsPdf";

const GRADE_COLORS: Record<string, string> = {
  A1: "#16a34a",
  B2: "#2563eb",
  B3: "#3b82f6",
  C4: "#ca8a04",
  C5: "#ea580c",
  C6: "#f97316",
  D7: "#dc2626",
  E8: "#b91c1c",
  F9: "#7f1d1d",
};

const Card = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <div
    className="bg-white rounded-xl border shadow-sm overflow-hidden"
    style={{ borderColor: "var(--medium-gray)" }}
  >
    <div
      className="px-5 py-3 border-b"
      style={{
        borderColor: "var(--medium-gray)",
        backgroundColor: "var(--light-gray)",
      }}
    >
      <h3
        className="font-semibold text-sm"
        style={{ color: "var(--dark-gray)" }}
      >
        {title}
      </h3>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Empty = ({ text }: { text: string }) => (
  <p className="py-8 text-center text-sm text-gray-400">{text}</p>
);

const Table = ({
  head,
  rows,
  empty,
}: {
  head: string[];
  rows: React.ReactNode[][];
  empty: string;
}) =>
  rows.length === 0 ? (
    <Empty text={empty} />
  ) : (
    <div className="overflow-x-auto max-h-[420px]">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-white">
          <tr>
            {head.map((h, i) => (
              <th
                key={h}
                className={`px-3 py-2 text-xs font-semibold uppercase text-gray-500 border-b ${i === 0 ? "text-left" : "text-center"}`}
                style={{ borderColor: "var(--medium-gray)" }}
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
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {r.map((c, j) => (
                <td
                  key={j}
                  className={`px-3 py-2 ${j === 0 ? "text-left font-medium" : "text-center"}`}
                  style={{ color: "var(--dark-gray)" }}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

const rateColor = (n: number) =>
  n >= 70
    ? "var(--success-dark)"
    : n >= 50
      ? "var(--warning)"
      : "var(--accent-red)";

const Rate = ({ value }: { value: number }) => (
  <span className="font-semibold" style={{ color: rateColor(value) }}>
    {value}%
  </span>
);

const studentRows = (rows: StudentRow[]) =>
  rows.map((s, i) => [
    `${i + 1}. ${s.name}`,
    <span className="font-mono text-xs">{s.studentId}</span>,
    s.className,
    s.subjects,
    s.average,
    s.belowCredit,
  ]);

export const AnalyticsReportView = ({
  report: r,
  showClassBreakdown = true,
}: {
  report: AnalyticsReport;
  showClassBreakdown?: boolean;
}) => {
  const s = r.summary;
  const noScores = s.entries === 0;
  const cards = [
    { label: "Students", value: s.students },
    { label: "With scores", value: s.studentsWithScores },
    { label: "Average score", value: noScores ? "-" : s.average },
    { label: "Credit pass rate", value: noScores ? "-" : `${s.passRate}%` },
    {
      label: "Attendance",
      value: r.attendance.records ? `${r.attendance.rate}%` : "-",
    },
  ];
  const grades = r.gradeDistribution.map((g) => ({
    ...g,
    color: GRADE_COLORS[g.grade] || "#6b7280",
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-xl border p-4 shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <p
              className="text-2xl font-black"
              style={{ color: "var(--dark-gray)" }}
            >
              {c.value}
            </p>
            <p className="text-xs text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      {noScores && (
        <div
          className="p-4 rounded-xl border text-sm"
          style={{
            backgroundColor: "#eef2ff",
            borderColor: "#c7d2fe",
            color: "var(--royal-blue)",
          }}
        >
          No scores have been entered for {r.term} {r.academicYear} in this view
          yet. Figures appear here as teachers enter scores.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Grade Distribution" subtitle={`${s.entries} score(s)`}>
          {noScores ? (
            <Empty text="No grades yet" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={grades}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="grade"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <Tooltip />
                <Bar dataKey="count" name="Scores" radius={[6, 6, 0, 0]}>
                  {grades.map((g) => (
                    <Cell key={g.grade} fill={g.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card
          title="Subject Averages"
          subtitle="Average total score out of 100"
        >
          {r.subjects.length === 0 ? (
            <Empty text="No subjects with scores yet" />
          ) : (
            <ResponsiveContainer
              width="100%"
              height={Math.max(220, r.subjects.length * 28)}
            >
              <BarChart
                data={r.subjects}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis
                  type="category"
                  dataKey="subject"
                  width={150}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <Tooltip />
                <Bar
                  dataKey="average"
                  name="Average"
                  fill="var(--royal-blue)"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card title="Subject Performance">
        <Table
          head={[
            "Subject",
            "Scores",
            "Average",
            "Pass rate",
            "Highest",
            "Lowest",
          ]}
          rows={r.subjects.map((x) => [
            x.subject,
            x.entries,
            x.average,
            <Rate value={x.passRate} />,
            x.highest,
            x.lowest,
          ])}
          empty="No scores entered for this term."
        />
      </Card>

      <Card title="Class Performance">
        <Table
          head={[
            "Class",
            "Students",
            "With scores",
            "Average",
            "Pass rate",
            "Attendance",
          ]}
          rows={r.classes.map((x) => {
            const att = r.attendance.byClass.find(
              (a) => a.className === x.className,
            );
            return [
              x.className,
              x.students,
              x.withScores,
              x.entries ? x.average : "-",
              x.entries ? <Rate value={x.passRate} /> : "-",
              att ? `${att.rate}%` : "-",
            ];
          })}
          empty="No classes in this view."
        />
      </Card>

      {showClassBreakdown && (
        <Card
          title="Class and Subject Breakdown"
          subtitle="How many students in each class have a score, per subject"
        >
          <Table
            head={["Class", "Subject", "Entered", "Average", "Pass rate"]}
            rows={r.classSubjects.map((x) => [
              x.className,
              x.subject,
              <span
                style={{
                  color:
                    x.entries < x.students
                      ? "var(--warning)"
                      : "var(--success-dark)",
                  fontWeight: 600,
                }}
              >
                {x.entries} of {x.students}
              </span>,
              x.average,
              <Rate value={x.passRate} />,
            ])}
            empty="No scores entered for this term."
          />
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card title="Top 10 Students" subtitle="By average score">
          <Table
            head={[
              "Name",
              "Index No.",
              "Class",
              "Subjects",
              "Average",
              "Below credit",
            ]}
            rows={studentRows(r.topStudents)}
            empty="No scores entered for this term."
          />
        </Card>
        <Card
          title="Students Needing Support"
          subtitle="Average below 50, or three or more grades below credit"
        >
          <Table
            head={[
              "Name",
              "Index No.",
              "Class",
              "Subjects",
              "Average",
              "Below credit",
            ]}
            rows={studentRows(r.needsSupport)}
            empty="No student is below the support line."
          />
        </Card>
      </div>
    </div>
  );
};

// Lets the user tick the parts they want and downloads them as a PDF.
export const AnalyticsPdfPanel = ({
  report,
  schoolName,
  scope,
  preparedBy,
}: {
  report: AnalyticsReport;
  schoolName: string;
  scope: string;
  preparedBy: string;
}) => {
  const [chosen, setChosen] = useState<SectionKey[]>(
    ANALYTICS_SECTIONS.map((s) => s.key),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const toggle = (key: SectionKey) =>
    setChosen((c) =>
      c.includes(key) ? c.filter((k) => k !== key) : [...c, key],
    );

  const download = async () => {
    setBusy(true);
    setError("");
    try {
      // Keep the PDF in the same order as the list.
      const order = ANALYTICS_SECTIONS.map((s) => s.key).filter((k) =>
        chosen.includes(k),
      );
      await downloadAnalyticsPdf({
        report,
        sections: order,
        schoolName,
        scope,
        preparedBy,
      });
    } catch (err) {
      setError(err?.message || "Could not create the PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card
      title="Download Report (PDF)"
      subtitle="Tick what the report should include"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {ANALYTICS_SECTIONS.map((s) => (
          <label
            key={s.key}
            className="flex items-center gap-2 text-sm cursor-pointer"
            style={{ color: "var(--dark-gray)" }}
          >
            <input
              type="checkbox"
              checked={chosen.includes(s.key)}
              onChange={() => toggle(s.key)}
              className="accent-[var(--royal-blue)]"
            />
            {s.label}
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button
          type="button"
          disabled={busy || chosen.length === 0}
          onClick={download}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white disabled:opacity-60"
          style={{ backgroundColor: "var(--royal-blue)" }}
        >
          {busy ? <Download size={14} /> : <FileDown size={14} />}
          {busy ? "Preparing PDF…" : "Download PDF"}
        </button>
        <button
          type="button"
          onClick={() =>
            setChosen((c) =>
              c.length === ANALYTICS_SECTIONS.length
                ? []
                : ANALYTICS_SECTIONS.map((s) => s.key),
            )
          }
          className="text-xs font-semibold"
          style={{ color: "var(--royal-blue)" }}
        >
          {chosen.length === ANALYTICS_SECTIONS.length
            ? "Clear all"
            : "Select all"}
        </button>
        {error && (
          <span className="text-xs" style={{ color: "var(--accent-red)" }}>
            {error}
          </span>
        )}
      </div>
    </Card>
  );
};
