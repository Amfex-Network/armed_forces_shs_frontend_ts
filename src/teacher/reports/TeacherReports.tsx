// src/teacher/reports/TeacherReports.jsx
import React, { useState } from "react";
import { Search, Printer, ChevronDown, FileText, Eye } from "lucide-react";
import {
  CLASSES_DATA,
  FORM_CLASS_STUDENTS,
  getGradeColor,
  getGradeFromTotal,
  TERM_INFO,
} from "../data/teacherData";
import { useAuth } from "../../context/AuthContext";

const ALL_CLASS_STUDENTS = Object.values(FORM_CLASS_STUDENTS).flat();

const MOCK_REPORT_STUDENTS = ALL_CLASS_STUDENTS.map((s) => ({
  ...s,
  ca: Math.round(50 + Math.random() * 25),
  exam: Math.round(40 + Math.random() * 25),
  total: Math.round(75 + Math.random() * 20),
  subjects: [
    {
      name: "Core Mathematics",
      type: "Core",
      ca: Math.round(18 + Math.random() * 10),
      exam: Math.round(42 + Math.random() * 20),
    },
    {
      name: "English Language",
      type: "Core",
      ca: Math.round(17 + Math.random() * 10),
      exam: Math.round(40 + Math.random() * 20),
    },
    {
      name: "Integrated Science",
      type: "Core",
      ca: Math.round(18 + Math.random() * 10),
      exam: Math.round(43 + Math.random() * 20),
    },
    {
      name: "Social Studies",
      type: "Core",
      ca: Math.round(16 + Math.random() * 10),
      exam: Math.round(38 + Math.random() * 20),
    },
    {
      name: "ICT",
      type: "Core",
      ca: Math.round(18 + Math.random() * 10),
      exam: Math.round(41 + Math.random() * 20),
    },
    {
      name: "Physics",
      type: "Elective",
      ca: Math.round(19 + Math.random() * 10),
      exam: Math.round(44 + Math.random() * 20),
    },
    {
      name: "Chemistry",
      type: "Elective",
      ca: Math.round(17 + Math.random() * 10),
      exam: Math.round(40 + Math.random() * 20),
    },
    {
      name: "Biology",
      type: "Elective",
      ca: Math.round(18 + Math.random() * 10),
      exam: Math.round(42 + Math.random() * 20),
    },
  ].map((sub) => ({
    ...sub,
    total: sub.ca + sub.exam,
    grade: getGradeFromTotal(sub.ca + sub.exam),
  })),
  formTeacherComment:
    "A dedicated student who demonstrates consistent effort and discipline. Encouraged to maintain this standard.",
  hodComment:
    "Keep up the good work. Your performance reflects the school's values.",
  conduct: "Excellent",
  punctuality: "Good",
  attendance: s.attendance || 92,
  position: 1,
  totalStudents: ALL_CLASS_STUDENTS.length,
}));

