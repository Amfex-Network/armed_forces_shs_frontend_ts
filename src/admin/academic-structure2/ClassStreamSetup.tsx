// src/admin/academic-structure2/ClassStreamSetup.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  CheckCircle2,
  Search,
} from "lucide-react";
import { classesApi } from "../../api/domains";

const YEAR_GROUPS = ["Form 1", "Form 2", "Form 3"];
const COURSES = ["General Science", "General Arts", "Business", "Technical"];
const EMPTY = {
  name: "",
  yearGroup: "Form 1",
  course: "General Science",
  capacity: 40,
  formTeacher: "",
  enrolled: 0,
};

const PC = {
  "General Science": "var(--royal-blue)",
  "General Arts": "#7c3aed",
  Business: "#ca8a04",
  Technical: "var(--success-dark)",
};
const PB = {
  "General Science": "#eef2ff",
  "General Arts": "#f5f3ff",
  Business: "#fefce8",
  Technical: "#f0fdf4",
};

const ClassStreamSetup = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editC, setEditC] = useState(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [filterYr, setFY] = useState("All");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const load = async () => {
    try {
      setLoading(true);
      setClasses(await classesApi.list());
    } catch (err) {
      showToast(err?.message || "Failed to load classes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      classes.filter((c) => {
        const yOk = filterYr === "All" || c.yearGroup === filterYr;
        const sOk =
          !search || c.name.toLowerCase().includes(search.toLowerCase());
        return yOk && sOk;
      }),
    [classes, filterYr, search],
  );

  const handleSave = async () => {
    if (!form.name.trim()) return;
    try {
      if (editC) {
        const saved = await classesApi.update(editC.id, form);
        setClasses((cs) => cs.map((c) => (c.id === saved.id ? saved : c)));
        showToast(`${saved.name} updated`);
      } else {
        const saved = await classesApi.create(form);
        setClasses((cs) => [...cs, saved]);
        showToast(`${saved.name} created`);
      }
      setShowForm(false);
      setEditC(null);
      setForm({ ...EMPTY });
    } catch (err) {
      showToast(err?.message || "Failed to save class", "error");
    }
  };

  const handleDelete = async (cls) => {
    try {
      await classesApi.remove(cls.id);
      setClasses((cs) => cs.filter((c) => c.id !== cls.id));
      showToast(`${cls.name} removed`, "error");
    } catch (err) {
      showToast(err?.message || "Failed to delete class", "error");
    }
  };

  const FInput = ({ label, field, options, type = "text", required }) => (
    <div>
      <label
        className="text-xs font-bold uppercase tracking-wider block mb-1"
        style={{ color: "var(--dark-gray)" }}
      >
        {label}
        {required && <span style={{ color: "var(--accent-red)" }}> *</span>}
      </label>
      {options ? (
        <select
          value={form[field] || ""}
          onChange={(e) => set(field, e.target.value)}
          className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none bg-white"
          style={{ borderColor: "var(--medium-gray)" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--medium-gray)")}
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={form[field] || ""}
          onChange={(e) => set(field, e.target.value)}
          className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none"
          style={{ borderColor: "var(--medium-gray)" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--medium-gray)")}
        />
      )}
    </div>
  );

  const totals = {
    total: classes.length,
    F1: classes.filter((c) => c.yearGroup === "Form 1").length,
    F2: classes.filter((c) => c.yearGroup === "Form 2").length,
    F3: classes.filter((c) => c.yearGroup === "Form 3").length,
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
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="font-black text-base"
            style={{ color: "var(--dark-gray)" }}
          >
            Class Stream Setup
          </h2>
          <p className="text-xs text-gray-400">
            {classes.length} classes · manage form classes and streams
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditC(null);
            setForm({ ...EMPTY });
            setShowForm(true);
          }}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white"
          style={{ backgroundColor: "var(--royal-blue)" }}
        >
          <Plus size={14} /> Add Class
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Classes",
            value: totals.total,
            color: "var(--royal-blue)",
          },
          { label: "Form 1", value: totals.F1, color: "var(--success-dark)" },
          { label: "Form 2", value: totals.F2, color: "#7c3aed" },
          { label: "Form 3", value: totals.F3, color: "var(--accent-red)" },
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

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-40">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search class..."
            className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border-2 outline-none"
            style={{ borderColor: "var(--medium-gray)" }}
          />
        </div>
        {["All", ...YEAR_GROUPS].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFY(f)}
            className="text-xs font-semibold px-3 py-2 rounded-xl"
            style={{
              backgroundColor: filterYr === f ? "var(--royal-blue)" : "white",
              color: filterYr === f ? "white" : "var(--dark-gray)",
              border: "1px solid var(--medium-gray)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cls) => {
          const pct = Math.round((cls.enrolled / cls.capacity) * 100);
          const pc = PC[cls.course] || "var(--royal-blue)";
          const pb = PB[cls.course] || "#eef2ff";
          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border shadow-sm p-4"
              style={{
                borderColor: "var(--medium-gray)",
                borderLeft: `4px solid ${pc}`,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p
                    className="font-black text-sm"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {cls.name}
                  </p>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-semibold"
                      style={{ backgroundColor: pb, color: pc }}
                    >
                      {(cls.course || "").replace("General ", "")}
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-semibold"
                      style={{
                        backgroundColor: "#eef2ff",
                        color: "var(--royal-blue)",
                      }}
                    >
                      {cls.yearGroup || "Form 1"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditC(cls);
                      setForm({ ...cls });
                      setShowForm(true);
                    }}
                    style={{ color: "var(--warning)" }}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cls)}
                    style={{ color: "var(--accent-red)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Enrolment</span>
                <span className="font-bold" style={{ color: pc }}>
                  {cls.enrolled}/{cls.capacity}
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden mb-2"
                style={{ backgroundColor: "var(--medium-gray)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: pc }}
                />
              </div>
              {cls.formTeacher && (
                <p className="text-xs text-gray-400 truncate">
                  <span className="font-semibold">Form Teacher:</span>{" "}
                  {cls.formTeacher}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="font-semibold text-sm">
            {loading
              ? "Loading classes…"
              : classes.length === 0
                ? "No classes yet"
                : "No classes found"}
          </p>
          <p className="text-xs mt-1">
            {classes.length === 0 && !loading
              ? "Click Add Class to create one"
              : "Try adjusting your search or filter"}
          </p>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                background:
                  "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
              }}
            >
              <p className="text-white font-black">
                {editC ? "Edit Class" : "Add New Class"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditC(null);
                }}
                className="text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div
              className="h-1"
              style={{ backgroundColor: "var(--accent-red)" }}
            />
            <div className="p-5 space-y-4">
              <FInput label="Class Name" field="name" required />
              <FInput
                label="Year Group"
                field="yearGroup"
                options={YEAR_GROUPS}
              />
              <FInput label="Course" field="course" options={COURSES} />
              <FInput label="Capacity" field="capacity" type="number" />
              <FInput label="Form Teacher" field="formTeacher" />
            </div>
            <div
              className="flex justify-end gap-2 px-5 py-4 border-t"
              style={{
                borderColor: "var(--medium-gray)",
                backgroundColor: "var(--light-gray)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditC(null);
                }}
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
                <Save size={13} /> {editC ? "Save" : "Add Class"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassStreamSetup;
