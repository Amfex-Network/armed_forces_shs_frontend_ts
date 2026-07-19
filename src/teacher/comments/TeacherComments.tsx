// src/teacher/comments/TeacherComments.jsx
import React, { useState, useMemo } from "react";
import {
  Save,
  CheckSquare,
  Square,
  Users,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  FORM_CLASS_STUDENTS as _FCS,
  COMMENT_TEMPLATES,
  getGradeColor,
} from "../data/teacherData";
const FORM_CLASS_STUDENTS = Array.isArray(_FCS) ? _FCS : [];
import { Avatar, PageHeader } from "../components/TeacherUI";

// ─── Ghana WASSCE Grade Letter Groups ────────────────────────────────────────
// A=A1(80-100) | B=B2,B3(65-79) | C=C4,C5,C6(50-64) | D=D7(45-49) | E=E8(40-44) | F=F9(0-39)
const GRADE_GROUPS = [
  {
    letter: "A",
    label: "Grade A",
    sub: "A1 · 80–100",
    description: "Excellent",
    grades: ["A1"],
    color: "var(--success-dark)",
    bg: "#f0fdf4",
    border: "#86efac",
  },
  {
    letter: "B",
    label: "Grade B",
    sub: "B2, B3 · 65–79",
    description: "Very Good / Good",
    grades: ["B2", "B3"],
    color: "var(--info)",
    bg: "#eff6ff",
    border: "#93c5fd",
  },
  {
    letter: "C",
    label: "Grade C",
    sub: "C4, C5, C6 · 50–64",
    description: "Credit",
    grades: ["C4", "C5", "C6"],
    color: "var(--warning)",
    bg: "#fffbeb",
    border: "#fcd34d",
  },
  {
    letter: "D",
    label: "Grade D",
    sub: "D7 · 45–49",
    description: "Pass",
    grades: ["D7"],
    color: "#ea580c",
    bg: "#fff7ed",
    border: "#fdba74",
  },
  {
    letter: "E",
    label: "Grade E",
    sub: "E8 · 40–44",
    description: "Weak Pass",
    grades: ["E8"],
    color: "var(--accent-red)",
    bg: "#fff1f2",
    border: "#fca5a5",
  },
  {
    letter: "F",
    label: "Grade F",
    sub: "F9 · 0–39",
    description: "Fail",
    grades: ["F9"],
    color: "var(--accent-red-dark)",
    bg: "#fef2f2",
    border: "#f87171",
  },
  {
    letter: "All",
    label: "Select All",
    sub: "All students",
    description: "",
    grades: "all",
    color: "var(--royal-blue)",
    bg: "#eef2ff",
    border: "#a5b4fc",
  },
];

const buildInitialComments = () =>
  FORM_CLASS_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: "" }), {});

