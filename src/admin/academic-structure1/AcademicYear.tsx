// src/admin/academic-structure1/AcademicYear.jsx
import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  X,
  Edit3,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { ACADEMIC_YEARS } from "../data/adminData";

const buildYears = () =>
  ACADEMIC_YEARS.map((y) => ({
    ...y,
    activeTerm: y.status === "active" ? "Term 2" : null,
  }));

const EMPTY_YEAR = {
  id: null,
  year: "",
  status: "draft",
  term1: { start: "", end: "", trackAStart: "", trackBStart: "" },
  term2: { start: "", end: "", trackAStart: "", trackBStart: "" },
  term3: { start: "", end: "", trackAStart: "", trackBStart: "" },
  notes: "",
  activeTerm: null,
};

const STATUS_STYLE = {
  active: { bg: "#f0fdf4", color: "var(--success-dark)", label: "Active" },
  archived: { bg: "var(--light-gray)", color: "#6b7280", label: "Archived" },
  draft: { bg: "#fffbeb", color: "var(--warning)", label: "Draft" },
};

const DateInput = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs text-gray-400 block mb-0.5">{label}</label>
    <input
      type="date"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-xs rounded-xl border-2 outline-none"
      style={{ borderColor: "var(--medium-gray)", color: "var(--dark-gray)" }}
      onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--medium-gray)")}
    />
  </div>
);

