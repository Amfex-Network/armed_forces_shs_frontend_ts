// src/admin/academic-structure1/GradingConfiguration.jsx
import React, { useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { GRADE_SCALE } from "../data/adminData";

const DEFAULT_GRADES = GRADE_SCALE.map((g) => ({ ...g }));

const GradingConfiguration = () => {
  const [grades, setGrades] = useState(DEFAULT_GRADES);
  const [editIdx, setEditIdx] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newRow, setNewRow] = useState({
    grade: "",
    min: 0,
    max: 0,
    label: "",
    points: 1,
    color: "#2563eb",
  });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  const update = (i, k, v) =>
    setGrades((gs) => gs.map((g, j) => (j === i ? { ...g, [k]: v } : g)));
  const handleDelete = (i) => {
    setGrades((gs) => gs.filter((_, j) => j !== i));
    showToast("Grade row removed", "error");
  };
  const handleAdd = () => {
    if (!newRow.grade.trim()) return;
    setGrades((gs) => [...gs, { ...newRow }]);
    setNewRow({
      grade: "",
      min: 0,
      max: 0,
      label: "",
      points: 1,
      color: "#2563eb",
    });
    setShowAdd(false);
    showToast(`Grade ${newRow.grade} added`);
  };
  const handleReset = () => {
    setGrades(DEFAULT_GRADES);
    showToast("Reset to WASSCE defaults");
  };

  const PASS_LEVELS = ["distinction", "credit", "pass", "fail"];

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

      <div className="flex items-center justify-between">
        <div>
          <h2
            className="font-black text-base"
            style={{ color: "var(--dark-gray)" }}
          >
            Grading Configuration
          </h2>
          <p className="text-xs text-gray-400">
            WASSCE A1–F9 grade scale editor
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border"
            style={{
              borderColor: "var(--medium-gray)",
              color: "var(--dark-gray)",
            }}
          >
            <RotateCcw size={12} /> Reset
          </button>
          <button
            type="button"
            onClick={() => showToast("Grading scale saved")}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white"
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            <Save size={14} /> Save Scale
          </button>
        </div>
      </div>

      {/* Settings row */}
      {/* Grade scale table */}
      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
          }}
        >
          <h3
            className="font-black text-sm"
            style={{ color: "var(--dark-gray)" }}
          >
            Grade Scale ({grades.length} grades)
          </h3>
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white"
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
                  "Min",
                  "Max",
                  "Description",
                  "Points",
                  "Level",
                  "Color",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-gray-500"
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
              {grades.map((g, i) => {
                const isEdit = editIdx === i;
                const Cell = ({ field, type = "text", options, min, max }) =>
                  isEdit ? (
                    options ? (
                      <select
                        value={g[field]}
                        onChange={(e) => update(i, field, e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded-lg border outline-none bg-white"
                        style={{ borderColor: "var(--medium-gray)" }}
                      >
                        {options.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        min={min}
                        max={max}
                        value={g[field] || ""}
                        onChange={(e) =>
                          update(
                            i,
                            field,
                            type === "number"
                              ? parseInt(e.target.value) || 0
                              : e.target.value,
                          )
                        }
                        className="w-full px-2 py-1 text-xs rounded-lg border outline-none"
                        style={{ borderColor: "var(--medium-gray)" }}
                      />
                    )
                  ) : (
                    <span>{g[field]}</span>
                  );
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: g.color }}
                        />
                        <span className="font-black" style={{ color: g.color }}>
                          {g.grade}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 w-16">
                      <Cell field="min" type="number" min={0} max={100} />
                    </td>
                    <td className="px-3 py-2.5 w-16">
                      <Cell field="max" type="number" min={0} max={100} />
                    </td>
                    <td className="px-3 py-2.5 w-28">
                      <Cell field="label" />
                    </td>
                    <td className="px-3 py-2.5 w-16">
                      <Cell field="points" type="number" min={1} max={9} />
                    </td>
                    <td className="px-3 py-2.5 w-28">
                      <Cell field="passLevel" options={PASS_LEVELS} />
                    </td>
                    <td className="px-3 py-2.5 w-16">
                      {isEdit ? (
                        <input
                          type="color"
                          value={g.color || "#2563eb"}
                          onChange={(e) => update(i, "color", e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border-0"
                        />
                      ) : (
                        <div
                          className="w-6 h-6 rounded-lg"
                          style={{ backgroundColor: g.color }}
                        />
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        {isEdit ? (
                          <button
                            type="button"
                            onClick={() => {
                              setEditIdx(null);
                              showToast(`Grade ${g.grade} saved`);
                            }}
                            style={{ color: "var(--success-dark)" }}
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditIdx(i)}
                            style={{ color: "var(--warning)" }}
                          >
                            <Edit3 size={14} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(i)}
                          style={{ color: "var(--accent-red)" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {showAdd && (
                <tr
                  className="border-t-2"
                  style={{ borderColor: "var(--royal-blue)" }}
                >
                  {[
                    { field: "grade", placeholder: "A1", w: "w-16" },
                    {
                      field: "min",
                      placeholder: "0",
                      w: "w-14",
                      type: "number",
                    },
                    {
                      field: "max",
                      placeholder: "100",
                      w: "w-14",
                      type: "number",
                    },
                    { field: "label", placeholder: "Excellent", w: "w-24" },
                    {
                      field: "points",
                      placeholder: "1",
                      w: "w-12",
                      type: "number",
                    },
                  ].map(({ field, placeholder, w, type = "text" }) => (
                    <td key={field} className="px-3 py-2">
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={newRow[field] || ""}
                        onChange={(e) =>
                          setNewRow((n) => ({
                            ...n,
                            [field]:
                              type === "number"
                                ? parseInt(e.target.value) || 0
                                : e.target.value,
                          }))
                        }
                        className={`${w} px-2 py-1.5 text-xs rounded-lg border-2 outline-none`}
                        style={{ borderColor: "var(--royal-blue)" }}
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <select
                      value={newRow.passLevel || "credit"}
                      onChange={(e) =>
                        setNewRow((n) => ({ ...n, passLevel: e.target.value }))
                      }
                      className="px-2 py-1.5 text-xs rounded-lg border-2 outline-none bg-white"
                      style={{ borderColor: "var(--royal-blue)" }}
                    >
                      {PASS_LEVELS.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="color"
                      value={newRow.color || "#2563eb"}
                      onChange={(e) =>
                        setNewRow((n) => ({ ...n, color: e.target.value }))
                      }
                      className="w-8 h-8 rounded cursor-pointer border-0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={handleAdd}
                        style={{ color: "var(--success-dark)" }}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAdd(false)}
                        style={{ color: "var(--accent-red)" }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Grade colour preview */}
        <div
          className="px-5 py-3 border-t"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <p className="text-xs text-gray-400 mb-2">Grade colour preview</p>
          <div className="flex flex-wrap gap-1.5">
            {grades.map((g) => (
              <span
                key={g.grade}
                className="text-xs px-2 py-1 rounded-lg font-black"
                style={{ backgroundColor: g.color + "22", color: g.color }}
              >
                {g.grade}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default GradingConfiguration;