const TeacherComments = () => {
  const [selected, setSelected] = useState([]);
  const [comments, setComments] = useState(buildInitialComments());
  const [bulkText, setBulkText] = useState("");
  const [saved, setSaved] = useState([]);
  const [expanded, setExpanded] = useState(true);

  // ── Selection helpers ────────────────────────────────────────────────────────
  const selectByGrade = (grades) => {
    const ids =
      grades === "all"
        ? FORM_CLASS_STUDENTS.map((s) => s.id)
        : FORM_CLASS_STUDENTS.filter((s) => grades.includes(s.grade)).map(
            (s) => s.id,
          );
    setSelected((prev) => [...new Set([...prev, ...ids])]);
  };

  const toggleStudent = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const clearSelection = () => {
    setSelected([]);
    setBulkText("");
  };

  const selectedStudents = useMemo(
    () => FORM_CLASS_STUDENTS.filter((s) => selected.includes(s.id)),
    [selected],
  );

  // ── Apply bulk text to all selected ────────────────────────────────────────
  const applyBulkComment = () => {
    if (!bulkText.trim() || selected.length === 0) return;
    const updated = { ...comments };
    selected.forEach((id) => {
      updated[id] = bulkText;
    });
    setComments(updated);
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (selected.length === 0) return;
    // Apply bulk text first if not yet applied
    if (bulkText.trim()) {
      const updated = { ...comments };
      selected.forEach((id) => {
        if (!updated[id]?.trim()) updated[id] = bulkText;
      });
      setComments(updated);
    }
    setSaved((prev) => [...new Set([...prev, ...selected])]);
    clearSelection();
  };

  // ── Grade counts ─────────────────────────────────────────────────────────────
  const gradeCounts = useMemo(
    () =>
      FORM_CLASS_STUDENTS.reduce((acc, s) => {
        acc[s.grade] = (acc[s.grade] || 0) + 1;
        return acc;
      }, {}),
    [],
  );

  const groupCount = (group) =>
    group.grades === "all"
      ? FORM_CLASS_STUDENTS.length
      : FORM_CLASS_STUDENTS.filter((s) => group.grades.includes(s.grade))
          .length;

  return (
    <div className="space-y-5">
      <PageHeader title="Student Comments & Remarks" />

      {/* ── WASSCE Grade Quick-Select ───────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[var(--medium-gray)] shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--dark-gray)" }}
          >
            Select by WASSCE Grade
          </p>
          <p className="text-xs text-gray-400">
            Click a grade to select all students in that group
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {GRADE_GROUPS.map((group) => {
            const count = groupCount(group);
            if (count === 0 && group.grades !== "all") return null;

            return (
              <button
                key={group.letter}
                onClick={() => selectByGrade(group.grades)}
                className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl border-2 text-center transition-all hover:shadow-md active:scale-95"
                style={{
                  backgroundColor: group.bg,
                  borderColor: group.border,
                  color: group.color,
                }}
              >
                <span className="text-xl font-black">{group.letter}</span>
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: group.color }}
                >
                  {count}
                </span>
                <span className="text-xs font-medium leading-tight">
                  {group.sub.split("·")[0].trim()}
                </span>
                <span className="text-xs opacity-70 hidden sm:block">
                  {group.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selection summary */}
        {selected.length > 0 && (
          <div
            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: "#eef2ff" }}
          >
            <CheckSquare size={14} style={{ color: "var(--royal-blue)" }} />
            <span
              className="font-semibold"
              style={{ color: "var(--royal-blue)" }}
            >
              {selected.length} student{selected.length > 1 ? "s" : ""} selected
            </span>
            <span className="text-xs text-gray-400 flex-1 truncate">
              {selectedStudents
                .map((s) => `${s.name.split(" ")[0]} (${s.grade})`)
                .join(", ")}
            </span>
            <button
              onClick={clearSelection}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition"
              style={{ color: "var(--accent-red)" }}
            >
              <X size={11} /> Clear
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ── Student List ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--medium-gray)] shadow-sm overflow-hidden">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-4 py-3 border-b transition hover:bg-gray-50"
            style={{
              backgroundColor: "var(--light-gray)",
              borderColor: "var(--medium-gray)",
            }}
          >
            <div className="text-left">
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--dark-gray)" }}
              >
                Form 3 Science B
              </p>
              <p className="text-xs text-gray-400">
                {FORM_CLASS_STUDENTS.length} students
              </p>
            </div>
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {expanded && (
            <div
              className="divide-y"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {FORM_CLASS_STUDENTS.map((s) => {
                const isSelected = selected.includes(s.id);
                const isSaved = saved.includes(s.id);
                const hasComment = comments[s.id]?.trim();

                return (
                  <div
                    key={s.id}
                    onClick={() => toggleStudent(s.id)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all"
                    style={{
                      backgroundColor: isSelected ? "#eef2ff" : "white",
                      borderLeft: `3px solid ${isSelected ? "var(--royal-blue)" : "transparent"}`,
                    }}
                  >
                    <div
                      style={{
                        color: isSelected
                          ? "var(--royal-blue)"
                          : "var(--medium-gray)",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected ? (
                        <CheckSquare size={16} />
                      ) : (
                        <Square size={16} />
                      )}
                    </div>

                    <Avatar
                      name={s.name}
                      size="sm"
                      color={
                        isSelected
                          ? "bg-blue-700"
                          : isSaved
                            ? "bg-green-600"
                            : "bg-gray-400"
                      }
                    />

                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {s.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded font-bold ${getGradeColor(s.grade)}`}
                        >
                          {s.grade}
                        </span>
                        <span className="text-xs text-gray-400">
                          {s.total}/100
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isSaved ? (
                        <span
                          className="text-xs flex items-center gap-0.5"
                          style={{ color: "var(--success-dark)" }}
                        >
                          <Check size={11} /> Saved
                        </span>
                      ) : hasComment ? (
                        <span
                          className="w-2 h-2 rounded-full block"
                          style={{ backgroundColor: "var(--warning)" }}
                          title="Unsaved draft"
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Comment Editor ────────────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          {selected.length === 0 ? (
            <div className="bg-white rounded-xl border border-[var(--medium-gray)] shadow-sm p-10 text-center">
              <Users
                size={40}
                className="mx-auto mb-3 opacity-20"
                style={{ color: "var(--royal-blue)" }}
              />
              <p className="text-sm font-medium text-gray-500">
                No students selected
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Click a grade button above or select students individually from
                the list
              </p>
              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                {GRADE_GROUPS.filter((g) => groupCount(g) > 0).map((g) => (
                  <button
                    key={g.letter}
                    onClick={() => selectByGrade(g.grades)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition"
                    style={{
                      backgroundColor: g.bg,
                      borderColor: g.border,
                      color: g.color,
                    }}
                  >
                    Grade {g.letter} ({groupCount(g)})
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[var(--medium-gray)] shadow-sm overflow-hidden">
              {/* Header */}
              <div
                className="px-5 py-3 border-b flex items-center justify-between"
                style={{
                  backgroundColor: "var(--light-gray)",
                  borderColor: "var(--medium-gray)",
                }}
              >
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {selected.length === 1
                      ? selectedStudents[0].name
                      : `${selected.length} Students Selected`}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selected.length === 1
                      ? `${selectedStudents[0].studentId} · ${selectedStudents[0].grade} · ${selectedStudents[0].total}/100`
                      : `Grades present: ${[...new Set(selectedStudents.map((s) => s.grade))].join(", ")}`}
                  </p>
                </div>
                {selected.length > 1 && (
                  <div className="flex -space-x-2">
                    {selectedStudents.slice(0, 5).map((s) => (
                      <Avatar
                        key={s.id}
                        name={s.name}
                        size="sm"
                        color="bg-blue-700"
                      />
                    ))}
                    {selectedStudents.length > 5 && (
                      <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                        +{selectedStudents.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4">
                {/* Templates */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Quick Templates
                  </label>
                  <div className="space-y-1.5">
                    {COMMENT_TEMPLATES.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => setBulkText(t)}
                        className="w-full text-left px-3 py-2 text-xs rounded-lg border-2 transition-all"
                        style={{
                          borderColor:
                            bulkText === t
                              ? "var(--royal-blue)"
                              : "var(--medium-gray)",
                          backgroundColor: bulkText === t ? "#eef2ff" : "white",
                          color: "var(--dark-gray)",
                        }}
                      >
                        {bulkText === t && (
                          <Check
                            size={10}
                            className="inline mr-1.5"
                            style={{ color: "var(--royal-blue)" }}
                          />
                        )}
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    {selected.length === 1
                      ? "Teacher's Comment"
                      : `Comment for all ${selected.length} selected students`}
                    <span className="font-normal text-gray-400 ml-1 normal-case">
                      ({bulkText.length}/500)
                    </span>
                  </label>
                  <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value.slice(0, 500))}
                    rows={4}
                    placeholder={
                      selected.length === 1
                        ? `Write a comment for ${selectedStudents[0]?.name}...`
                        : `This comment will be applied to all ${selected.length} selected students...`
                    }
                    className="w-full px-3 py-2 text-sm border-2 rounded-lg resize-none focus:outline-none transition-all"
                    style={{ borderColor: "var(--medium-gray)" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--royal-blue)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--medium-gray)")
                    }
                  />
                </div>

                {/* Bulk preview warning */}
                {selected.length > 1 && bulkText.trim() && (
                  <div
                    className="rounded-lg p-3 text-xs border-2"
                    style={{
                      backgroundColor: "#fffbeb",
                      borderColor: "var(--warning)",
                      color: "var(--dark-gray)",
                    }}
                  >
                    <p
                      className="font-bold mb-1.5"
                      style={{ color: "var(--warning)" }}
                    >
                      Note: This comment will be applied to:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedStudents.map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 rounded text-xs font-medium border"
                          style={{
                            backgroundColor: "white",
                            borderColor: "var(--medium-gray)",
                          }}
                        >
                          {s.name.split(" ")[0]}{" "}
                          <span
                            className={`font-bold ${getGradeColor(s.grade)}`}
                          >
                            ({s.grade})
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  {selected.length > 1 && (
                    <button
                      onClick={applyBulkComment}
                      disabled={!bulkText.trim()}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        borderColor: "var(--royal-blue)",
                        color: "var(--royal-blue)",
                        backgroundColor: "white",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#eef2ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "white")
                      }
                    >
                      <Users size={13} />
                      Apply to {selected.length} Students
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={!bulkText.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "var(--royal-blue)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--royal-blue-dark)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--royal-blue)")
                    }
                  >
                    <Save size={13} />
                    Save{" "}
                    {selected.length > 1
                      ? `${selected.length} Comments`
                      : "Comment"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Saved Comments Review */}
          {saved.length > 0 && (
            <div className="bg-white rounded-xl border border-[var(--medium-gray)] shadow-sm overflow-hidden">
              <div
                className="px-5 py-3 border-b"
                style={{
                  backgroundColor: "var(--light-gray)",
                  borderColor: "var(--medium-gray)",
                }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Saved Comments ({saved.length}/{FORM_CLASS_STUDENTS.length})
                </p>
              </div>
              <div
                className="divide-y"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                {FORM_CLASS_STUDENTS.filter((s) => saved.includes(s.id)).map(
                  (s) => (
                    <div key={s.id} className="px-5 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar name={s.name} size="sm" color="bg-green-600" />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--dark-gray)" }}
                        >
                          {s.name}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded font-bold ${getGradeColor(s.grade)}`}
                        >
                          {s.grade}
                        </span>
                        <span
                          className="ml-auto text-xs flex items-center gap-1"
                          style={{ color: "var(--success-dark)" }}
                        >
                          <Check size={10} /> Saved
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 ml-9 italic">
                        "{comments[s.id]}"
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherComments;
