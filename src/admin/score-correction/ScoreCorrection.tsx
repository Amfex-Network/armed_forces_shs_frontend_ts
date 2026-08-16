import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Save,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  User,
  BookOpen,
} from "lucide-react";
import { studentsApi, type Student } from "../../api/students";
import { scoresApi } from "../../api/scores";
import { useSettings } from "../../context/SettingsContext";

interface Row {
  scoreId?: string;
  subject: string;
  ca: number | null;
  exam: number | null;
  total: number;
  grade: string;
  dirty: boolean;
}

const GRADE_COLOR: Record<string, string> = {
  A1: "#16a34a",
  B2: "#2563eb",
  B3: "#3b82f6",
  C4: "#ca8a04",
  C5: "#ea580c",
  C6: "#f97316",
  D7: "#ef4444",
  E8: "#dc2626",
  F9: "#b91c1c",
};

const ScoreCorrection = () => {
  const { settings } = useSettings();
  const TERMS = settings.terms;
  const ACADEMIC_YEAR = settings.currentAcademicYear;

  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Student | null>(null);
  const [term, setTerm] = useState(settings.currentTerm);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null,
  );

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setTerm(settings.currentTerm);
  }, [settings.currentTerm]);

  useEffect(() => {
    studentsApi
      .list()
      .then(setStudents)
      .catch(() => setStudents([]));
  }, []);

  useEffect(() => {
    if (!selected) {
      setRows([]);
      return;
    }
    let alive = true;
    setLoading(true);
    scoresApi
      .list({ student: selected.id, term, academicYear: ACADEMIC_YEAR })
      .then((scores) => {
        if (!alive) return;
        setRows(
          scores.map((sc: any) => ({
            scoreId: sc.id,
            subject: sc.subject,
            ca: sc.classScore,
            exam: sc.examScore,
            total: sc.total,
            grade: sc.grade,
            dirty: false,
          })),
        );
      })
      .catch(() => {
        if (alive) setRows([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [selected, term, ACADEMIC_YEAR]);

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return [];
    return students
      .filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [students, search]);

  const setField = (i: number, field: "ca" | "exam", value: string) => {
    const num = value === "" ? null : Math.max(0, parseInt(value));
    setRows((rs) =>
      rs.map((r, idx) => (idx === i ? { ...r, [field]: num, dirty: true } : r)),
    );
  };

  const saveRow = async (i: number) => {
    const r = rows[i];
    if (!r.scoreId || r.ca === null || r.exam === null) {
      showToast("Enter both CA and exam scores", "error");
      return;
    }
    if (r.ca < 0 || r.ca > 30) return showToast("CA must be 0–30", "error");
    if (r.exam < 0 || r.exam > 70)
      return showToast("Exam must be 0–70", "error");
    try {
      setSaving(true);
      const updated = await scoresApi.update(r.scoreId, {
        classScore: r.ca,
        examScore: r.exam,
      });
      setRows((rs) =>
        rs.map((row, idx) =>
          idx === i
            ? {
                ...row,
                total: updated.total,
                grade: updated.grade,
                dirty: false,
              }
            : row,
        ),
      );
      showToast(`${r.subject} corrected`);
    } catch (err: any) {
      showToast(err?.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2"
          style={{
            backgroundColor:
              toast.type === "error"
                ? "var(--accent-red)"
                : "var(--success-dark)",
          }}
        >
          {toast.type === "error" ? (
            <AlertTriangle size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-xl font-black" style={{ color: "var(--dark-gray)" }}>
          Score Correction
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Find a student and correct any entered subject scores
        </p>
      </div>

      {/* Search + term */}
      <div
        className="bg-white rounded-xl border shadow-sm p-4 flex flex-col sm:flex-row gap-3"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name or ID…"
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border-2 outline-none"
            style={{ borderColor: "var(--medium-gray)", color: "var(--dark-gray)" }}
          />
          {filteredStudents.length > 0 && (
            <div
              className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border shadow-xl z-20 overflow-hidden"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {filteredStudents.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelected(s);
                    setSearch("");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-left"
                >
                  <User size={14} style={{ color: "var(--royal-blue)" }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--dark-gray)" }}>
                      {s.firstName} {s.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {s.studentId} · {s.formClass}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 text-sm font-semibold rounded-xl border-2 outline-none cursor-pointer"
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
      </div>

      {!selected ? (
        <div
          className="bg-white rounded-xl border shadow-sm py-16 text-center"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-400">
            Search and select a student to view and correct their scores.
          </p>
        </div>
      ) : (
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
            <div>
              <p className="font-black text-sm" style={{ color: "var(--dark-gray)" }}>
                {selected.firstName} {selected.lastName}
              </p>
              <p className="text-xs text-gray-400">
                {selected.studentId} · {selected.formClass} · {term}
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: "#f3f4f6", color: "var(--dark-gray)" }}
            >
              Change student
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[620px]">
              <thead
                className="border-b"
                style={{
                  backgroundColor: "var(--light-gray)",
                  borderColor: "var(--medium-gray)",
                }}
              >
                <tr>
                  {["Subject", "CA (30)", "Exam (70)", "Total", "Grade", ""].map(
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
              <tbody className="divide-y" style={{ borderColor: "var(--medium-gray)" }}>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                      Loading scores…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                      No scores recorded for {term}. Teachers enter scores from
                      their own panel.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr key={r.scoreId || i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--dark-gray)" }}>
                        {r.subject}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={r.ca ?? ""}
                          onChange={(e) => setField(i, "ca", e.target.value)}
                          className="w-20 px-2 py-1.5 text-sm rounded-lg border-2 outline-none"
                          style={{ borderColor: "var(--medium-gray)" }}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={r.exam ?? ""}
                          onChange={(e) => setField(i, "exam", e.target.value)}
                          className="w-20 px-2 py-1.5 text-sm rounded-lg border-2 outline-none"
                          style={{ borderColor: "var(--medium-gray)" }}
                        />
                      </td>
                      <td className="px-4 py-3 font-black" style={{ color: "var(--royal-blue)" }}>
                        {r.total}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-black px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: (GRADE_COLOR[r.grade] || "#6b7280") + "20",
                            color: GRADE_COLOR[r.grade] || "#6b7280",
                          }}
                        >
                          {r.grade}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => saveRow(i)}
                          disabled={!r.dirty || saving}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white disabled:opacity-40"
                          style={{ backgroundColor: "var(--royal-blue)" }}
                        >
                          <Save size={12} /> Save
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreCorrection;