const AcademicYear = () => {
  const [years, setYears] = useState(buildYears());
  const [showForm, setShowForm] = useState(false);
  const [editYear, setEditY] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_YEAR });
  const [expanded, setExpanded] = useState(
    new Set([ACADEMIC_YEARS.find((y) => y.status === "active")?.id]),
  );
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setFT = (term, k, v) =>
    setForm((f) => ({ ...f, [term]: { ...f[term], [k]: v } }));
  const toggleExpand = (id) =>
    setExpanded((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const openAdd = () => {
    setEditY(null);
    setForm({ ...EMPTY_YEAR, id: Date.now() });
    setShowForm(true);
  };
  const openEdit = (yr) => {
    setEditY(yr);
    setForm({ ...yr });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.year.trim()) return;
    if (editYear) {
      setYears((ys) => ys.map((y) => (y.id === editYear.id ? { ...form } : y)));
      showToast(`${form.year} updated`);
    } else {
      setYears((ys) => [{ ...form }, ...ys]);
      showToast(`${form.year} created`);
    }
    setShowForm(false);
  };

  const handleDelete = (yr) => {
    setYears((ys) => ys.filter((y) => y.id !== yr.id));
    showToast(`${yr.year} removed`, "error");
  };

  const handleActivateTerm = (yrId, term) => {
    setYears((ys) =>
      ys.map((y) => (y.id === yrId ? { ...y, activeTerm: term } : y)),
    );
    showToast(`${term} activated`);
  };

  const handleSetActive = (yr) => {
    setYears((ys) =>
      ys.map((y) => ({ ...y, status: y.id === yr.id ? "active" : "archived" })),
    );
    showToast(`${yr.year} set as active`);
  };

  return (
    <div className="space-y-4">
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

      <div className="flex items-center justify-between">
        <div>
          <h2
            className="font-black text-base"
            style={{ color: "var(--dark-gray)" }}
          >
            Academic Year & Term Management
          </h2>
          <p className="text-xs text-gray-400">
            {years.length} academic years · click any to expand
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white"
          style={{ backgroundColor: "var(--royal-blue)" }}
        >
          <Plus size={14} /> New Year
        </button>
      </div>

      {/* Year cards */}
      {years.map((yr) => {
        const ss = STATUS_STYLE[yr.status] || STATUS_STYLE.draft;
        const isX = expanded.has(yr.id);
        return (
          <div
            key={yr.id}
            className="bg-white rounded-2xl border shadow-sm overflow-hidden"
            style={{
              borderColor:
                yr.status === "active"
                  ? "var(--success-dark)"
                  : "var(--medium-gray)",
              borderWidth: yr.status === "active" ? 2 : 1,
            }}
          >
            <button
              type="button"
              onClick={() => toggleExpand(yr.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs"
                  style={{ backgroundColor: "var(--royal-blue)" }}
                >
                  <Calendar size={16} />
                </div>
                <div>
                  <p
                    className="font-black text-base"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {yr.year}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: ss.bg, color: ss.color }}
                    >
                      {ss.label}
                    </span>
                    {yr.activeTerm && (
                      <span className="text-xs text-gray-400">
                        Current: {yr.activeTerm}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(yr);
                  }}
                  style={{ color: "var(--warning)" }}
                >
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(yr);
                  }}
                  style={{ color: "var(--accent-red)" }}
                >
                  <Trash2 size={15} />
                </button>
                <ChevronDown
                  size={16}
                  className="text-gray-400 transition-transform"
                  style={{ transform: isX ? "rotate(180deg)" : undefined }}
                />
              </div>
            </button>

            {isX && (
              <div
                className="border-t px-5 pb-5 pt-4 space-y-4"
                style={{
                  borderColor: "var(--medium-gray)",
                  backgroundColor: "var(--light-gray)",
                }}
              >
                {/* Set active btn */}
                {yr.status !== "active" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSetActive(yr)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg text-white"
                      style={{ backgroundColor: "var(--success-dark)" }}
                    >
                      ✓ Set as Active Year
                    </button>
                  </div>
                )}

                {/* Terms grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((n) => {
                    const td = yr[`term${n}`] || {};
                    const isCurrent = yr.activeTerm === `Term ${n}`;
                    return (
                      <div
                        key={n}
                        className="bg-white rounded-xl border p-4"
                        style={{
                          borderColor: isCurrent
                            ? "var(--royal-blue)"
                            : "var(--medium-gray)",
                          borderWidth: isCurrent ? 2 : 1,
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p
                            className="font-bold text-sm"
                            style={{
                              color: isCurrent
                                ? "var(--royal-blue)"
                                : "var(--dark-gray)",
                            }}
                          >
                            Term {n}
                          </p>
                          <div className="flex items-center gap-1.5">
                            {isCurrent && (
                              <span
                                className="text-xs px-1.5 py-0.5 rounded font-bold text-white"
                                style={{ backgroundColor: "var(--royal-blue)" }}
                              >
                                Active
                              </span>
                            )}
                            {yr.status === "active" && !isCurrent && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleActivateTerm(yr.id, `Term ${n}`)
                                }
                                className="text-xs px-2 py-0.5 rounded font-semibold"
                                style={{
                                  backgroundColor: "#f0fdf4",
                                  color: "var(--success-dark)",
                                  border: "1px solid var(--success-dark)",
                                }}
                              >
                                Activate
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 text-xs text-gray-500">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="font-semibold">Start</p>
                              <p>{td.start || "—"}</p>
                            </div>
                            <div>
                              <p className="font-semibold">End</p>
                              <p>{td.end || "—"}</p>
                            </div>
                          </div>
                          <div
                            className="grid grid-cols-2 gap-2 pt-1 border-t"
                            style={{ borderColor: "var(--medium-gray)" }}
                          >
                            <div>
                              <p className="font-semibold text-amber-600">
                                Track A
                              </p>
                              <p>{td.trackAStart || "—"}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-green-600">
                                Track B
                              </p>
                              <p>{td.trackBStart || "—"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {yr.notes && (
                  <p className="text-xs text-gray-500 italic">{yr.notes}</p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
              }}
            >
              <p className="text-white font-black">
                {editYear ? "Edit Academic Year" : "Add Academic Year"}
              </p>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div
              className="h-1 flex-shrink-0"
              style={{ backgroundColor: "var(--accent-red)" }}
            />
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label
                    className="text-xs font-bold uppercase tracking-wider block mb-1"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    Academic Year *
                  </label>
                  <input
                    value={form.year}
                    onChange={(e) => setF("year", e.target.value)}
                    placeholder="e.g. 2025/2026"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none"
                    style={{ borderColor: "var(--medium-gray)" }}
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
                    className="text-xs font-bold uppercase tracking-wider block mb-1"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setF("status", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none bg-white"
                    style={{ borderColor: "var(--medium-gray)" }}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="border rounded-xl p-4"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  <p
                    className="text-sm font-black mb-3"
                    style={{ color: "var(--royal-blue)" }}
                  >
                    Term {n}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <DateInput
                      label="Term Start"
                      value={form[`term${n}`]?.start}
                      onChange={(v) => setFT(`term${n}`, "start", v)}
                    />
                    <DateInput
                      label="Term End"
                      value={form[`term${n}`]?.end}
                      onChange={(v) => setFT(`term${n}`, "end", v)}
                    />
                    <DateInput
                      label="Track A Start"
                      value={form[`term${n}`]?.trackAStart}
                      onChange={(v) => setFT(`term${n}`, "trackAStart", v)}
                    />
                    <DateInput
                      label="Track B Start"
                      value={form[`term${n}`]?.trackBStart}
                      onChange={(v) => setFT(`term${n}`, "trackBStart", v)}
                    />
                  </div>
                </div>
              ))}

              <div>
                <label
                  className="text-xs font-bold uppercase tracking-wider block mb-1"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Notes
                </label>
                <textarea
                  value={form.notes || ""}
                  onChange={(e) => setF("notes", e.target.value)}
                  rows={2}
                  placeholder="Optional notes..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none resize-none"
                  style={{ borderColor: "var(--medium-gray)" }}
                />
              </div>
            </div>
            <div
              className="flex justify-end gap-2 px-5 py-4 border-t flex-shrink-0"
              style={{
                borderColor: "var(--medium-gray)",
                backgroundColor: "var(--light-gray)",
              }}
            >
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm rounded-xl border font-semibold"
                style={{
                  borderColor: "var(--medium-gray)",
                  color: "var(--dark-gray)",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl"
                style={{ backgroundColor: "var(--royal-blue)" }}
              >
                <Save size={13} /> {editYear ? "Save Changes" : "Create Year"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AcademicYear;
