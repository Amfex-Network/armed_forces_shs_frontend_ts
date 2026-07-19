// src/admin/academic-setup/GradingConfig.jsx
import React, { useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Info,
} from "lucide-react";

// ─── Default WASSCE grading scale ────────────────────────────────────────────
const DEFAULT_GRADES = [
  {
    id: 1,
    grade: "A1",
    minScore: 80,
    maxScore: 100,
    label: "Excellent",
    points: 1,
    passLevel: "distinction",
    color: "#16a34a",
  },
  {
    id: 2,
    grade: "B2",
    minScore: 70,
    maxScore: 79,
    label: "Very Good",
    points: 2,
    passLevel: "credit",
    color: "#2563eb",
  },
  {
    id: 3,
    grade: "B3",
    minScore: 65,
    maxScore: 69,
    label: "Good",
    points: 3,
    passLevel: "credit",
    color: "#3b82f6",
  },
  {
    id: 4,
    grade: "C4",
    minScore: 60,
    maxScore: 64,
    label: "Credit",
    points: 4,
    passLevel: "credit",
    color: "#ca8a04",
  },
  {
    id: 5,
    grade: "C5",
    minScore: 55,
    maxScore: 59,
    label: "Credit",
    points: 5,
    passLevel: "credit",
    color: "#ea580c",
  },
  {
    id: 6,
    grade: "C6",
    minScore: 50,
    maxScore: 54,
    label: "Credit",
    points: 6,
    passLevel: "credit",
    color: "#f97316",
  },
  {
    id: 7,
    grade: "D7",
    minScore: 45,
    maxScore: 49,
    label: "Pass",
    points: 7,
    passLevel: "pass",
    color: "#dc2626",
  },
  {
    id: 8,
    grade: "E8",
    minScore: 40,
    maxScore: 44,
    label: "Weak Pass",
    points: 8,
    passLevel: "pass",
    color: "#b91c1c",
  },
  {
    id: 9,
    grade: "F9",
    minScore: 0,
    maxScore: 39,
    label: "Fail",
    points: 9,
    passLevel: "fail",
    color: "#7f1d1d",
  },
];

const DEFAULT_SETTINGS = {
  caMax: 30,
  examMax: 70,
  totalMax: 100,
  passScore: 50,
  creditScore: 50,
  coreSubjects: 4,
  electiveSubjects: 3,
  aggregateMethod: "best3core1elective", // WASSCE standard
  maxAggregate: 36,
  minCreditPassForAdmission: 6,
};

const AGGREGATE_METHODS = [
  {
    value: "best3core1elective",
    label: "Best 3 Core + Best 1 Elective (WASSCE Standard)",
  },
  { value: "all8subjects", label: "All 8 Subjects" },
  { value: "best6subjects", label: "Best 6 Subjects" },
];

const PASS_LEVELS = [
  { value: "distinction", label: "Distinction" },
  { value: "credit", label: "Credit" },
  { value: "pass", label: "Pass" },
  { value: "fail", label: "Fail" },
];

const GRADE_COLORS = {
  "#16a34a": "bg-green-600",
  "#2563eb": "bg-blue-600",
  "#3b82f6": "bg-blue-500",
  "#ca8a04": "bg-yellow-600",
  "#ea580c": "bg-orange-500",
  "#f97316": "bg-orange-400",
  "#dc2626": "bg-red-600",
  "#b91c1c": "bg-red-700",
  "#7f1d1d": "bg-red-900",
};

