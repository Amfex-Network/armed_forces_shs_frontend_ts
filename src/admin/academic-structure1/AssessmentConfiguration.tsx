// src/admin/academic-structure1/AssessmentConfiguration.jsx
import React, { useState } from "react";
import { Save, Plus, Trash2, Edit3, X, CheckCircle2 } from "lucide-react";

const DEFAULT = {
  caMax: 30,
  examMax: 70,
  caBreakdown: [
    { id: 1, name: "Class Test 1", weight: 10, type: "test" },
    { id: 2, name: "Class Test 2", weight: 10, type: "test" },
    { id: 3, name: "Project / Assignment", weight: 5, type: "project" },
    { id: 4, name: "Attendance & Participation", weight: 5, type: "other" },
  ],
};

const TYPE_STYLE = {
  test: { bg: "#eef2ff", color: "var(--royal-blue)", label: "Test" },
  project: { bg: "#f5f3ff", color: "#7c3aed", label: "Project" },
  other: { bg: "#f0fdf4", color: "var(--success-dark)", label: "Other" },
};

const ib = { borderColor: "var(--medium-gray)" };

const AssessmentConfiguration = () => {
  const [cfg, setCfg] = useState(DEFAULT);
  const [editId, setEditId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", weight: 5, type: "test" });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  const totalCA = cfg.caBreakdown.reduce((s, c) => s + c.weight, 0);
  const caOk = totalCA === cfg.caMax;

  const addItem = () => {
    if (!newItem.name.trim()) return;
    setCfg((c) => ({
      ...c,
      caBreakdown: [...c.caBreakdown, { ...newItem, id: Date.now() }],
    }));
    setNewItem({ name: "", weight: 5, type: "test" });
    setShowAdd(false);
    showToast("Component added");
  };
  const removeItem = (id) => {
    setCfg((c) => ({
      ...c,
      caBreakdown: c.caBreakdown.filter((x) => x.id !== id),
    }));
    showToast("Component removed", "warning");
  };
  const updateItem = (id, field, val) =>
    setCfg((c) => ({
      ...c,
      caBreakdown: c.caBreakdown.map((x) =>
        x.id === id ? { ...x, [field]: val } : x,
      ),
    }));

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
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="font-black text-base"
            style={{ color: "var(--dark-gray)" }}
          >
            Assessment Configuration
          </h2>
          <p className="text-xs text-gray-400">
            Configure CA components and exam weighting
          </p>
        </div>
        <button
          type="button"
          onClick={() => showToast("Assessment configuration saved")}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white"
          style={{ backgroundColor: "var(--royal-blue)" }}
        >
          <Save size={14} /> Save Config
        </button>
      </div>

      {/* CA vs Exam split */}
      <div
        className="bg-white rounded-2xl border shadow-sm p-5"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <h3
          className="font-black text-sm mb-4"
          style={{ color: "var(--dark-gray)" }}
        >
          CA vs Exam Weighting
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            {
              label: "Continuous Assessment (CA)",
              key: "caMax",
              color: "var(--royal-blue)",
            },
            {
              label: "End of Term Examination",
              key: "examMax",
              color: "var(--accent-red)",
            },
          ].map(({ label, key, color }) => (
            <div key={key}>
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "#6b7280" }}
              >
                {label}
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={cfg[key]}
                onChange={(e) =>
                  setCfg((c) => ({
                    ...c,
                    [key]: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2.5 text-sm border-2 rounded-xl outline-none text-center font-black"
                style={{ borderColor: "var(--medium-gray)", color }}
                onFocus={(e) => (e.target.style.borderColor = color)}
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--medium-gray)")
                }
              />
            </div>
          ))}
        </div>
        <div className="flex h-8 rounded-xl overflow-hidden text-xs font-black">
          <div
            className="flex items-center justify-center text-white transition-all"
            style={{ flex: cfg.caMax, backgroundColor: "var(--royal-blue)" }}
          >
            CA {cfg.caMax}%
          </div>
          <div
            className="flex items-center justify-center text-white transition-all"
            style={{ flex: cfg.examMax, backgroundColor: "var(--accent-red)" }}
          >
            Exam {cfg.examMax}%
          </div>
        </div>
        <p
          className="text-xs text-center mt-2"
          style={{
            color:
              cfg.caMax + cfg.examMax === 100
                ? "var(--success-dark)"
                : "var(--accent-red)",
          }}
        >
          {cfg.caMax + cfg.examMax === 100
            ? "✓ Total = 100%"
            : `⚠ Total = ${cfg.caMax + cfg.examMax}% (must be 100)`}
        </p>
      </div>

      {/* CA Breakdown */}
      <div
        className="bg-white rounded-2xl border shadow-sm p-5"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-black text-sm"
            style={{ color: "var(--dark-gray)" }}
          >
            CA Breakdown
          </h3>
          <span
            className="text-sm font-black px-3 py-0.5 rounded-xl"
            style={{
              backgroundColor: caOk ? "#f0fdf4" : "#fff1f2",
              color: caOk ? "var(--success-dark)" : "var(--accent-red)",
            }}
          >
            {totalCA}/{cfg.caMax} {caOk ? "✓" : "⚠"}
          </span>
        </div>

        <div className="space-y-2 mb-3">
          {cfg.caBreakdown.map((item) => {
            const ts = TYPE_STYLE[item.type] || TYPE_STYLE.other;
            return editId === item.id ? (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 rounded-xl border-2"
                style={{
                  borderColor: "var(--royal-blue)",
                  backgroundColor: "#eef2ff",
                }}
              >
                <input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  className="flex-1 px-2 py-1.5 text-xs rounded-lg border outline-none"
                  style={ib}
                />
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={item.weight}
                  onChange={(e) =>
                    updateItem(item.id, "weight", parseInt(e.target.value) || 0)
                  }
                  className="w-14 px-2 py-1.5 text-xs rounded-lg border outline-none text-center font-bold"
                  style={ib}
                />
                <select
                  value={item.type}
                  onChange={(e) => updateItem(item.id, "type", e.target.value)}
                  className="px-2 py-1.5 text-xs rounded-lg border outline-none bg-white"
                  style={ib}
                >
                  <option value="test">Test</option>
                  <option value="project">Project</option>
                  <option value="other">Other</option>
                </select>
                <button
                  type="button"
                  onClick={() => setEditId(null)}
                  style={{ color: "var(--success-dark)" }}
                >
                  <CheckCircle2 size={14} />
                </button>
              </div>
            ) : (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded font-semibold"
                    style={{ backgroundColor: ts.bg, color: ts.color }}
                  >
                    {ts.label}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="font-bold text-sm"
                    style={{ color: "var(--royal-blue)" }}
                  >
                    {item.weight}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditId(item.id)}
                    style={{ color: "var(--warning)" }}
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    style={{ color: "var(--accent-red)" }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add row */}
          {showAdd ? (
            <div
              className="flex items-center gap-2 p-2 rounded-xl border-2"
              style={{ borderColor: "var(--royal-blue)" }}
            >
              <input
                value={newItem.name}
                onChange={(e) =>
                  setNewItem((n) => ({ ...n, name: e.target.value }))
                }
                placeholder="Component name"
                className="flex-1 px-2 py-1.5 text-xs rounded-lg border outline-none"
                style={ib}
              />
              <input
                type="number"
                min={0}
                max={30}
                value={newItem.weight}
                onChange={(e) =>
                  setNewItem((n) => ({
                    ...n,
                    weight: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-14 px-2 py-1.5 text-xs rounded-lg border outline-none text-center"
                style={ib}
              />
              <select
                value={newItem.type}
                onChange={(e) =>
                  setNewItem((n) => ({ ...n, type: e.target.value }))
                }
                className="px-2 py-1.5 text-xs rounded-lg border outline-none bg-white"
                style={ib}
              >
                <option value="test">Test</option>
                <option value="project">Project</option>
                <option value="other">Other</option>
              </select>
              <button
                type="button"
                onClick={addItem}
                style={{ color: "var(--success-dark)" }}
              >
                <CheckCircle2 size={14} />
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                style={{ color: "var(--accent-red)" }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl border-2 border-dashed"
              style={{
                borderColor: "var(--medium-gray)",
                color: "var(--royal-blue)",
              }}
            >
              <Plus size={13} /> Add Component
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentConfiguration;
