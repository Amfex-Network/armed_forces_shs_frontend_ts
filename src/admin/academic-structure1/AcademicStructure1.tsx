// src/admin/academic-structure1/AcademicStructure1.jsx
import React, { useState } from "react";
import {
  CheckCircle2,
  Plus,
  Save,
  Trash2,
  Calendar,
  Edit3,
  X,
  ChevronDown,
  Clock,
  Users,
  BookOpen,
  AlertTriangle,
  Search,
} from "lucide-react";
import SchoolProfileSetup from "./SchoolProfileSetup";
import GradingConfiguration from "./GradingConfiguration";
import AssessmentConfiguration from "./AssessmentConfiguration";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (d) => {
  if (!d || d === "—") return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

// ─── Data Model ───────────────────────────────────────────────────────────────
// Transitional System:
//   - 3 Year Groups: Form 1, Form 2, Form 3
//   - Always 2 in school (active), 1 in the house (inactive)
//   - 2 Semesters per academic year (Semester 1, Semester 2)
//   - Each semester has a start and end date

const YEAR_GROUPS = [
  { id: "form1", label: "Form 1 (First Year)" },
  { id: "form2", label: "Form 2 (Second Year)" },
  { id: "form3", label: "Form 3 (Third Year)" },
];

const SEM_DEFS = [
  { key: "sem1", label: "Semester 1", color: "var(--royal-blue)" },
  { key: "sem2", label: "Semester 2", color: "#7c3aed" },
];

const EMPTY_SEM = { start: "", end: "" };
const EMPTY_YEAR = {
  year: "",
  status: "upcoming",
  notes: "",
  sem1: { ...EMPTY_SEM },
  sem2: { ...EMPTY_SEM },
};

const INITIAL_YEARS = [
  {
    id: 1,
    year: "2024/2025",
    status: "active",
    notes: "Current academic year",
    // Which 2 year groups are in school, which 1 is in the house
    inSchool: ["form1", "form3"], // Form 1 and Form 3 in school
    inHouse: ["form2"], // Form 2 in the house
    sem1: { start: "2024-09-02", end: "2025-01-31" },
    sem2: { start: "2025-02-03", end: "2025-07-25" },
  },
  {
    id: 2,
    year: "2023/2024",
    status: "upcoming",
    notes: "",
    inSchool: ["form1", "form2"],
    inHouse: ["form3"],
    sem1: { start: "2023-09-04", end: "2024-01-26" },
    sem2: { start: "2024-01-29", end: "2024-07-26" },
  },
];

const STATUS_CFG = {
  active: { bg: "#f0fdf4", color: "var(--success-dark)", label: "Active" },
  upcoming: { bg: "#eef2ff", color: "var(--royal-blue)", label: "Upcoming" },
};

// ─── Date Field ───────────────────────────────────────────────────────────────
const DateField = ({ label, value, onChange }) => (
  <div>
    <label
      className="block text-xs font-semibold mb-1"
      style={{ color: "#6b7280" }}
    >
      {label}
    </label>
    <input
      type="date"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-xs border-2 rounded-xl outline-none transition"
      style={{ borderColor: "var(--medium-gray)", color: "var(--dark-gray)" }}
      onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--medium-gray)")}
    />
  </div>
);

