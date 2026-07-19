// src/admin/score-correction/ScoreCorrection.jsx
import React, { useState, useMemo } from "react";
import {
  Search,
  Edit3,
  Save,
  X,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  User,
  BookOpen,
  FileText,
  Filter,
} from "lucide-react";
import { STUDENTS } from "../data/adminData";
import { GRADE_SCALE, getGradeFromScore } from "../../data/schoolData";

// ─── Mock subject scores per student ─────────────────────────────────────────
const SUBJECTS = [
  "Core Mathematics",
  "English Language",
  "Integrated Science",
  "Social Studies",
  "ICT",
  "Elective Subject 1",
  "Elective Subject 2",
  "Elective Subject 3",
];

const makeScores = (seed) =>
  SUBJECTS.map((name, i) => {
    const ca = Math.min(
      30,
      Math.max(5, Math.round((seed * (i + 3)) % 26) + 12),
    );
    const exam = Math.min(
      70,
      Math.max(10, Math.round((seed * (i + 7)) % 56) + 22),
    );
    const total = ca + exam;
    return {
      subject: name,
      ca,
      exam,
      total,
      grade: getGradeFromScore(total),
      edited: false,
    };
  });

const buildStudentScores = () => {
  const map = {};
  STUDENTS.forEach((s, idx) => {
    map[s.id] = makeScores((idx + 1) * 17);
  });
  return map;
};

// ─── Grade badge ──────────────────────────────────────────────────────────────
const GradeBadge = ({ grade }) => {
  const g = GRADE_SCALE.find((x) => x.grade === grade);
  const color = g?.color || "#6b7280";
  return (
    <span
      className="text-xs font-black px-2 py-0.5 rounded"
      style={{ backgroundColor: color + "20", color }}
    >
      {grade}
    </span>
  );
};

