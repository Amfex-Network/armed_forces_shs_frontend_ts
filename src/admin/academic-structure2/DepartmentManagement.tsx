// src/admin/academic-structure2/DepartmentManagement.tsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { departmentsApi } from "../../api/domains";
import { usersApi } from "../../api/users";

const EMPTY_DEPARTMENT = {
  name: "",
  code: "",
  color: "var(--royal-blue)",
  bg: "#eef2ff",
  hodId: "",
  subjects: [],
};

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_DEPARTMENT });
  const [subjectInput, setSubjectInput] = useState("");
  const [openDepartmentId, setOpenDepartmentId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    try {
      setLoading(true);
      const [deps, allUsers] = await Promise.all([
        departmentsApi.list(),
        usersApi.list(),
      ]);
      setDepartments(deps);
      setTeachers(allUsers.filter((u) => u.role === "teacher"));
    } catch (err) {
      showToast(err?.message || "Failed to load departments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !form.subjects.includes(trimmed)) {
      updateField("subjects", [...form.subjects, trimmed]);
      setSubjectInput("");
    }
  };

  const removeSubject = (subject) =>
    updateField(
      "subjects",
      form.subjects.filter((item) => item !== subject),
    );

  const handleSave = async () => {
    if (!form.name.trim()) return;
    try {
      if (editingDepartment) {
        const saved = await departmentsApi.update(editingDepartment.id, form);
        setDepartments((prev) =>
          prev.map((department) =>
            department.id === saved.id ? saved : department,
          ),
        );
        showToast(`${saved.name} updated`);
      } else {
        const saved = await departmentsApi.create(form);
        setDepartments((prev) => [...prev, saved]);
        showToast(`${saved.name} created`);
      }
      setShowForm(false);
      setEditingDepartment(null);
      setForm({ ...EMPTY_DEPARTMENT });
    } catch (err) {
      showToast(err?.message || "Failed to save department", "error");
    }
  };

  const handleDelete = async (department) => {
    try {
      await departmentsApi.remove(department.id);
      setDepartments((prev) =>
        prev.filter((item) => item.id !== department.id),
      );
      showToast(`${department.name} removed`, "error");
    } catch (err) {
      showToast(err?.message || "Failed to delete department", "error");
    }
  };

  const getTeacher = (teacherId) =>
    teachers.find(
      (teacher) =>
        teacher.id === teacherId || teacher.id === parseInt(teacherId),
    );
  const getDepartmentTeachers = (departmentName) =>
    teachers.filter((teacher) => teacher.department === departmentName);

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
            Department Management
          </h2>
          <p className="text-xs text-gray-400">
            {departments.length} departments · assign HODs, subjects and staff
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingDepartment(null);
            setForm({ ...EMPTY_DEPARTMENT });
            setShowForm(true);
          }}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white"
          style={{ backgroundColor: "var(--royal-blue)" }}
        >
          <Plus size={14} /> Add Department
        </button>
      </div>

      {/* Quick-pick pills */}
      <div className="flex flex-wrap gap-2">
        {departments.map((department) => (
          <button
            key={department.id}
            type="button"
            onClick={() =>
              setOpenDepartmentId(
                openDepartmentId === department.id ? null : department.id,
              )
            }
            className="px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition"
            style={{
              borderColor:
                openDepartmentId === department.id
                  ? department.color
                  : "var(--medium-gray)",
              backgroundColor:
                openDepartmentId === department.id ? department.bg : "white",
              color:
                openDepartmentId === department.id
                  ? department.color
                  : "var(--dark-gray)",
            }}
          >
            {department.name} ({getDepartmentTeachers(department.name).length})
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Departments",
            value: departments.length,
            color: "var(--royal-blue)",
          },
          { label: "Teaching Staff", value: teachers.length, color: "#7c3aed" },
          {
            label: "Total Subjects",
            value: departments.reduce(
              (total, department) => total + department.subjects.length,
              0,
            ),
            color: "var(--success-dark)",
          },
          {
            label: "Avg Staff/Dept",
            value: Math.round(
              teachers.length / Math.max(departments.length, 1),
            ),
            color: "var(--warning)",
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

      {/* Department cards */}
      <div className="space-y-3">
        {departments.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">
            {loading
              ? "Loading departments…"
              : "No departments yet - click Add Department to create one"}
          </div>
        )}
        {departments.map((department) => {
          const hod = getTeacher(department.hodId);
          const staff = getDepartmentTeachers(department.name);
          const isOpen = openDepartmentId === department.id;
          return (
            <div
              key={department.id}
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{
                borderColor: isOpen ? department.color : "var(--medium-gray)",
                borderWidth: isOpen ? 2 : 1,
              }}
            >
              <div
                onClick={() =>
                  setOpenDepartmentId(isOpen ? null : department.id)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black"
                    style={{ backgroundColor: department.color }}
                  >
                    {department.code}
                  </div>
                  <div>
                    <p
                      className="font-black text-sm"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {department.name} Department
                    </p>
                    <p className="text-xs text-gray-400">
                      {staff.length} staff · {department.subjects.length}{" "}
                      subjects
                      {hod ? ` · HOD: ${hod.title} ${hod.lastName}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingDepartment(department);
                      setForm({
                        ...department,
                        subjects: [...department.subjects],
                      });
                      setShowForm(true);
                    }}
                    style={{ color: "var(--warning)" }}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(department);
                    }}
                    style={{ color: "var(--accent-red)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                  <ChevronDown
                    size={15}
                    className="text-gray-400 transition-transform"
                    style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
                  />
                </div>
              </div>

              {isOpen && (
                <div
                  className="border-t px-4 pb-4 pt-3 space-y-4"
                  style={{
                    borderColor: "var(--medium-gray)",
                    backgroundColor: "var(--light-gray)",
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <p
                        className="text-xs font-black uppercase tracking-widest mb-2"
                        style={{ color: "var(--dark-gray)", opacity: 0.5 }}
                      >
                        Subjects
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {department.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="text-xs px-2 py-1 rounded-lg font-medium"
                            style={{
                              backgroundColor: department.bg,
                              color: department.color,
                              border: `1px solid ${department.color}30`,
                            }}
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-xs font-black uppercase tracking-widest mb-2"
                        style={{ color: "var(--dark-gray)", opacity: 0.5 }}
                      >
                        Staff ({staff.length})
                      </p>
                      <div className="space-y-1.5">
                        {staff.length === 0 ? (
                          <p className="text-xs text-gray-400">
                            No staff assigned to this department
                          </p>
                        ) : (
                          staff.map((teacher) => (
                            <div
                              key={teacher.id}
                              className="flex items-center gap-2 text-xs bg-white rounded-lg p-2 border"
                              style={{ borderColor: "var(--medium-gray)" }}
                            >
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                                style={{ backgroundColor: department.color }}
                              >
                                {teacher.firstName[0]}
                                {teacher.lastName[0]}
                              </div>
                              <span
                                className="font-semibold flex-1 truncate"
                                style={{ color: "var(--dark-gray)" }}
                              >
                                {teacher.title} {teacher.firstName}{" "}
                                {teacher.lastName}
                              </span>
                              <div className="flex gap-1 flex-wrap justify-end">
                                {department.hodId === teacher.id && (
                                  <span
                                    className="text-xs px-1.5 py-0.5 rounded font-bold"
                                    style={{
                                      backgroundColor: department.bg,
                                      color: department.color,
                                    }}
                                  >
                                    HOD
                                  </span>
                                )}
                                {teacher.formClass && (
                                  <span
                                    className="text-xs px-1.5 py-0.5 rounded font-bold"
                                    style={{
                                      backgroundColor: "#f0fdf4",
                                      color: "var(--success-dark)",
                                    }}
                                  >
                                    FT
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">
                                  {teacher.currentPeriods || 0}/
                                  {teacher.maxPeriods || 30} periods
                                </p>
                                <div
                                  className="h-1 rounded-full overflow-hidden mt-0.5"
                                  style={{
                                    width: 60,
                                    backgroundColor: "var(--medium-gray)",
                                  }}
                                >
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${Math.round(((teacher.currentPeriods || 0) / (teacher.maxPeriods || 30)) * 100)}%`,
                                      backgroundColor: department.color,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
              }}
            >
              <p className="text-white font-black">
                {editingDepartment ? "Edit Department" : "Add Department"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingDepartment(null);
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
              {[
                { label: "Department Name *", field: "name" },
                { label: "Code (3 letters)", field: "code" },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label
                    className="text-xs font-bold uppercase tracking-wider block mb-1"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {label}
                  </label>
                  <input
                    value={form[field] || ""}
                    onChange={(e) => updateField(field, e.target.value)}
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
              <div>
                <label
                  className="text-xs font-bold uppercase tracking-wider block mb-1"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Head of Department
                </label>
                <select
                  value={form.hodId || ""}
                  onChange={(e) =>
                    updateField("hodId", parseInt(e.target.value) || "")
                  }
                  className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none bg-white"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  <option value="">-- Select HOD --</option>
                  {teachers
                    .filter((teacher) => teacher.status === "Active")
                    .map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.title} {teacher.firstName} {teacher.lastName}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label
                  className="text-xs font-bold uppercase tracking-wider block mb-1"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Courses
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSubject()}
                    placeholder="Type course name + Enter"
                    className="flex-1 px-3 py-2 text-sm rounded-xl border-2 outline-none"
                    style={{ borderColor: "var(--medium-gray)" }}
                  />
                  <button
                    type="button"
                    onClick={addSubject}
                    className="px-3 py-2 text-sm font-bold text-white rounded-xl"
                    style={{ backgroundColor: "var(--royal-blue)" }}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                      style={{
                        backgroundColor: "#eef2ff",
                        color: "var(--royal-blue)",
                      }}
                    >
                      {subject}
                      <button
                        type="button"
                        onClick={() => removeSubject(subject)}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
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
                  setEditingDepartment(null);
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
                <Save size={13} /> {editingDepartment ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DepartmentManagement;