// ─── Year Group Toggle ────────────────────────────────────────────────────────
const YearGroupToggle = ({ inSchool, inHouse, onChange }) => {
  const toggle = (id) => {
    let newInSchool = [...inSchool];
    let newInHouse = [...inHouse];
    if (newInSchool.includes(id)) {
      // move to house — only if there are 2 in school (keep min 1)
      if (newInSchool.length <= 1) return;
      newInSchool = newInSchool.filter((x) => x !== id);
      newInHouse = [...newInHouse, id];
    } else {
      // move to school — only if there are < 2 in school
      if (newInSchool.length >= 2) return;
      newInHouse = newInHouse.filter((x) => x !== id);
      newInSchool = [...newInSchool, id];
    }
    onChange(newInSchool, newInHouse);
  };

  return (
    <div className="space-y-2">
      <p
        className="text-xs font-bold uppercase tracking-wider mb-2"
        style={{ color: "#6b7280" }}
      >
        Year Group Status{" "}
        <span className="font-normal text-gray-400">(select 2 in school)</span>
      </p>
      <div className="grid grid-cols-3 gap-2">
        {YEAR_GROUPS.map((yg) => {
          const active = inSchool.includes(yg.id);
          return (
            <button
              key={yg.id}
              type="button"
              onClick={() => toggle(yg.id)}
              className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition text-center"
              style={{
                borderColor: active
                  ? "var(--success-dark)"
                  : "var(--medium-gray)",
                backgroundColor: active ? "#f0fdf4" : "#f9fafb",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                style={{
                  backgroundColor: active ? "var(--success-dark)" : "#e5e7eb",
                  color: active ? "white" : "#6b7280",
                }}
              >
                {yg.id === "form1" ? "1" : yg.id === "form2" ? "2" : "3"}
              </div>
              <p
                className="text-xs font-semibold"
                style={{ color: active ? "var(--success-dark)" : "#6b7280" }}
              >
                {yg.id === "form1"
                  ? "Form 1"
                  : yg.id === "form2"
                    ? "Form 2"
                    : "Form 3"}
              </p>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{
                  backgroundColor: active ? "#dcfce7" : "#fef3c7",
                  color: active ? "var(--success-dark)" : "#92400e",
                }}
              >
                {active ? "In School" : "In House"}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-1">
        In School:{" "}
        <strong>
          {inSchool
            .map((id) => YEAR_GROUPS.find((y) => y.id === id)?.label)
            .join(", ")}
        </strong>
        {" · "}
        In House:{" "}
        <strong>
          {inHouse
            .map((id) => YEAR_GROUPS.find((y) => y.id === id)?.label)
            .join(", ")}
        </strong>
      </p>
    </div>
  );
};

// ─── Year Modal ───────────────────────────────────────────────────────────────
const YearModal = ({ yearData, onSave, onClose, allYears = [] }) => {
  const isEdit = !!yearData?.id;
  const [form, setForm] = useState(
    yearData
      ? { ...yearData }
      : {
          ...EMPTY_YEAR,
          sem1: { ...EMPTY_SEM },
          sem2: { ...EMPTY_SEM },
          inSchool: ["form1", "form3"],
          inHouse: ["form2"],
        },
  );
  const [activeSem, setAS] = useState("sem1");
  const [errors, setErrors] = useState({});
  const [yearSearch, setYearSearch] = useState("");

  const pastYears = allYears.filter(
    (y) =>
      y.id !== yearData?.id &&
      y.year.toLowerCase().includes(yearSearch.toLowerCase()),
  );

  const loadPastYear = (y) => {
    setForm({ ...y, id: yearData?.id || null });
    setYearSearch("");
  };

  const setSem = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.year.trim()) e.year = "Required";
    if (!form.sem1.start || !form.sem1.end) e.sem1 = "Both dates required";
    if (!form.sem2.start || !form.sem2.end) e.sem2 = "Both dates required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,.45)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg,var(--royal-blue-dark),var(--royal-blue))",
          }}
        >
          <div>
            <p className="text-white font-black text-sm">
              {isEdit ? "Edit" : "Add"} Academic Year
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "rgba(255,255,255,.6)" }}
            >
              Transitional system — set semesters & year group status
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/20"
          >
            <X size={14} />
          </button>
        </div>
        <div className="h-1" style={{ backgroundColor: "var(--accent-red)" }} />

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Search past years */}
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--dark-gray)" }}
            >
              Search Past Academic Years
            </label>
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={yearSearch}
                onChange={(e) => setYearSearch(e.target.value)}
                placeholder="e.g. 2023/2024 — click to load its dates"
                className="w-full pl-8 pr-3 py-2 text-sm border-2 rounded-xl outline-none"
                style={{ borderColor: "var(--medium-gray)" }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--royal-blue)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--medium-gray)")
                }
              />
            </div>
            {yearSearch && pastYears.length > 0 && (
              <div
                className="mt-1 border rounded-xl overflow-hidden shadow-sm"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                {pastYears.map((y) => {
                  const sc = STATUS_CFG[y.status] || STATUS_CFG.upcoming;
                  return (
                    <button
                      key={y.id}
                      type="button"
                      onClick={() => loadPastYear(y)}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 text-left border-b last:border-0"
                      style={{ borderColor: "var(--medium-gray)" }}
                    >
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {y.year}
                      </span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: sc.bg, color: sc.color }}
                      >
                        {sc.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            {yearSearch && pastYears.length === 0 && (
              <p className="text-xs text-gray-400 mt-1.5">
                No matching academic years found
              </p>
            )}
          </div>

          <div
            className="h-px"
            style={{ backgroundColor: "var(--medium-gray)" }}
          />
          {/* Year + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--dark-gray)" }}
              >
                Academic Year{" "}
                <span style={{ color: "var(--accent-red)" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 2025/2026"
                value={form.year}
                onChange={(e) =>
                  setForm((f) => ({ ...f, year: e.target.value }))
                }
                className="w-full px-3 py-2.5 text-sm border-2 rounded-xl outline-none"
                style={{
                  borderColor: errors.year
                    ? "var(--accent-red)"
                    : "var(--medium-gray)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--royal-blue)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.year
                    ? "var(--accent-red)"
                    : "var(--medium-gray)")
                }
              />
              {errors.year && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--accent-red)" }}
                >
                  {errors.year}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--dark-gray)" }}
              >
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
                className="w-full px-3 py-2.5 text-sm border-2 rounded-xl outline-none bg-white"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>

          {/* Year Group Status */}
          <YearGroupToggle
            inSchool={form.inSchool}
            inHouse={form.inHouse}
            onChange={(inSchool, inHouse) =>
              setForm((f) => ({ ...f, inSchool, inHouse }))
            }
          />

          {/* Semester tabs */}
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--dark-gray)" }}
            >
              Select Semester
            </label>
            <div className="flex gap-2">
              {SEM_DEFS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setAS(s.key)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border-2 transition relative"
                  style={{
                    borderColor:
                      activeSem === s.key ? s.color : "var(--medium-gray)",
                    backgroundColor: activeSem === s.key ? s.color : "white",
                    color: activeSem === s.key ? "white" : "var(--dark-gray)",
                  }}
                >
                  {s.label}
                  {errors[s.key] && (
                    <span
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--accent-red)" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active semester dates */}
          {SEM_DEFS.map(
            (s) =>
              activeSem === s.key && (
                <div
                  key={s.key}
                  className="rounded-xl border-2 overflow-hidden"
                  style={{ borderColor: s.color + "35" }}
                >
                  <div
                    className="px-4 py-2 text-xs font-black uppercase tracking-wider"
                    style={{ backgroundColor: s.color + "15", color: s.color }}
                  >
                    {s.label} Dates
                  </div>
                  {errors[s.key] && (
                    <p
                      className="text-xs px-4 pt-2"
                      style={{ color: "var(--accent-red)" }}
                    >
                      ⚠ {errors[s.key]}
                    </p>
                  )}
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <DateField
                      label="Start Date"
                      value={form[s.key].start}
                      onChange={(v) =>
                        setSem(s.key, { ...form[s.key], start: v })
                      }
                    />
                    <DateField
                      label="End Date"
                      value={form[s.key].end}
                      onChange={(v) =>
                        setSem(s.key, { ...form[s.key], end: v })
                      }
                    />
                  </div>
                </div>
              ),
          )}

          {/* Notes */}
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--dark-gray)" }}
            >
              Notes{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. WASSCE for Form 3 in May/June…"
              value={form.notes || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              className="w-full px-3 py-2 text-sm border-2 rounded-xl outline-none resize-none"
              style={{ borderColor: "var(--medium-gray)" }}
            />
          </div>
        </div>

        <div
          className="flex gap-3 px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <button
            type="button"
            onClick={onClose}
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
              if (validate()) onSave(form);
            }}
            className="flex-1 py-2.5 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            <Save size={14} /> {isEdit ? "Save Changes" : "Add Year"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AcademicYearAndTrack = () => {
  const [years, setYears] = useState(INITIAL_YEARS);
  const [showModal, setModal] = useState(false);
  const [editYear, setEditYear] = useState(null);
  const [expanded, setExpanded] = useState(1);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (form) => {
    if (editYear?.id) {
      let updated = years.map((y) => (y.id === form.id ? form : y));
      if (form.status === "active")
        updated = updated.map((y) =>
          y.id !== form.id ? { ...y, status: "upcoming" } : y,
        );
      setYears(updated);
      showToast(`${form.year} updated`);
    } else {
      const ny = { ...form, id: Date.now() };
      const updated =
        form.status === "active"
          ? [ny, ...years.map((y) => ({ ...y, status: "upcoming" }))]
          : [...years, ny];
      setYears(updated);
      showToast(`${form.year} added`);
    }
    setModal(false);
    setEditYear(null);
  };

  const handleActivate = (id) => {
    setYears((ys) =>
      ys.map((y) => ({
        ...y,
        status:
          y.id === id
            ? "active"
            : y.status === "active"
              ? "upcoming"
              : y.status,
      })),
    );
    showToast(`${years.find((y) => y.id === id)?.year} set as active`);
  };

  const handleDelete = (id) => {
    const yr = years.find((y) => y.id === id);
    if (yr?.status === "active") {
      showToast("Cannot delete the active year", "warning");
      return;
    }
    setYears((ys) => ys.filter((y) => y.id !== id));
    showToast(`${yr?.year} removed`, "warning");
  };

  const handleSaveYear = (yr) => showToast(`${yr.year} saved successfully`);

  const activeYear = years.find((y) => y.status === "active");

  return (
    <div className="space-y-5">
      {toast && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2"
          style={{
            backgroundColor:
              toast.type === "warning"
                ? "var(--warning)"
                : "var(--success-dark)",
          }}
        >
          <CheckCircle2 size={14} /> {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2
            className="font-black text-base"
            style={{ color: "var(--dark-gray)" }}
          >
            Academic Year — Transitional System
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage academic years, semesters and year group in-school / in-house
            status
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditYear(null);
            setModal(true);
          }}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-white flex-shrink-0"
          style={{ backgroundColor: "var(--royal-blue)" }}
        >
          <Plus size={15} /> Add Academic Year
        </button>
      </div>

      {/* Info banner — Transitional System explanation */}
      <div
        className="rounded-xl border p-4 flex items-start gap-3"
        style={{ borderColor: "#bfdbfe", backgroundColor: "#eff6ff" }}
      >
        <BookOpen
          size={16}
          style={{ color: "var(--royal-blue)", flexShrink: 0, marginTop: 2 }}
        />
        <div>
          <p
            className="text-sm font-bold"
            style={{ color: "var(--royal-blue)" }}
          >
            Transitional System
          </p>
          <p
            className="text-xs leading-relaxed mt-0.5"
            style={{ color: "#1e40af" }}
          >
            At any time, <strong>2 year groups are in school</strong> and{" "}
            <strong>1 year group is in the house</strong>. Possible
            combinations: Form 1 &amp; 3, Form 1 &amp; 2, or Form 2 &amp; 3.
            Both <strong>Semester 1</strong> and <strong>Semester 2</strong> are
            always active simultaneously.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: "In School Now",
            value: activeYear ? activeYear.inSchool.length : 0,
            color: "#7c3aed",
            bg: "#f5f3ff",
            icon: Users,
          },
          {
            label: "In House Now",
            value: activeYear ? activeYear.inHouse.length : 0,
            color: "#b45309",
            bg: "#fefce8",
            icon: BookOpen,
          },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div
            key={label}
            className="bg-white rounded-xl border p-3 flex items-center gap-3 shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: bg }}
            >
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p
                className="text-xl font-black"
                style={{ color: "var(--dark-gray)" }}
              >
                {value}
              </p>
              <p className="text-xs text-gray-400 leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active year — year group status overview */}
      {activeYear && (
        <div
          className="bg-white rounded-2xl border shadow-sm p-5"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <p
            className="font-black text-sm mb-3"
            style={{ color: "var(--dark-gray)" }}
          >
            Current Year Group Status — {activeYear.year}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {YEAR_GROUPS.map((yg) => {
              const inSchool = activeYear.inSchool.includes(yg.id);
              return (
                <div
                  key={yg.id}
                  className="rounded-xl border-2 p-3 text-center"
                  style={{
                    borderColor: inSchool ? "var(--success-dark)" : "#fcd34d",
                    backgroundColor: inSchool ? "#f0fdf4" : "#fefce8",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-black"
                    style={{
                      backgroundColor: inSchool
                        ? "var(--success-dark)"
                        : "#b45309",
                    }}
                  >
                    {yg.id === "form1" ? "1" : yg.id === "form2" ? "2" : "3"}
                  </div>
                  <p
                    className="text-xs font-bold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {yg.id === "form1"
                      ? "Form 1"
                      : yg.id === "form2"
                        ? "Form 2"
                        : "Form 3"}
                  </p>
                  <span
                    className="text-xs font-bold mt-1 block"
                    style={{
                      color: inSchool ? "var(--success-dark)" : "#92400e",
                    }}
                  >
                    {inSchool ? "✓ In School" : "⌂ In House"}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Semester status */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            {SEM_DEFS.map((s) => (
              <div
                key={s.key}
                className="rounded-xl border p-3"
                style={{
                  borderColor: "var(--medium-gray)",
                  backgroundColor: "var(--light-gray)",
                }}
              >
                <p
                  className="text-xs font-black mb-1"
                  style={{ color: s.color }}
                >
                  {s.label}
                </p>
                <p className="text-xs" style={{ color: "var(--dark-gray)" }}>
                  {fmt(activeYear[s.key]?.start)} –{" "}
                  {fmt(activeYear[s.key]?.end)}
                </p>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
                  style={{ backgroundColor: s.color + "15", color: s.color }}
                >
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Year cards */}
      <div className="space-y-3">
        {years.length === 0 ? (
          <div
            className="bg-white rounded-2xl border p-10 text-center"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <Calendar size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="font-bold text-sm text-gray-400">
              No academic years yet
            </p>
            <button
              type="button"
              onClick={() => {
                setEditYear(null);
                setModal(true);
              }}
              className="mt-4 flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white mx-auto"
              style={{ backgroundColor: "var(--royal-blue)" }}
            >
              <Plus size={14} /> Add First Year
            </button>
          </div>
        ) : (
          years.map((yr) => {
            const sc = STATUS_CFG[yr.status] || STATUS_CFG.upcoming;
            const isOpen = expanded === yr.id;
            return (
              <div
                key={yr.id}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                {/* Card header */}
                <div
                  className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() =>
                    setExpanded((e) => (e === yr.id ? null : yr.id))
                  }
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: sc.bg }}
                  >
                    <Calendar size={16} style={{ color: sc.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className="font-black text-sm"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {yr.year}
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ backgroundColor: sc.bg, color: sc.color }}
                      >
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                      In School:{" "}
                      {yr.inSchool
                        .map((id) =>
                          id === "form1"
                            ? "Form 1"
                            : id === "form2"
                              ? "Form 2"
                              : "Form 3",
                        )
                        .join(" & ")}
                      {" · "}
                      In House:{" "}
                      {yr.inHouse
                        .map((id) =>
                          id === "form1"
                            ? "Form 1"
                            : id === "form2"
                              ? "Form 2"
                              : "Form 3",
                        )
                        .join(", ")}
                      {yr.notes ? ` · ${yr.notes}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {yr.status !== "active" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivate(yr.id);
                        }}
                        className="text-xs px-2.5 py-1.5 rounded-lg font-bold border transition"
                        style={{
                          borderColor: "var(--success-dark)",
                          color: "var(--success-dark)",
                          backgroundColor: "#f0fdf4",
                        }}
                      >
                        Set Active
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditYear(yr);
                        setModal(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-blue-50"
                      style={{ color: "var(--royal-blue)" }}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(yr.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50"
                      style={{ color: "var(--accent-red)" }}
                    >
                      <Trash2 size={14} />
                    </button>
                    <ChevronDown
                      size={16}
                      className="text-gray-400 ml-1 transition-transform"
                      style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                    />
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div
                    className="border-t px-5 pb-5 pt-4"
                    style={{
                      borderColor: "var(--medium-gray)",
                      backgroundColor: "var(--light-gray)",
                    }}
                  >
                    {/* Year groups */}
                    <p
                      className="text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ color: "var(--dark-gray)", opacity: 0.5 }}
                    >
                      Year Group Status
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {YEAR_GROUPS.map((yg) => {
                        const inSchool = yr.inSchool.includes(yg.id);
                        return (
                          <div
                            key={yg.id}
                            className="bg-white rounded-xl border p-2.5 text-center"
                            style={{
                              borderColor: inSchool
                                ? "var(--success-dark)"
                                : "#fcd34d",
                            }}
                          >
                            <p
                              className="text-xs font-bold"
                              style={{ color: "var(--dark-gray)" }}
                            >
                              {yg.id === "form1"
                                ? "Form 1"
                                : yg.id === "form2"
                                  ? "Form 2"
                                  : "Form 3"}
                            </p>
                            <span
                              className="text-xs font-bold"
                              style={{
                                color: inSchool
                                  ? "var(--success-dark)"
                                  : "#92400e",
                              }}
                            >
                              {inSchool ? "In School" : "In House"}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Semesters */}
                    <p
                      className="text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ color: "var(--dark-gray)", opacity: 0.5 }}
                    >
                      Semester Dates
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {SEM_DEFS.map(({ key, label, color }) => (
                        <div
                          key={key}
                          className="bg-white rounded-xl border overflow-hidden"
                          style={{ borderColor: "var(--medium-gray)" }}
                        >
                          <div
                            className="px-3 py-2 text-xs font-black uppercase tracking-wider"
                            style={{ backgroundColor: color + "15", color }}
                          >
                            {label}
                          </div>
                          <div className="p-3 space-y-1">
                            <p className="text-xs text-gray-500">
                              Start: <strong>{fmt(yr[key]?.start)}</strong>
                            </p>
                            <p className="text-xs text-gray-500">
                              End: <strong>{fmt(yr[key]?.end)}</strong>
                            </p>
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: color + "15", color }}
                            >
                              Active
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Save */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSaveYear(yr)}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-black text-white rounded-xl"
                        style={{ backgroundColor: "var(--success-dark)" }}
                      >
                        <Save size={14} /> Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <YearModal
          yearData={editYear}
          allYears={years}
          onSave={handleSave}
          onClose={() => {
            setModal(false);
            setEditYear(null);
          }}
        />
      )}
    </div>
  );
};

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: "School Profile", desc: "Identity & contacts" },
  { id: 2, title: "Academic Year", desc: "Semesters & year groups" },
  { id: 3, title: "Grading Scale", desc: "A1–F9 configuration" },
  { id: 4, title: "Assessment", desc: "CA breakdown & weights" },
];

const AcademicStructure1 = () => {
  const [step, setStep] = useState(1);
  const [visited, setVisited] = useState(new Set([1]));

  const goTo = (s) => {
    setStep(s);
    setVisited((v) => new Set([...v, s]));
  };
  const next = () => goTo(Math.min(step + 1, STEPS.length));
  const prev = () => goTo(Math.max(step - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return <SchoolProfileSetup />;
      case 2:
        return <AcademicYearAndTrack />;
      case 3:
        return <GradingConfiguration />;
      case 4:
        return <AssessmentConfiguration />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1
          className="text-xl font-black"
          style={{ color: "var(--dark-gray)" }}
        >
          Academic Structure Setup
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Configure school profile, academic calendar, grading and assessment
        </p>
      </div>

      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="flex overflow-x-auto border-b"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          {STEPS.map((s) => {
            const done = visited.has(s.id) && s.id < step;
            const active = step === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(s.id)}
                className="flex items-center gap-2.5 px-4 py-3 border-b-2 transition-colors flex-shrink-0"
                style={{
                  borderColor: active ? "var(--royal-blue)" : "transparent",
                  backgroundColor: active ? "#eef2ff" : "white",
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{
                    backgroundColor: done
                      ? "var(--success-dark)"
                      : active
                        ? "var(--royal-blue)"
                        : "var(--medium-gray)",
                    color: "white",
                  }}
                >
                  {done ? "✓" : s.id}
                </div>
                <div className="text-left hidden sm:block">
                  <p
                    className="text-xs font-bold"
                    style={{
                      color: active ? "var(--royal-blue)" : "var(--dark-gray)",
                    }}
                  >
                    {s.title}
                  </p>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="p-5">{renderStep()}</div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          disabled={step === 1}
          className="px-4 py-2 text-sm font-semibold rounded-xl border transition"
          style={{
            borderColor: "var(--medium-gray)",
            color: "var(--dark-gray)",
            opacity: step === 1 ? 0.4 : 1,
          }}
        >
          ← Previous
        </button>
        <span className="text-xs text-gray-400">
          Step {step} of {STEPS.length}
        </span>
        {step < STEPS.length ? (
          <button
            type="button"
            onClick={next}
            className="px-5 py-2 text-sm font-bold text-white rounded-xl"
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl"
            style={{ backgroundColor: "var(--success-dark)" }}
          >
            <CheckCircle2 size={14} /> Save All
          </button>
        )}
      </div>
    </div>
  );
};

export default AcademicStructure1;
