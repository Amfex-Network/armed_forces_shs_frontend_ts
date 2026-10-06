import React, { useEffect, useMemo, useState } from "react";
import { Search, Printer, ChevronDown, FileText, Eye, X } from "lucide-react";
import { classesApi } from "../../api/domains";
import { studentsApi, type Student } from "../../api/students";
import { resultsApi, type ReportResult } from "../../api/results";
import { useSettings } from "../../context/SettingsContext";
import { sameClass } from "../../utils/classNames";

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

const ReportView = ({
  result,
  onClose,
}: {
  result: ReportResult;
  onClose: () => void;
}) => {
  const s = result.student;
  const pct = result.totalMax
    ? ((result.totalScore / result.totalMax) * 100).toFixed(1)
    : "0";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 print-area">
        <div
          className="flex items-center justify-between px-5 py-3 no-print"
          style={{ backgroundColor: "var(--light-gray)" }}
        >
          <p
            className="text-sm font-bold"
            style={{ color: "var(--dark-gray)" }}
          >
            Report Preview
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white"
              style={{ backgroundColor: "var(--royal-blue)" }}
            >
              <Printer size={13} /> Print
            </button>
            <button onClick={onClose} style={{ color: "var(--dark-gray)" }}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          className="p-6 text-center"
          style={{
            background:
              "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
          }}
        >
          <p className="text-white font-black text-lg">
            ARMED FORCES SENIOR HIGH TECHNICAL SCHOOL
          </p>
          <p className="text-blue-200 text-xs">
            Terminal Report - {result.term} · {result.academicYear}
          </p>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 border-b"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          {[
            { l: "Name", v: `${s.firstName} ${s.lastName}` },
            { l: "Student ID", v: s.studentId || "-" },
            { l: "Class", v: s.formClass || "-" },
            {
              l: "Position",
              v: result.position ? `${result.position}/${result.outOf}` : "-",
            },
            { l: "Aggregate", v: result.aggregate },
            { l: "Overall", v: `${pct}%` },
          ].map(({ l, v }) => (
            <div
              key={l}
              className="p-3 border-b border-r"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <p className="text-xs text-gray-400 uppercase">{l}</p>
              <p
                className="text-sm font-bold"
                style={{ color: "var(--dark-gray)" }}
              >
                {v}
              </p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--light-gray)" }}>
                {["Subject", "CA", "Exam", "Total", "Grade", "Remark"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left text-xs font-black uppercase text-gray-500"
                    >
                      {h}
                    </th>
                  ),
                )}
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
                    className="px-3 py-2 font-medium"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {sub.name}
                  </td>
                  <td className="px-3 py-2 text-center">{sub.ca}</td>
                  <td className="px-3 py-2 text-center">{sub.exam}</td>
                  <td
                    className="px-3 py-2 text-center font-black"
                    style={{ color: "var(--royal-blue)" }}
                  >
                    {sub.total}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-black ${GRADE_COLOR[sub.grade] || "bg-gray-50 text-gray-600"}`}
                    >
                      {sub.grade}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">
                    {sub.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="p-4 text-xs text-gray-500 border-t"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <p>
            <strong>Form Teacher:</strong>{" "}
            {result.comments?.formTeacher || "No comment recorded."}
          </p>
          <p className="mt-1">
            <strong>Head of School:</strong>{" "}
            {result.comments?.head || "No comment recorded."}
          </p>
        </div>
      </div>
    </div>
  );
};

const TeacherReports = () => {
  const { settings } = useSettings();
  const TERMS = settings.terms;
  const ACADEMIC_YEAR = settings.currentAcademicYear;

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [term, setTerm] = useState(settings.currentTerm);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openResult, setOpenResult] = useState<ReportResult | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setTerm(settings.currentTerm);
  }, [settings.currentTerm]);

  useEffect(() => {
    (async () => {
      try {
        const [cls, studs] = await Promise.all([
          classesApi.list(),
          studentsApi.list(),
        ]);
        setClasses(cls);
        setStudents(studs);
        if (cls.length) setSelectedClass(cls[0]);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const classStudents = useMemo(() => {
    if (!selectedClass) return [];
    const q = search.toLowerCase();
    return students
      .filter((s) => sameClass(s.formClass, selectedClass.name))
      .filter(
        (s) =>
          !q ||
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q),
      );
  }, [students, selectedClass, search]);

  const viewReport = async (student: Student) => {
    try {
      setBusyId(student.id as string);
      setError("");
      const result = await resultsApi.get({
        student: student.id,
        term,
        academicYear: ACADEMIC_YEAR,
      });
      if (result.subjects.length === 0) {
        setError(`No scores recorded for ${student.firstName} in ${term}.`);
        setTimeout(() => setError(""), 3000);
        return;
      }
      setOpenResult(result);
    } catch (e: any) {
      setError(e?.message || "Could not load report.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setBusyId(null);
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center text-sm text-gray-400">Loading…</div>
    );

  return (
    <div className="space-y-5">
      {error && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold"
          style={{ backgroundColor: "var(--accent-red)" }}
        >
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            Report Cards
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Preview and print terminal reports for your class
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={selectedClass?.id || ""}
              onChange={(e) =>
                setSelectedClass(
                  classes.find((c) => c.id === e.target.value) || null,
                )
              }
              className="appearance-none pl-3 pr-8 py-2 text-sm font-semibold rounded-xl border-2 outline-none cursor-pointer"
              style={{
                borderColor: "var(--royal-blue)",
                color: "var(--royal-blue)",
                backgroundColor: "#eef2ff",
              }}
            >
              {classes.length === 0 && <option value="">No classes</option>}
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--royal-blue)" }}
            />
          </div>
          <div className="relative">
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm font-semibold rounded-xl border-2 outline-none cursor-pointer"
              style={{
                borderColor: "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
            >
              {TERMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
            />
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-xl border shadow-sm p-4"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student…"
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border-2 outline-none"
            style={{
              borderColor: "var(--medium-gray)",
              color: "var(--dark-gray)",
            }}
          />
        </div>
      </div>

      <div
        className="bg-white rounded-xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead
              className="border-b"
              style={{
                backgroundColor: "var(--light-gray)",
                borderColor: "var(--medium-gray)",
              }}
            >
              <tr>
                {["Student", "Student ID", "Class", "Report"].map((h) => (
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
              {classStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    <FileText
                      size={28}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    No students in this class.
                  </td>
                </tr>
              ) : (
                classStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td
                      className="px-4 py-3 font-semibold"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {s.studentId}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {s.formClass}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => viewReport(s)}
                        disabled={busyId === s.id}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50"
                        style={{
                          backgroundColor: "#eef2ff",
                          color: "var(--royal-blue)",
                        }}
                      >
                        <Eye size={13} />{" "}
                        {busyId === s.id ? "Loading…" : "View / Print"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openResult && (
        <ReportView result={openResult} onClose={() => setOpenResult(null)} />
      )}
    </div>
  );
};

export default TeacherReports;