// ─── Single report card print view ───────────────────────────────────────────
const ReportCardView = ({ student, onClose }) => {
  const { user } = useAuth();
  const totalScore = student.subjects.reduce((s, sub) => s + sub.total, 0);
  const maxScore = student.subjects.length * 100;
  const pct = ((totalScore / maxScore) * 100).toFixed(1);
  const aggregate = student.subjects.reduce(
    (s, sub) =>
      s +
      (sub.grade === "A1"
        ? 1
        : sub.grade === "B2"
          ? 2
          : sub.grade === "B3"
            ? 3
            : sub.grade === "C4"
              ? 4
              : sub.grade === "C5"
                ? 5
                : sub.grade === "C6"
                  ? 6
                  : sub.grade === "D7"
                    ? 7
                    : sub.grade === "E8"
                      ? 8
                      : 9),
    0,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-3xl max-h-[92vh] flex flex-col">
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
          }}
        >
          <h3
            className="font-semibold text-sm flex items-center gap-2"
            style={{ color: "var(--dark-gray)" }}
          >
            <FileText size={15} style={{ color: "var(--royal-blue)" }} />
            Report Card — {student.name}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
              style={{ backgroundColor: "var(--royal-blue)" }}
            >
              <Printer size={12} /> Print
            </button>
            <button
              onClick={onClose}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor: "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Report card */}
        <div className="overflow-y-auto flex-1 p-4">
          <div
            className="bg-white border rounded-xl overflow-hidden"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {/* School header */}
            <div
              className="p-5 text-center text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
              }}
            >
              <p className="font-black text-lg">
                ARMED FORCES SENIOR HIGH TECHNICAL SCHOOL
              </p>
              <p className="text-blue-200 text-sm">
                Uaddara Barracks, Kumasi, Ghana
              </p>
              <div
                className="mt-2 inline-block px-4 py-1 rounded-full text-white font-black text-sm"
                style={{ backgroundColor: "var(--accent-red)" }}
              >
                TERMINAL REPORT — {TERM_INFO.term.toUpperCase()} ·{" "}
                {TERM_INFO.academicYear}
              </div>
            </div>

            {/* Student info */}
            <div
              className="grid grid-cols-3 border-b"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {[
                { label: "Student Name", value: student.name },
                { label: "Student ID", value: student.studentId },
                {
                  label: "Class",
                  value: user?.formClass || "Form 3 Science B",
                },
                { label: "Academic Year", value: TERM_INFO.academicYear },
                { label: "Semester", value: TERM_INFO.term },
                { label: "Year Group", value: user?.yearGroup || "Form 1" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="p-3 border-b border-r"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  <p className="text-xs text-gray-400 uppercase">{label}</p>
                  <p
                    className="text-sm font-bold mt-0.5"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Subjects */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr style={{ backgroundColor: "var(--light-gray)" }}>
                    {[
                      "Subject",
                      "Type",
                      "CA (30)",
                      "Exam (70)",
                      "Total (100)",
                      "Grade",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left text-xs font-black uppercase text-gray-500 border-b"
                        style={{ borderColor: "var(--medium-gray)" }}
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
                          colSpan={6}
                          className="px-3 py-1.5 text-xs font-black uppercase"
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
                      {student.subjects
                        .filter((s) => s.type === type)
                        .map((sub, i) => (
                          <tr
                            key={i}
                            className="border-b hover:bg-gray-50"
                            style={{ borderColor: "var(--medium-gray)" }}
                          >
                            <td
                              className="px-3 py-2.5 font-medium"
                              style={{ color: "var(--dark-gray)" }}
                            >
                              {sub.name}
                            </td>
                            <td className="px-3 py-2.5 text-xs text-gray-500">
                              {sub.type}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              {sub.ca}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              {sub.exam}
                            </td>
                            <td
                              className="px-3 py-2.5 text-center font-black"
                              style={{ color: "var(--royal-blue)" }}
                            >
                              {sub.total}
                            </td>
                            <td className="px-3 py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-black ${getGradeColor(sub.grade)}`}
                              >
                                {sub.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: "var(--light-gray)" }}>
                    <td
                      className="px-3 py-2.5 font-black"
                      colSpan={4}
                      style={{ color: "var(--dark-gray)" }}
                    >
                      TOTAL
                    </td>
                    <td
                      className="px-3 py-2.5 text-center font-black text-lg"
                      style={{ color: "var(--royal-blue)" }}
                    >
                      {totalScore}
                    </td>
                    <td className="px-3 py-2.5 text-xs font-bold">
                      {pct}% · Agg: {aggregate}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: "var(--light-gray)" }}>
                    <td
                      className="px-3 py-2.5 font-black"
                      colSpan={4}
                      style={{ color: "var(--dark-gray)" }}
                    >
                      CLASS POSITION
                    </td>
                    <td
                      className="px-3 py-2.5 font-black"
                      colSpan={2}
                      style={{ color: "var(--accent-red)" }}
                    >
                      {student.position} of {student.totalStudents}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Attendance + conduct */}
            <div
              className="grid grid-cols-4 border-t border-b"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {[
                { label: "Attendance", value: `${student.attendance}%` },
                { label: "Conduct", value: student.conduct },
                { label: "Punctuality", value: student.punctuality },
                { label: "Total Score", value: `${totalScore}/${maxScore}` },
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
              className="p-4 space-y-3 border-b"
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
                  className="text-sm text-gray-600 p-3 rounded-lg"
                  style={{ backgroundColor: "var(--light-gray)" }}
                >
                  {student.formTeacherComment}
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
                  className="text-sm text-gray-600 p-3 rounded-lg"
                  style={{ backgroundColor: "var(--light-gray)" }}
                >
                  {student.hodComment}
                </p>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3">
              {["Form Teacher", "HOD", "Parent / Guardian"].map((label) => (
                <div
                  key={label}
                  className="p-4 border-r"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  <div
                    className="h-8 border-b mb-2"
                    style={{ borderColor: "var(--medium-gray)" }}
                  />
                  <p className="text-xs text-gray-500">{label}'s Signature</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Teacher Reports page ────────────────────────────────────────────────
const TeacherReports = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [viewStudent, setViewStudent] = useState(null);

  const filtered = MOCK_REPORT_STUDENTS.filter((s) => {
    const matchSearch =
      (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.studentId || "").toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1
          className="text-xl font-black"
          style={{ color: "var(--dark-gray)" }}
        >
          Report Cards
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {TERM_INFO.term} · {TERM_INFO.academicYear} ·{" "}
          {user?.formClass || "Form Class"}
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: MOCK_REPORT_STUDENTS.length,
            color: "var(--royal-blue)",
          },
          {
            label: "A1 Grades",
            value: MOCK_REPORT_STUDENTS.filter((s) => s.grade === "A1").length,
            color: "var(--success-dark)",
          },
          {
            label: "Below Credit",
            value: MOCK_REPORT_STUDENTS.filter((s) =>
              ["D7", "E8", "F9"].includes(s.grade),
            ).length,
            color: "var(--accent-red)",
          },
          {
            label: "Reports Ready",
            value: MOCK_REPORT_STUDENTS.length,
            color: "var(--warning)",
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

      {/* Search */}
      <div
        className="bg-white rounded-xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="flex items-center gap-3 px-5 py-3.5 border-b"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
          }}
        >
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name or ID..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none"
              style={{
                borderColor: "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--royal-blue)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--medium-gray)")
              }
            />
          </div>
        </div>

        {/* Student list */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead
              className="border-b"
              style={{
                backgroundColor: "var(--light-gray)",
                borderColor: "var(--medium-gray)",
              }}
            >
              <tr>
                {[
                  "#",
                  "Student",
                  "Total",
                  "Grade",
                  "Position",
                  "Attendance",
                  "Action",
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
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {filtered.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-xs text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p
                        className="font-semibold text-sm"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {s.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        {s.studentId}
                      </p>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 font-black"
                    style={{ color: "var(--royal-blue)" }}
                  >
                    {s.total}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-black ${getGradeColor(s.grade)}`}
                    >
                      {s.grade}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {s.position}/{s.totalStudents}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{
                      color:
                        s.attendance >= 95
                          ? "var(--success-dark)"
                          : "var(--warning)",
                    }}
                  >
                    {s.attendance}%
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setViewStudent(s)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                      style={{
                        backgroundColor: "#eef2ff",
                        color: "var(--royal-blue)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--royal-blue)";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#eef2ff";
                        e.currentTarget.style.color = "var(--royal-blue)";
                      }}
                    >
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report card modal */}
      {viewStudent && (
        <ReportCardView
          student={viewStudent}
          onClose={() => setViewStudent(null)}
        />
      )}
    </div>
  );
};

export default TeacherReports;