// ─── Grade Row Editor ─────────────────────────────────────────────────────────
const GradeRow = ({
  grade,
  onUpdate,
  onDelete,
  isEditing,
  onEdit,
  onCancel,
}) => {
  const [draft, setDraft] = useState({ ...grade });
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  if (!isEditing) {
    return (
      <tr
        className="hover:bg-gray-50 transition border-b"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <td className="px-4 py-3">
          <span
            className="inline-flex items-center justify-center w-10 h-8 rounded-lg text-sm font-black text-white"
            style={{ backgroundColor: grade.color }}
          >
            {grade.grade}
          </span>
        </td>
        <td
          className="px-4 py-3 text-sm font-semibold"
          style={{ color: "var(--dark-gray)" }}
        >
          {grade.label}
        </td>
        <td className="px-4 py-3 text-sm text-center text-gray-600">
          {grade.minScore}
        </td>
        <td className="px-4 py-3 text-sm text-center text-gray-600">
          {grade.maxScore}
        </td>
        <td className="px-4 py-3 text-sm text-center">
          <span
            className="px-2 py-0.5 rounded font-bold text-white text-xs"
            style={{ backgroundColor: grade.color }}
          >
            {grade.points}
          </span>
        </td>
        <td className="px-4 py-3 text-sm">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
            style={{
              backgroundColor:
                grade.passLevel === "distinction"
                  ? "#f0fdf4"
                  : grade.passLevel === "credit"
                    ? "#eef2ff"
                    : grade.passLevel === "pass"
                      ? "#fffbeb"
                      : "#fff1f2",
              color:
                grade.passLevel === "distinction"
                  ? "var(--success-dark)"
                  : grade.passLevel === "credit"
                    ? "var(--royal-blue)"
                    : grade.passLevel === "pass"
                      ? "var(--warning)"
                      : "var(--accent-red)",
            }}
          >
            {grade.passLevel}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="p-1.5 rounded-lg hover:bg-yellow-50 transition"
              style={{ color: "var(--warning)" }}
            >
              <Edit3 size={14} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(grade.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 transition"
              style={{ color: "var(--accent-red)" }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr
      className="border-b"
      style={{ borderColor: "var(--medium-gray)", backgroundColor: "#fffbeb" }}
    >
      <td className="px-4 py-2">
        <input
          value={draft.grade}
          onChange={(e) => set("grade", e.target.value)}
          className="w-14 px-2 py-1.5 text-sm rounded-lg border-2 outline-none text-center font-black"
          style={{ borderColor: "var(--royal-blue)" }}
        />
      </td>
      <td className="px-4 py-2">
        <input
          value={draft.label}
          onChange={(e) => set("label", e.target.value)}
          className="w-28 px-2 py-1.5 text-sm rounded-lg border-2 outline-none"
          style={{ borderColor: "var(--royal-blue)" }}
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          value={draft.minScore}
          onChange={(e) => set("minScore", parseInt(e.target.value) || 0)}
          className="w-16 px-2 py-1.5 text-sm rounded-lg border-2 outline-none text-center"
          style={{ borderColor: "var(--royal-blue)" }}
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          value={draft.maxScore}
          onChange={(e) => set("maxScore", parseInt(e.target.value) || 0)}
          className="w-16 px-2 py-1.5 text-sm rounded-lg border-2 outline-none text-center"
          style={{ borderColor: "var(--royal-blue)" }}
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          value={draft.points}
          onChange={(e) => set("points", parseInt(e.target.value) || 0)}
          className="w-14 px-2 py-1.5 text-sm rounded-lg border-2 outline-none text-center"
          style={{ borderColor: "var(--royal-blue)" }}
        />
      </td>
      <td className="px-4 py-2">
        <select
          value={draft.passLevel}
          onChange={(e) => set("passLevel", e.target.value)}
          className="px-2 py-1.5 text-sm rounded-lg border-2 outline-none bg-white"
          style={{ borderColor: "var(--royal-blue)" }}
        >
          {PASS_LEVELS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onUpdate(draft)}
            className="p-1.5 rounded-lg text-white"
            style={{ backgroundColor: "var(--success-dark)" }}
          >
            <CheckCircle2 size={14} />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg"
            style={{
              backgroundColor: "var(--medium-gray)",
              color: "var(--dark-gray)",
            }}
          >
            <X size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// ─── GradingConfig Main ───────────────────────────────────────────────────────
const GradingConfig = () => {
  const [grades, setGrades] = useState(DEFAULT_GRADES);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("scale"); // 'scale' | 'settings' | 'calculator'

  // Calculator state
  const [calcCA, setCalcCA] = useState("");
  const [calcExam, setCalcExam] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const setSetting = (k, v) => setSettings((s) => ({ ...s, [k]: v }));

  const handleUpdate = (updated) => {
    setGrades((gs) => gs.map((g) => (g.id === updated.id ? updated : g)));
    setEditingId(null);
    showToast("Grade updated");
  };

  const handleDelete = (id) => {
    setGrades((gs) => gs.filter((g) => g.id !== id));
    showToast("Grade removed", "error");
  };

  const handleAddGrade = () => {
    const newGrade = {
      id: Date.now(),
      grade: "X1",
      minScore: 0,
      maxScore: 0,
      label: "New Grade",
      points: 9,
      passLevel: "fail",
      color: "#6b7280",
    };
    setGrades((gs) => [...gs, newGrade]);
    setEditingId(newGrade.id);
  };

  const handleReset = () => {
    setGrades(DEFAULT_GRADES);
    setSettings(DEFAULT_SETTINGS);
    showToast("Reset to WASSCE defaults");
  };

  const handleSave = () =>
    showToast("Grading configuration saved successfully");

  // Calculator logic
  const calcTotal = (parseInt(calcCA) || 0) + (parseInt(calcExam) || 0);
  const calcGrade = grades
    .slice()
    .sort((a, b) => b.minScore - a.minScore)
    .find((g) => calcTotal >= g.minScore && calcTotal <= g.maxScore);

  return (
    <div className="space-y-6">
      {/* Toast */}
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
            <AlertCircle size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}{" "}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            Grading Configuration
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            WASSCE Standard · {grades.length} grade levels configured
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition"
            style={{
              borderColor: "var(--medium-gray)",
              color: "var(--dark-gray)",
              backgroundColor: "white",
            }}
          >
            <RotateCcw size={13} /> Reset to Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 text-sm font-bold px-5 py-2 rounded-xl text-white"
            style={{ backgroundColor: "var(--royal-blue)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--royal-blue-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--royal-blue)")
            }
          >
            <Save size={15} /> Save Configuration
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl border"
        style={{ backgroundColor: "#eef2ff", borderColor: "#c7d2fe" }}
      >
        <Info
          size={15}
          style={{ color: "var(--royal-blue)" }}
          className="flex-shrink-0 mt-0.5"
        />
        <p className="text-xs" style={{ color: "var(--royal-blue)" }}>
          This configuration follows the{" "}
          <strong>WAEC WASSCE grading system</strong>. Grades A1–F9 are used
          across all subjects. CA is marked out of {settings.caMax} and Exam out
          of {settings.examMax}, totalling {settings.totalMax} marks. Changes
          here affect how grades are computed and displayed on all report cards.
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        {[
          { id: "scale", label: "Grade Scale" },
          { id: "settings", label: "Score Settings" },
          { id: "calculator", label: "Grade Calculator" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
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

      {/* ── GRADE SCALE TAB ───────────────────────────────────────────────── */}
      {activeTab === "scale" && (
        <div className="space-y-4">
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
                WASSCE Grade Scale
              </h3>
              <button
                type="button"
                onClick={handleAddGrade}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                style={{ backgroundColor: "var(--royal-blue)" }}
              >
                <Plus size={12} /> Add Grade
              </button>
            </div>
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
                      "Grade",
                      "Label",
                      "Min Score",
                      "Max Score",
                      "Points",
                      "Pass Level",
                      "Actions",
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
                  {grades.map((g) => (
                    <GradeRow
                      key={g.id}
                      grade={g}
                      isEditing={editingId === g.id}
                      onEdit={() => setEditingId(g.id)}
                      onCancel={() => setEditingId(null)}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual grade scale */}
          <div
            className="bg-white rounded-xl border shadow-sm p-5"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <h3
              className="font-semibold text-sm mb-4"
              style={{ color: "var(--dark-gray)" }}
            >
              Visual Grade Scale
            </h3>
            <div className="flex gap-1 h-10 rounded-xl overflow-hidden">
              {grades
                .slice()
                .sort((a, b) => b.minScore - a.minScore)
                .map((g) => (
                  <div
                    key={g.id}
                    title={`${g.grade}: ${g.minScore}–${g.maxScore}`}
                    className="flex items-center justify-center text-white text-xs font-black transition-all hover:flex-[3]"
                    style={{
                      backgroundColor: g.color,
                      flex: g.maxScore - g.minScore + 1,
                    }}
                  >
                    {g.grade}
                  </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>0</span>
              {[20, 40, 50, 60, 70, 80].map((n) => (
                <span key={n}>{n}</span>
              ))}
              <span>100</span>
            </div>
          </div>
        </div>
      )}

      {/* ── SETTINGS TAB ─────────────────────────────────────────────────── */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score breakdown */}
          <div
            className="bg-white rounded-xl border shadow-sm p-5"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <h3
              className="font-semibold text-sm mb-4"
              style={{ color: "var(--dark-gray)" }}
            >
              Score Breakdown
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Continuous Assessment (CA) Max",
                  key: "caMax",
                  min: 0,
                  max: 100,
                },
                {
                  label: "Examination Score Max",
                  key: "examMax",
                  min: 0,
                  max: 100,
                },
                { label: "Total Score Max", key: "totalMax", min: 0, max: 100 },
                {
                  label: "Pass Score (minimum)",
                  key: "passScore",
                  min: 0,
                  max: 100,
                },
              ].map(({ label, key, min, max }) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4"
                >
                  <label
                    className="text-sm flex-1"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={min}
                      max={max}
                      value={settings[key]}
                      onChange={(e) =>
                        setSetting(key, parseInt(e.target.value) || 0)
                      }
                      className="w-20 px-3 py-2 text-sm rounded-xl border-2 outline-none text-center font-bold"
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
              ))}
              {/* CA + Exam bar */}
              <div className="pt-2">
                <p className="text-xs text-gray-400 mb-1.5">
                  Score distribution
                </p>
                <div className="flex h-6 rounded-xl overflow-hidden text-xs font-black">
                  <div
                    className="flex items-center justify-center text-white transition-all"
                    style={{
                      flex: settings.caMax,
                      backgroundColor: "var(--royal-blue)",
                    }}
                  >
                    CA {settings.caMax}
                  </div>
                  <div
                    className="flex items-center justify-center text-white transition-all"
                    style={{
                      flex: settings.examMax,
                      backgroundColor: "var(--accent-red)",
                    }}
                  >
                    Exam {settings.examMax}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aggregate settings */}
          <div
            className="bg-white rounded-xl border shadow-sm p-5"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <h3
              className="font-semibold text-sm mb-4"
              style={{ color: "var(--dark-gray)" }}
            >
              Aggregate & Admission
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  className="text-xs font-bold uppercase tracking-wider block mb-1.5"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Aggregate Method
                </label>
                <select
                  value={settings.aggregateMethod}
                  onChange={(e) =>
                    setSetting("aggregateMethod", e.target.value)
                  }
                  className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none bg-white"
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
                >
                  {AGGREGATE_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {[
                {
                  label: "Maximum Aggregate Score",
                  key: "maxAggregate",
                  min: 4,
                  max: 72,
                },
                {
                  label: "Core Subjects Count",
                  key: "coreSubjects",
                  min: 1,
                  max: 10,
                },
                {
                  label: "Elective Subjects Count",
                  key: "electiveSubjects",
                  min: 1,
                  max: 10,
                },
                {
                  label: "Min Credits for Admission",
                  key: "minCreditPassForAdmission",
                  min: 1,
                  max: 10,
                },
              ].map(({ label, key, min, max }) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4"
                >
                  <label
                    className="text-sm flex-1"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {label}
                  </label>
                  <input
                    type="number"
                    min={min}
                    max={max}
                    value={settings[key]}
                    onChange={(e) =>
                      setSetting(key, parseInt(e.target.value) || 0)
                    }
                    className="w-20 px-3 py-2 text-sm rounded-xl border-2 outline-none text-center font-bold"
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
              ))}

              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: "#eef2ff" }}
              >
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--royal-blue)" }}
                >
                  📋 Current method:{" "}
                  <strong>
                    {
                      AGGREGATE_METHODS.find(
                        (m) => m.value === settings.aggregateMethod,
                      )?.label
                    }
                  </strong>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Max possible aggregate:{" "}
                  <strong>{settings.maxAggregate}</strong> · Min credits for
                  admission:{" "}
                  <strong>{settings.minCreditPassForAdmission}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CALCULATOR TAB ───────────────────────────────────────────────── */}
      {activeTab === "calculator" && (
        <div className="max-w-md mx-auto">
          <div
            className="bg-white rounded-2xl border shadow-sm p-6"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <h3
              className="font-black text-base mb-1"
              style={{ color: "var(--dark-gray)" }}
            >
              Grade Calculator
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Enter a student's CA and Exam scores to preview their grade
            </p>

            <div className="space-y-4">
              <div>
                <label
                  className="text-xs font-bold uppercase tracking-wider block mb-1.5"
                  style={{ color: "var(--dark-gray)" }}
                >
                  CA Score{" "}
                  <span className="font-normal text-gray-400">
                    (out of {settings.caMax})
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={settings.caMax}
                  value={calcCA}
                  onChange={(e) => setCalcCA(e.target.value)}
                  placeholder={`0 – ${settings.caMax}`}
                  className="w-full px-4 py-3 text-lg rounded-xl border-2 outline-none text-center font-black"
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

              <div>
                <label
                  className="text-xs font-bold uppercase tracking-wider block mb-1.5"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Exam Score{" "}
                  <span className="font-normal text-gray-400">
                    (out of {settings.examMax})
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={settings.examMax}
                  value={calcExam}
                  onChange={(e) => setCalcExam(e.target.value)}
                  placeholder={`0 – ${settings.examMax}`}
                  className="w-full px-4 py-3 text-lg rounded-xl border-2 outline-none text-center font-black"
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

              {/* Result */}
              {(calcCA !== "" || calcExam !== "") && (
                <div
                  className={`p-5 rounded-2xl text-center border-2`}
                  style={{
                    backgroundColor: calcGrade
                      ? calcGrade.color + "15"
                      : "#f3f4f6",
                    borderColor: calcGrade
                      ? calcGrade.color
                      : "var(--medium-gray)",
                  }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest mb-2 text-gray-400">
                    Result
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <p
                        className="text-4xl font-black"
                        style={{ color: calcGrade?.color || "#6b7280" }}
                      >
                        {calcTotal}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Total / {settings.totalMax}
                      </p>
                    </div>
                    <div className="text-center">
                      <p
                        className="text-4xl font-black"
                        style={{ color: calcGrade?.color || "#6b7280" }}
                      >
                        {calcGrade?.grade || "—"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Grade</p>
                    </div>
                    <div className="text-center">
                      <p
                        className="text-2xl font-black"
                        style={{ color: calcGrade?.color || "#6b7280" }}
                      >
                        {calcGrade?.points || "—"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Points</p>
                    </div>
                  </div>
                  {calcGrade && (
                    <p
                      className="text-sm font-bold mt-3"
                      style={{ color: calcGrade.color }}
                    >
                      {calcGrade.label} ·{" "}
                      {calcGrade.passLevel.charAt(0).toUpperCase() +
                        calcGrade.passLevel.slice(1)}
                    </p>
                  )}
                  {!calcGrade && (calcCA !== "" || calcExam !== "") && (
                    <p className="text-sm text-gray-400 mt-2">
                      Score out of range
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick reference */}
          <div
            className="mt-4 bg-white rounded-xl border shadow-sm overflow-hidden"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div
              className="px-4 py-3 border-b"
              style={{
                borderColor: "var(--medium-gray)",
                backgroundColor: "var(--light-gray)",
              }}
            >
              <h4
                className="font-semibold text-sm"
                style={{ color: "var(--dark-gray)" }}
              >
                Quick Reference
              </h4>
            </div>
            <div className="p-3 grid grid-cols-3 gap-2">
              {grades.map((g) => (
                <div
                  key={g.id}
                  className="text-center p-2 rounded-lg"
                  style={{
                    backgroundColor: g.color + "12",
                    border: `1px solid ${g.color}30`,
                  }}
                >
                  <p className="text-sm font-black" style={{ color: g.color }}>
                    {g.grade}
                  </p>
                  <p className="text-xs text-gray-500">
                    {g.minScore}–{g.maxScore}
                  </p>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: g.color }}
                  >
                    {g.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default GradingConfig;
