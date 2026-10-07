// src/admin/academic-structure2/SubjectManagement.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  CheckCircle2,
  Search,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { subjectsApi, departmentsApi } from "../../api/domains";
import {
  coursesFromDepartments,
  DEFAULT_COURSES,
} from "../../hooks/useSchoolLists";
import { useConfirm } from "../../components/common/ConfirmDialog";

const EMPTY_SUBJECT = {
  name: "",
  code: "",
  type: "elective",
  department: "",
  courses: [],
  active: true,
};
const TYPE_STYLE = {
  core: { bg: "#eef2ff", color: "var(--royal-blue)", label: "Core" },
  elective: { bg: "#f5f3ff", color: "#7c3aed", label: "Elective" },
};

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="relative inline-flex h-5 w-9 rounded-full flex-shrink-0 transition-colors"
    style={{ backgroundColor: checked ? "var(--success-dark)" : "#d1d5db" }}
  >
    <span
      className="inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform"
      style={{ transform: checked ? "translateX(20px)" : "translateX(2px)" }}
    />
  </button>
);

const SubjectManagement = () => {
  const confirm = useConfirm();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [departmentNames, setDepartmentNames] = useState<string[]>([]);
  const [COURSES, setCourses] = useState<string[]>(DEFAULT_COURSES);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_SUBJECT });
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [formError, setFormError] = useState("");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    try {
      setLoading(true);
      const [subs, deps] = await Promise.all([
        subjectsApi.list(),
        departmentsApi.list(),
      ]);
      setSubjects(subs);
      setDepartmentNames(deps.map((d) => d.name));
      setCourses(coursesFromDepartments(deps));
    } catch (err) {
      showToast(err?.message || "Failed to load subjects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const toggleCourse = (course) =>
    updateField(
      "courses",
      form.courses.includes(course)
        ? form.courses.filter((item) => item !== course)
        : [...form.courses, course],
    );

  const filtered = useMemo(
    () =>
      subjects.filter((subject) => {
        const query = search.toLowerCase();
        const matchesQuery =
          !query ||
          subject.name.toLowerCase().includes(query) ||
          subject.code.toLowerCase().includes(query);
        const matchesType = filterType === "all" || subject.type === filterType;
        const matchesDepartment =
          filterDepartment === "all" || subject.department === filterDepartment;
        return matchesQuery && matchesType && matchesDepartment;
      }),
    [subjects, search, filterType, filterDepartment],
  );

  const handleSave = async () => {
    if (!form.name.trim() || !form.code.trim()) {
      setFormError("Subject name and code are required.");
      return;
    }
    if (!form.department) {
      setFormError("Choose the department this subject belongs to.");
      return;
    }
    if (form.type === "elective" && form.courses.length === 0) {
      setFormError("Select at least one course that offers this elective.");
      return;
    }
    // Core subjects are taken by every course.
    const payload = {
      ...form,
      type: form.type as "core" | "elective",
      name: form.name.trim(),
      code: form.code.trim(),
      courses: form.type === "core" ? [...COURSES] : form.courses,
    };
    setFormError("");
    try {
      if (editingSubject) {
        const saved = await subjectsApi.update(editingSubject.id, payload);
        setSubjects((prev) =>
          prev.map((subject) => (subject.id === saved.id ? saved : subject)),
        );
        showToast(`${saved.name} updated`);
      } else {
        const saved = await subjectsApi.create(payload);
        setSubjects((prev) => [...prev, saved]);
        showToast(`${saved.name} added`);
      }
      setShowForm(false);
      setEditingSubject(null);
      setForm({ ...EMPTY_SUBJECT });
    } catch (err) {
      setFormError(err?.message || "Failed to save subject");
    }
  };

  const handleToggleActive = async (subject, value) => {
    setSubjects((prev) =>
      prev.map((item) =>
        item.id === subject.id ? { ...item, active: value } : item,
      ),
    );
    try {
      await subjectsApi.update(subject.id, { active: value });
      showToast(`${subject.name} ${value ? "activated" : "deactivated"}`);
    } catch (err) {
      setSubjects((prev) =>
        prev.map((item) =>
          item.id === subject.id ? { ...item, active: !value } : item,
        ),
      );
      showToast(err?.message || "Failed to update subject", "error");
    }
  };

  const openEdit = (subject) => {
    setEditingSubject(subject);
    setForm({ ...subject, courses: [...(subject.courses || [])] });
    setFormError("");
    setShowForm(true);
  };

  const handleDelete = async (subject) => {
    const ok = await confirm({
      title: "Delete subject?",
      message: (
        <strong>
          {subject.name} ({subject.code})
        </strong>
      ),
      detail:
        "Scores already entered for this subject are kept, but teachers can no longer enter new ones.",
    });
    if (!ok) return;
    try {
      await subjectsApi.remove(subject.id);
      setSubjects((prev) => prev.filter((item) => item.id !== subject.id));
      showToast(`${subject.name} removed`, "error");
    } catch (err) {
      showToast(err?.message || "Failed to delete subject", "error");
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
          <CheckCircle2 size={14} /> {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2
            className="font-black text-base"
            style={{ color: "var(--dark-gray)" }}
          >
            Subject Management
          </h2>
          <p className="text-xs text-gray-400">
            {subjects.length} subjects ·{" "}
            {subjects.filter((subject) => subject.type === "core").length} core
            · {subjects.filter((subject) => subject.type === "elective").length}{" "}
            elective
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingSubject(null);
            setForm({ ...EMPTY_SUBJECT });
            setFormError("");
            setShowForm(true);
          }}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white"
          style={{ backgroundColor: "var(--royal-blue)" }}
        >
          <Plus size={14} /> Add Subject
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: subjects.length,
            color: "var(--royal-blue)",
          },
          {
            label: "Core",
            value: subjects.filter((subject) => subject.type === "core").length,
            color: "var(--success-dark)",
          },
          {
            label: "Elective",
            value: subjects.filter((subject) => subject.type === "elective")
              .length,
            color: "#7c3aed",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border p-3 text-center shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <p className="text-2xl font-black" style={{ color }}>
              {value}
            </p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-xl border p-3 shadow-sm"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-40">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or code…"
              className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border-2 outline-none"
              style={{ borderColor: "var(--medium-gray)" }}
            />
          </div>
          {["all", "core", "elective"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className="text-xs font-semibold px-3 py-2 rounded-xl capitalize"
              style={{
                backgroundColor:
                  filterType === type ? "var(--royal-blue)" : "white",
                color: filterType === type ? "white" : "var(--dark-gray)",
                border: "1px solid var(--medium-gray)",
              }}
            >
              {type === "all" ? "All Types" : type}
            </button>
          ))}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border-2 outline-none bg-white"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <option value="all">All Departments</option>
            {departmentNames.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Showing {filtered.length} of {subjects.length}
        </p>
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-12 text-sm text-gray-400">
          {loading
            ? "Loading subjects…"
            : "No subjects yet - click Add Subject to create one"}
        </div>
      )}

      {/* CORE SUBJECTS - always shown, all courses */}
      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "#eef2ff",
          }}
        >
          <div>
            <p
              className="text-sm font-black"
              style={{ color: "var(--royal-blue)" }}
            >
              Core Subjects
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
              Compulsory for all courses -{" "}
              {subjects.filter((subject) => subject.type === "core").length}{" "}
              subjects
            </p>
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "var(--royal-blue)", color: "white" }}
          >
            All Courses
          </span>
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
                {["Subject", "Code", "Department", "Status", ""].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-gray-500"
                    >
                      {header}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {filtered.filter((subject) => subject.type === "core").length ===
                0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No core subjects match your filter
                  </td>
                </tr>
              )}
              {filtered
                .filter((subject) => subject.type === "core")
                .map((subject) => (
                  <tr
                    key={subject.id}
                    className="hover:bg-blue-50"
                    style={{ opacity: subject.active ? 1 : 0.5 }}
                  >
                    <td
                      className="px-4 py-3 font-semibold text-sm"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {subject.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {subject.code}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {subject.department}
                    </td>
                    <td className="px-4 py-3">
                      <Toggle
                        checked={subject.active}
                        onChange={(value) => handleToggleActive(subject, value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(subject)}
                          style={{ color: "var(--warning)" }}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(subject)}
                          style={{ color: "var(--accent-red)" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ELECTIVE SUBJECTS */}
      <div className="flex items-center gap-3 pt-2">
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: "var(--medium-gray)" }}
        />
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#9ca3af" }}
        >
          Elective Subjects by Course
        </p>
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: "var(--medium-gray)" }}
        />
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "#f5f3ff",
          }}
        >
          <div>
            <p className="text-sm font-black" style={{ color: "#7c3aed" }}>
              Elective Subjects
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
              Course-specific subjects ·{" "}
              {subjects.filter((subject) => subject.type === "elective").length}{" "}
              subjects
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead
              className="border-b"
              style={{
                backgroundColor: "var(--light-gray)",
                borderColor: "var(--medium-gray)",
              }}
            >
              <tr>
                {["Subject", "Code", "Department", "Courses", "Status", ""].map(
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
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              {filtered.filter((subject) => subject.type === "elective")
                .length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    No elective subjects match your filter
                  </td>
                </tr>
              ) : (
                filtered
                  .filter((subject) => subject.type === "elective")
                  .map((subject) => (
                    <tr
                      key={subject.id}
                      className="hover:bg-gray-50"
                      style={{ opacity: subject.active ? 1 : 0.5 }}
                    >
                      <td
                        className="px-4 py-3 font-semibold text-sm"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {subject.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {subject.code}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {subject.department}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(subject.courses || []).slice(0, 2).map((course) => (
                            <span
                              key={course}
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: "var(--light-gray)",
                                color: "var(--dark-gray)",
                              }}
                            >
                              {course.replace("General ", "")}
                            </span>
                          ))}
                          {(subject.courses || []).length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{subject.courses.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Toggle
                          checked={subject.active}
                          onChange={(value) =>
                            handleToggleActive(subject, value)
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(subject)}
                            style={{ color: "var(--warning)" }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(subject)}
                            style={{ color: "var(--accent-red)" }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
              }}
            >
              <p className="text-white font-black">
                {editingSubject ? "Edit Subject" : "Add Subject"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSubject(null);
                }}
                className="text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div
              className="h-1 flex-shrink-0"
              style={{ backgroundColor: "var(--accent-red)" }}
            />
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {formError && (
                <div
                  className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: "#fff1f2",
                    color: "var(--accent-red)",
                  }}
                >
                  <AlertCircle size={13} /> {formError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Subject Name *", field: "name", cls: "col-span-2" },
                  { label: "Code *", field: "code" },
                ].map(({ label, field, cls }) => (
                  <div key={field} className={cls || ""}>
                    <label
                      className="text-xs font-bold uppercase tracking-wider block mb-1"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {label}
                    </label>
                    <input
                      value={form[field] || ""}
                      onChange={(e) =>
                        updateField(
                          field,
                          field === "code"
                            ? e.target.value.toUpperCase()
                            : e.target.value,
                        )
                      }
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
                ))}
                {[
                  {
                    label: "Type",
                    field: "type",
                    options: ["core", "elective"],
                  },
                  {
                    label: "Department",
                    field: "department",
                    options: departmentNames,
                  },
                ].map(({ label, field, options }) => (
                  <div key={field}>
                    <label
                      className="text-xs font-bold uppercase tracking-wider block mb-1"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {label}
                    </label>
                    <select
                      value={form[field] || ""}
                      onChange={(e) => updateField(field, e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none bg-white"
                      style={{ borderColor: "var(--medium-gray)" }}
                    >
                      {field === "department" && (
                        <option value="">
                          {options.length
                            ? "-- Select department --"
                            : "No departments yet"}
                        </option>
                      )}
                      {(field === "department" &&
                      form.department &&
                      !options.includes(form.department)
                        ? [form.department, ...options]
                        : options
                      ).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <label
                  className="text-xs font-bold uppercase tracking-wider block mb-2"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Courses
                </label>
                {form.type === "core" ? (
                  <p className="text-xs text-gray-500">
                    Core subjects are taken by all courses ({COURSES.join(", ")}
                    ).
                  </p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {COURSES.map((course) => {
                        const on = form.courses.includes(course);
                        return (
                          <button
                            key={course}
                            type="button"
                            onClick={() => toggleCourse(course)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                            style={{
                              backgroundColor: on
                                ? "var(--royal-blue)"
                                : "white",
                              color: on ? "white" : "var(--dark-gray)",
                              border: "1px solid var(--medium-gray)",
                            }}
                          >
                            {on ? "✓ " : ""}
                            {course.replace("General ", "")}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Tap each course that offers this elective.
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-semibold"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Active
                </label>
                <Toggle
                  checked={form.active}
                  onChange={(value) => updateField("active", value)}
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
                onClick={() => {
                  setShowForm(false);
                  setEditingSubject(null);
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
                <Save size={13} /> {editingSubject ? "Save" : "Add Subject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SubjectManagement;
