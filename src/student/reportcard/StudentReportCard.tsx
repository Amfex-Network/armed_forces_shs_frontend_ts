// src/student/reportcard/StudentReportCard.jsx
import React, { useState, useRef } from "react";
import { Printer, ChevronDown } from "lucide-react";
import {
  CURRENT_RESULTS,
  PREVIOUS_RESULTS,
  ATTENDANCE_SUMMARY,
  REPORT_COMMENTS,
  TERM_INFO,
  getGradeColor,
  getGradeLabel,
} from "../data/studentData";
import { useAuth } from "../../context/AuthContext";

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

const StudentReportCard = () => {
  const { user } = useAuth();
  const printRef = useRef();
  const [selectedTerm, setSelectedTerm] = useState("current");

  if (!REPORT_PUBLISHED) return <NotPublished type="report" />;

  const terms = [
    {
      key: "current",
      label: `${CURRENT_RESULTS.term} · ${CURRENT_RESULTS.academicYear}`,
    },
    ...PREVIOUS_RESULTS.map((r, i) => ({
      key: `prev_${i}`,
      label: `${r.term} · ${r.academicYear}`,
    })),
  ];

  const active =
    selectedTerm === "current"
      ? CURRENT_RESULTS
      : PREVIOUS_RESULTS[parseInt(selectedTerm.split("_")[1])];

  const totalScore = active.subjects.reduce((s, sub) => s + sub.total, 0);
  const maxScore = active.subjects.length * 100;
  const percentage = ((totalScore / maxScore) * 100).toFixed(1);
  const totalPoints = active.subjects.reduce((s, sub) => s + sub.points, 0);
  const attPct = Math.round(
    (ATTENDANCE_SUMMARY.present / ATTENDANCE_SUMMARY.totalDays) * 100,
  );

  const handlePrint = () => window.print();

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
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl transition"
            style={{ backgroundColor: "var(--royal-blue)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--royal-blue-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--royal-blue)")
            }
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
          <p className="text-blue-200 text-xs mt-0.5">
            Tel: +233 30 277 0000 · Email: info@afts.edu.gh
          </p>
          <div
            className="mt-3 inline-block px-4 py-1 rounded-full text-white font-black text-sm"
            style={{ backgroundColor: "var(--accent-red)" }}
          >
            TERMINAL REPORT — {active.term.toUpperCase()} ·{" "}
            {active.academicYear}
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
              value: `${user?.firstName} ${user?.lastName}`,
            },
            { label: "Student ID", value: user?.studentId },
            { label: "Class / Form", value: user?.formClass },
            { label: "Course", value: user?.course || user?.program },
            {
              label: "Year Group",
              value: user?.year || user?.yearGroup || "Form 1",
            },
            { label: "Academic Year", value: active.academicYear },
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
                <th
                  className="px-4 py-3 text-left text-xs font-black uppercase text-gray-600 border-b"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  Subject
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-black uppercase text-gray-600 border-b"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  CA (30)
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-black uppercase text-gray-600 border-b"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  Exam (70)
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-black uppercase text-gray-600 border-b"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  Total (100)
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-black uppercase text-gray-600 border-b"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  Grade
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-black uppercase text-gray-600 border-b"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  Remark
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Core */}
              <tr>
                <td
                  colSpan={6}
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
                        className={`px-2 py-0.5 rounded text-xs font-black ${getGradeColor(sub.grade)}`}
                      >
                        {sub.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500">
                      {getGradeLabel(sub.grade)}
                    </td>
                  </tr>
                ))}
              {/* Elective */}
              <tr>
                <td
                  colSpan={6}
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
                        className={`px-2 py-0.5 rounded text-xs font-black ${getGradeColor(sub.grade)}`}
                      >
                        {sub.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500">
                      {getGradeLabel(sub.grade)}
                    </td>
                  </tr>
                ))}
            </tbody>
            {/* Totals */}
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
                    Aggregate: {totalPoints} · {percentage}%
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
                  {active.position} out of {active.totalStudents} students
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
            { label: "Days Present", value: ATTENDANCE_SUMMARY.present },
            { label: "Days Absent", value: ATTENDANCE_SUMMARY.absent },
            { label: "Days Late", value: ATTENDANCE_SUMMARY.late },
            { label: "Attendance %", value: `${attPct}%` },
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

        {/* Conduct & Punctuality */}
        <div
          className="grid grid-cols-2 gap-0 border-b"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div
            className="p-3 border-r"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Conduct
            </p>
            <p
              className="text-sm font-black mt-0.5"
              style={{ color: "var(--success-dark)" }}
            >
              {REPORT_COMMENTS.conduct}
            </p>
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Punctuality
            </p>
            <p
              className="text-sm font-black mt-0.5"
              style={{ color: "var(--success-dark)" }}
            >
              {REPORT_COMMENTS.punctuality}
            </p>
          </div>
        </div>

        {/* Comments */}
        <div
          className="p-5 space-y-4 border-b"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div>
            <p
              className="text-xs font-black uppercase tracking-wider mb-1"
              style={{ color: "var(--dark-gray)" }}
            >
              Form Teacher's Comment
            </p>
            <p
              className="text-sm text-gray-600 leading-relaxed p-3 rounded-lg"
              style={{ backgroundColor: "var(--light-gray)" }}
            >
              {REPORT_COMMENTS.formTeacher}
            </p>
          </div>
          <div>
            <p
              className="text-xs font-black uppercase tracking-wider mb-1"
              style={{ color: "var(--dark-gray)" }}
            >
              HOD Comment
            </p>
            <p
              className="text-sm text-gray-600 leading-relaxed p-3 rounded-lg"
              style={{ backgroundColor: "var(--light-gray)" }}
            >
              {REPORT_COMMENTS.headmaster || REPORT_COMMENTS.hod || ""}
            </p>
          </div>
        </div>

        {/* Signatures + Next term */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          {["Form Teacher", "HOD", "Parent / Guardian"].map((label) => (
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
          ))}
        </div>

        {/* Next term */}
        <div
          className="p-4 text-center border-t"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
          }}
        >
          <p
            className="text-sm font-bold"
            style={{ color: "var(--royal-blue)" }}
          >
            Next Term Begins:{" "}
            {new Date(REPORT_COMMENTS.nextTermBegins).toLocaleDateString(
              "en-GB",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              },
            )}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Students are expected to report by 7:00 AM on the first day
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentReportCard;