// ─── Correction reason modal ──────────────────────────────────────────────────
const ReasonModal = ({
  student,
  subject,
  original,
  updated,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState("Examination script");
  const reasons = [
    "Score omitted by teacher",
    "Incorrect mark entered",
    "Calculation error",
    "Transcription error",
    "Student appeal with evidence",
    "Other",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div
          className="px-6 py-4"
          style={{
            background:
              "linear-gradient(135deg,var(--royal-blue-dark),var(--royal-blue))",
          }}
        >
          <p className="text-white font-black">Confirm Score Correction</p>
          <p className="text-blue-200 text-xs mt-0.5">
            {student.firstName} {student.lastName} · {subject.subject}
          </p>
        </div>
        <div className="h-1" style={{ backgroundColor: "var(--accent-red)" }} />

        <div className="p-5 space-y-4">
          {/* Score diff */}
          <div
            className="flex items-center gap-4 p-3 rounded-xl"
            style={{ backgroundColor: "var(--light-gray)" }}
          >
            <div className="text-center flex-1">
              <p className="text-xs text-gray-400 mb-1">Original</p>
              <p
                className="text-lg font-black"
                style={{ color: "var(--accent-red)" }}
              >
                {original.ca} + {original.exam} = {original.total}
              </p>
              <GradeBadge grade={original.grade} />
            </div>
            <div style={{ color: "var(--royal-blue)" }}>→</div>
            <div className="text-center flex-1">
              <p className="text-xs text-gray-400 mb-1">Corrected</p>
              <p
                className="text-lg font-black"
                style={{ color: "var(--success-dark)" }}
              >
                {updated.ca} + {updated.exam} = {updated.total}
              </p>
              <GradeBadge grade={getGradeFromScore(updated.total)} />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--dark-gray)" }}
            >
              Reason for Correction{" "}
              <span style={{ color: "var(--accent-red)" }}>*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border-2 rounded-xl outline-none bg-white"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <option value="">-- Select reason --</option>
              {reasons.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Evidence */}
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--dark-gray)" }}
            >
              Supporting Evidence
            </label>
            <select
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border-2 rounded-xl outline-none bg-white"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {[
                "Examination script",
                "Marked assessment sheet",
                "Teacher submission",
                "Student appeal form",
                "Other document",
              ].map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </div>

          <div
            className="flex items-start gap-2 p-3 rounded-xl border"
            style={{ borderColor: "#fcd34d", backgroundColor: "#fffbeb" }}
          >
            <AlertTriangle
              size={14}
              style={{ color: "#b45309", flexShrink: 0, marginTop: 2 }}
            />
            <p className="text-xs" style={{ color: "#92400e" }}>
              This correction will be logged in the audit trail with your admin
              credentials.
            </p>
          </div>
        </div>

        <div
          className="flex gap-3 px-5 py-4 border-t"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
            style={{
              borderColor: "var(--medium-gray)",
              color: "var(--dark-gray)",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (reason) onConfirm(reason, evidence);
            }}
            disabled={!reason}
            className="flex-1 py-2.5 rounded-xl text-sm font-black text-white"
            style={{
              backgroundColor: reason ? "var(--success-dark)" : "#9ca3af",
            }}
          >
            Confirm Correction
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const ScoreCorrection = () => {
  const [allScores, setAllScores] = useState(buildStudentScores);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // selected student
  const [editing, setEditing] = useState(null); // { idx, ca, exam }
  const [confirm, setConfirm] = useState(null); // { idx, updated }
  const [toast, setToast] = useState(null);
  const [filterClass, setFilterClass] = useState("All");
  const [corrections, setCorrections] = useState([]); // audit trail

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Filtered students
  const classes = [
    "All",
    ...new Set(STUDENTS.map((s) => s.formClass).filter(Boolean)),
  ].sort();
  const students = useMemo(
    () =>
      STUDENTS.filter((s) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          s.studentId?.toLowerCase().includes(q);
        const matchClass = filterClass === "All" || s.formClass === filterClass;
        return matchSearch && matchClass;
      }),
    [search, filterClass],
  );

  const studentScores = selected ? allScores[selected.id] || [] : [];

  const handleEdit = (idx) => {
    const s = studentScores[idx];
    setEditing({ idx, ca: s.ca, exam: s.exam });
  };

  const handleSaveEdit = () => {
    const ca = Math.min(30, Math.max(0, parseInt(editing.ca) || 0));
    const exam = Math.min(70, Math.max(0, parseInt(editing.exam) || 0));
    setConfirm({ idx: editing.idx, updated: { ca, exam, total: ca + exam } });
    setEditing(null);
  };

  const handleConfirm = (reason, evidence) => {
    const { idx, updated } = confirm;
    const original = { ...studentScores[idx] };
    const newGrade = getGradeFromScore(updated.total);
    setAllScores((prev) => {
      const arr = [...(prev[selected.id] || [])];
      arr[idx] = { ...arr[idx], ...updated, grade: newGrade, edited: true };
      return { ...prev, [selected.id]: arr };
    });
    setCorrections((c) => [
      {
        id: Date.now(),
        student: `${selected.firstName} ${selected.lastName}`,
        studentId: selected.studentId,
        subject: studentScores[idx].subject,
        from: `${original.ca}+${original.exam}=${original.total}(${original.grade})`,
        to: `${updated.ca}+${updated.exam}=${updated.total}(${newGrade})`,
        reason,
        evidence,
        time: new Date().toLocaleString(),
      },
      ...c,
    ]);
    setConfirm(null);
    showToast(
      `Score corrected for ${selected.firstName} ${selected.lastName} · ${studentScores[idx].subject}`,
    );
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
          <CheckCircle2 size={14} /> {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            Score Correction
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Directly view and correct student scores with full audit trail
          </p>
        </div>
        {corrections.length > 0 && (
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: "#fff1f2", color: "var(--accent-red)" }}
          >
            {corrections.length} correction{corrections.length > 1 ? "s" : ""}{" "}
            this session
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — student list */}
        <div
          className="bg-white rounded-2xl border shadow-sm overflow-hidden"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div
            className="p-3 border-b space-y-2"
            style={{
              borderColor: "var(--medium-gray)",
              backgroundColor: "var(--light-gray)",
            }}
          >
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student or ID…"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border-2 outline-none"
                style={{ borderColor: "var(--medium-gray)" }}
              />
            </div>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border-2 outline-none bg-white"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {classes.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
            {students.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-8">
                No students found
              </p>
            ) : (
              students.map((s) => {
                const isSelected = selected?.id === s.id;
                const editedCount = (allScores[s.id] || []).filter(
                  (sc) => sc.edited,
                ).length;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelected(s);
                      setEditing(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 border-b text-left hover:bg-blue-50 transition"
                    style={{
                      borderColor: "var(--medium-gray)",
                      backgroundColor: isSelected ? "#eef2ff" : "white",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{
                        backgroundColor: isSelected
                          ? "var(--royal-blue)"
                          : "var(--medium-gray)",
                      }}
                    >
                      {s.firstName?.[0]}
                      {s.lastName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {s.firstName} {s.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {s.studentId} · {s.formClass}
                      </p>
                    </div>
                    {editedCount > 0 && (
                      <span
                        className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: "var(--accent-red)" }}
                      >
                        {editedCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
          <p
            className="text-xs text-gray-400 text-center py-2 border-t"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {students.length} students
          </p>
        </div>

        {/* Right — score table */}
        <div className="lg:col-span-2 space-y-4">
          {!selected ? (
            <div
              className="bg-white rounded-2xl border shadow-sm p-12 text-center"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <User size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="font-bold text-sm text-gray-400">
                Select a student to view scores
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Search or browse the student list on the left
              </p>
            </div>
          ) : (
            <>
              {/* Student info banner */}
              <div
                className="bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                  style={{ backgroundColor: "var(--royal-blue)" }}
                >
                  {selected.firstName?.[0]}
                  {selected.lastName?.[0]}
                </div>
                <div className="flex-1">
                  <p
                    className="font-black text-base"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {selected.firstName} {selected.lastName}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {[
                      selected.studentId,
                      selected.formClass,
                      selected.year || "Form 1",
                      selected.course || selected.program || "General Science",
                    ]
                      .filter(Boolean)
                      .map((v) => (
                        <span
                          key={v}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: "var(--light-gray)",
                            color: "var(--dark-gray)",
                          }}
                        >
                          {v}
                        </span>
                      ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">Subjects</p>
                  <p
                    className="text-2xl font-black"
                    style={{ color: "var(--royal-blue)" }}
                  >
                    {studentScores.length}
                  </p>
                </div>
              </div>

              {/* Score table */}
              <div
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <div
                  className="px-4 py-3 border-b flex items-center justify-between"
                  style={{
                    borderColor: "var(--medium-gray)",
                    backgroundColor: "var(--light-gray)",
                  }}
                >
                  <p
                    className="text-sm font-black"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    Semester 1 Scores
                  </p>
                  <p className="text-xs text-gray-400">
                    CA max: 30 · Exam max: 70 · Total: 100
                  </p>
                </div>
                <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
                  <table className="w-full text-sm min-w-[550px]">
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
                          "CA (30)",
                          "Exam (70)",
                          "Total",
                          "Grade",
                          "",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-gray-500"
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
                      {studentScores.map((sc, idx) => (
                        <tr
                          key={sc.subject}
                          className="hover:bg-gray-50"
                          style={{
                            backgroundColor: sc.edited ? "#f0fdf4" : undefined,
                          }}
                        >
                          <td className="px-4 py-3">
                            <p
                              className="text-sm font-semibold"
                              style={{ color: "var(--dark-gray)" }}
                            >
                              {sc.subject}
                            </p>
                            {sc.edited && (
                              <span
                                className="text-xs font-bold"
                                style={{ color: "var(--success-dark)" }}
                              >
                                ✓ Corrected
                              </span>
                            )}
                          </td>

                          {editing?.idx === idx ? (
                            <>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  min={0}
                                  max={30}
                                  value={editing.ca}
                                  onChange={(e) =>
                                    setEditing({
                                      ...editing,
                                      ca: e.target.value,
                                    })
                                  }
                                  className="w-16 px-2 py-1.5 text-sm border-2 rounded-lg outline-none text-center font-bold"
                                  style={{ borderColor: "var(--royal-blue)" }}
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  min={0}
                                  max={70}
                                  value={editing.exam}
                                  onChange={(e) =>
                                    setEditing({
                                      ...editing,
                                      exam: e.target.value,
                                    })
                                  }
                                  className="w-16 px-2 py-1.5 text-sm border-2 rounded-lg outline-none text-center font-bold"
                                  style={{ borderColor: "var(--royal-blue)" }}
                                />
                              </td>
                              <td
                                className="px-4 py-3 font-black"
                                style={{ color: "var(--royal-blue)" }}
                              >
                                {Math.min(
                                  100,
                                  (parseInt(editing.ca) || 0) +
                                    (parseInt(editing.exam) || 0),
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <GradeBadge
                                  grade={getGradeFromScore(
                                    Math.min(
                                      100,
                                      (parseInt(editing.ca) || 0) +
                                        (parseInt(editing.exam) || 0),
                                    ),
                                  )}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1.5">
                                  <button
                                    type="button"
                                    onClick={handleSaveEdit}
                                    className="p-1.5 rounded-lg text-white"
                                    style={{
                                      backgroundColor: "var(--success-dark)",
                                    }}
                                  >
                                    <Save size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditing(null)}
                                    className="p-1.5 rounded-lg text-white"
                                    style={{
                                      backgroundColor: "var(--accent-red)",
                                    }}
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td
                                className="px-4 py-3 font-bold"
                                style={{ color: "var(--dark-gray)" }}
                              >
                                {sc.ca}
                              </td>
                              <td
                                className="px-4 py-3 font-bold"
                                style={{ color: "var(--dark-gray)" }}
                              >
                                {sc.exam}
                              </td>
                              <td
                                className="px-4 py-3 font-black"
                                style={{ color: "var(--royal-blue)" }}
                              >
                                {sc.total}
                              </td>
                              <td className="px-4 py-3">
                                <GradeBadge grade={sc.grade} />
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  type="button"
                                  onClick={() => handleEdit(idx)}
                                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition hover:shadow-sm"
                                  style={{
                                    borderColor: "var(--royal-blue)",
                                    color: "var(--royal-blue)",
                                    backgroundColor: "#eef2ff",
                                  }}
                                >
                                  <Edit3 size={12} /> Edit
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Audit trail */}
          {corrections.length > 0 && (
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <div
                className="px-4 py-3 border-b"
                style={{
                  borderColor: "var(--medium-gray)",
                  backgroundColor: "#fff1f2",
                }}
              >
                <p
                  className="text-sm font-black"
                  style={{ color: "var(--accent-red)" }}
                >
                  Correction Log — This Session
                </p>
              </div>
              <div
                className="divide-y"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                {corrections.map((c) => (
                  <div key={c.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--dark-gray)" }}
                        >
                          {c.student} · {c.subject}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {c.from} → {c.to}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "#b45309" }}
                        >
                          {c.reason} · {c.evidence}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 flex-shrink-0">
                        {c.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {confirm && selected && (
        <ReasonModal
          student={selected}
          subject={studentScores[confirm.idx]}
          original={studentScores[confirm.idx]}
          updated={confirm.updated}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default ScoreCorrection;
