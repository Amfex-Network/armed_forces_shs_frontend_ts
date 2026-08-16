// src/student/reportcard/StudentReportCard.tsx
import React, { useState, useEffect, useRef } from "react";
import { Printer, ChevronDown } from "lucide-react";
import { resultsApi, type ReportResult } from "../../api/results";
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

const EmptyState = ({ title, message }: { title: string; message: string }) => (
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
      {title}
    </h2>
    <p className="text-sm text-gray-400 max-w-sm">{message}</p>
  </div>
);

const StudentReportCard = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();
  const TERMS = settings.terms;
  const ACADEMIC_YEAR = settings.currentAcademicYear;
  const [term, setTerm] = useState(settings.currentTerm);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setTerm(settings.currentTerm);
  }, [settings.currentTerm]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    resultsApi
      .get({ term, academicYear: ACADEMIC_YEAR })
      .then((r) => {
        if (active) setResult(r);
      })
      .catch((e) => {
        if (active) {
          setResult(null);
          setError(e?.message || "Could not load your report.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [term, ACADEMIC_YEAR]);

  const handlePrint = () => window.print();

  if (loading)
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Loading your report…
      </div>
    );
  if (error || !result)
    return (
      <EmptyState
        title="Report Card Not Available"
        message={
          error ||
          "We couldn't find your report. Make sure your student record is linked to your account."
        }
      />
    );
  if (result.published === false)
    return (
      <EmptyState
        title="Report Card Not Yet Published"
        message={`Your ${term} report has not been published yet. Please check back after the admin finalizes and publishes the reports.`}
      />
    );
  if (result.subjects.length === 0)
    return (
      <EmptyState
        title="No Results Yet"
        message={`No scores have been recorded for ${term} yet. Please check back later.`}
      />
    );

  const student = result.student;
  const totalScore = result.totalScore;
  const maxScore = result.totalMax;
  const percentage = maxScore
    ? ((totalScore / maxScore) * 100).toFixed(1)
    : "0";
  const att = result.attendance;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            Report Card
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            View and print your terminal report
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm font-semibold rounded-xl border-2 outline-none cursor-pointer"
              style={{
                borderColor: "var(--royal-blue)",
                color: "var(--royal-blue)",
                backgroundColor: "#eef2ff",
              }}
            >
              {TERMS.map((t) => (
                <option key={t} value={t}>
                  {t} · {ACADEMIC_YEAR}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--royal-blue)" }}
            />
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl transition"
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            <Printer size={15} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Report Card */}
      <div
        ref={printRef}
        className="bg-white rounded-2xl border shadow-sm overflow-hidden print-area"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        {/* School header */}
        <div
          className="p-6 text-center border-b"
          style={{
            background:
              "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
            borderColor: "var(--medium-gray)",
          }}
        >
          <p className="text-white font-black text-xl tracking-wide">
            ARMED FORCES SENIOR HIGH TECHNICAL SCHOOL
          </p>
          <p className="text-blue-200 text-sm">
            Uaddara Barracks, Kumasi, Ghana
          </p>
          <div
            className="mt-3 inline-block px-4 py-1 rounded-full text-white font-black text-sm"
            style={{ backgroundColor: "var(--accent-red)" }}
          >
            TERMINAL REPORT — {result.term.toUpperCase()} ·{" "}
            {result.academicYear}
          </div>
        </div>

        {/* Student info */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-0 border-b"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          {[
            {
              label: "Student Name",
              value: `${student.firstName || ""} ${student.lastName || ""}`,
            },
            { label: "Student ID", value: student.studentId || "—" },
            { label: "Class / Form", value: student.formClass || "—" },
            { label: "Course", value: student.course || "—" },
            { label: "Academic Year", value: result.academicYear },
            { label: "Term", value: result.term },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="p-3 border-b border-r"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                {label}
              </p>
              <p
                className="text-sm font-bold mt-0.5"
                style={{ color: "var(--dark-gray)" }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Subjects table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr style={{ backgroundColor: "var(--light-gray)" }}>
                {[
                  "Subject",
                  "CA (30)",
                  "Exam (70)",
                  "Total (100)",
                  "Grade",
                  "Remark",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-xs font-black uppercase text-gray-600 border-b ${i === 0 ? "text-left" : "text-center"}`}
                    style={{ borderColor: "var(--medium-gray)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.subjects.map((sub, i) => (
                <tr
                  key={i}
                  className="border-b"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {sub.name}
                  </td>
                  <td className="px-4 py-3 text-center">{sub.ca}</td>
                  <td className="px-4 py-3 text-center">{sub.exam}</td>
                  <td
                    className="px-4 py-3 text-center font-black"
                    style={{ color: "var(--royal-blue)" }}
                  >
                    {sub.total}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-black ${GRADE_COLOR[sub.grade] || "bg-gray-50 text-gray-600"}`}
                    >
                      {sub.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">
                    {sub.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: "var(--light-gray)" }}>
                <td
                  className="px-4 py-3 font-black"
                  style={{ color: "var(--dark-gray)" }}
                >
                  TOTAL
                </td>
                <td colSpan={2} />
                <td
                  className="px-4 py-3 text-center font-black text-lg"
                  style={{ color: "var(--royal-blue)" }}
                >
                  {totalScore}
                </td>
                <td colSpan={2} className="px-4 py-3 text-center">
                  <span className="text-xs font-bold">
                    Aggregate: {result.aggregate} · {percentage}%
                  </span>
                </td>
              </tr>
              <tr style={{ backgroundColor: "var(--light-gray)" }}>
                <td
                  className="px-4 py-3 font-black"
                  style={{ color: "var(--dark-gray)" }}
                >
                  CLASS POSITION
                </td>
                <td
                  colSpan={5}
                  className="px-4 py-3 font-black"
                  style={{ color: "var(--accent-red)" }}
                >
                  {result.position > 0
                    ? `${result.position} out of ${result.outOf} students`
                    : "—"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Attendance */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-t border-b"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          {[
            { label: "Days Present", value: att.present },
            { label: "Days Absent", value: att.absent },
            { label: "Days Late", value: att.late },
            { label: "Attendance %", value: `${att.rate}%` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="p-3 text-center border-r"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <p
                className="text-lg font-black"
                style={{ color: "var(--royal-blue)" }}
              >
                {value}
              </p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Comments */}
        <div
          className="p-5 space-y-4 border-b"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          {[
            {
              label: "Form Teacher's Comment",
              value: result.comments?.formTeacher,
            },
            {
              label: "Head of School's Comment",
              value: result.comments?.head,
            },
          ].map(({ label, value }) => (
            <div key={label}>
              <p
                className="text-xs font-black uppercase tracking-wider mb-1"
                style={{ color: "var(--dark-gray)" }}
              >
                {label}
              </p>
              <p
                className={`text-sm leading-relaxed p-3 rounded-lg ${value ? "text-gray-600" : "text-gray-400 italic"}`}
                style={{ backgroundColor: "var(--light-gray)" }}
              >
                {value || "No comment recorded yet."}
              </p>
            </div>
          ))}
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          {["Form Teacher", "Head of School", "Parent / Guardian"].map(
            (label) => (
              <div
                key={label}
                className="p-5 border-r"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <div
                  className="h-10 border-b mb-2"
                  style={{ borderColor: "var(--medium-gray)" }}
                />
                <p className="text-xs text-gray-500">
                  {label}'s Signature & Date
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentReportCard;
