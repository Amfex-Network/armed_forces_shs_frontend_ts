// src/admin/students/Students.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  X,
  Save,
  Users,
  GraduationCap,
  Filter,
  Download,
  Upload,
  LayoutGrid,
  LayoutList,
  CheckCircle2,
  AlertCircle,
  ArrowUpCircle,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  User,
  Calendar,
  TrendingUp,
  ChevronDown,
  FileText,
  Printer,
} from "lucide-react";

import { KeyRound } from "lucide-react";
import * as XLSX from "xlsx";
import { studentsApi, type BulkImportResult } from "../../api/students";
import { parseStudentFile } from "../../utils/studentImport";
import { usersApi, type ManagedUser } from "../../api/users";
import CredentialModal from "../../components/common/CredentialModal";
import { classesApi } from "../../api/domains";
import { useSchoolLists, withCurrent } from "../../hooks/useSchoolLists";
import { downloadCsv } from "../../utils/csv";
import { downloadCredentialSheet, inBatches } from "../../utils/peopleSheets";

const YEAR_GROUPS = ["Form 1", "Form 2", "Form 3"];
const HOUSES = ["Warrior", "Eagle", "Phoenix", "Valor"];
const STATUSES = ["Active", "Inactive", "Suspended"];

// Year group may live in yearGroup, in year (older records) or only in the
// form class name ("Form 2 Science A").
const levelOf = (s) => {
  const pick = (v) => {
    const m = /form\s*([1-3])/i.exec(String(v || ""));
    return m ? `Form ${m[1]}` : "";
  };
  return pick(s.yearGroup) || pick(s.year) || pick(s.formClass);
};

const EMPTY = {
  studentId: "",
  firstName: "",
  lastName: "",
  gender: "Male",
  dob: "",
  course: "",
  year: "Form 1",
  formClass: "",
  yearGroup: "Form 1",
  house: "Warrior",
  status: "Active",
  attendance: 0,
  avgScore: 0,
  parentId: null,
  address: "",
  email: "",
  enrollDate: "",
};

const getParentInfo = (parentId, parents = []) => {
  const p = parents.find((x) => x.id === parentId);
  if (!p) return { parentName: "-", parentPhone: "-" };
  return {
    parentName:
      `${p.title ? p.title + " " : ""}${p.firstName} ${p.lastName}`.trim(),
    parentPhone: p.phone || "-",
  };
};

// Helpers
const attColor = (a) =>
  a >= 95
    ? "var(--success-dark)"
    : a >= 85
      ? "var(--warning)"
      : "var(--accent-red)";
const statusStyle = (s) =>
  ({
    Active: { bg: "#f0fdf4", color: "var(--success-dark)" },
    Inactive: { bg: "#fff1f2", color: "var(--accent-red)" },
    Suspended: { bg: "#fffbeb", color: "var(--warning)" },
  })[s] || { bg: "#f3f4f6", color: "#6b7280" };

const Avatar = ({ name, size = "md" }) => {
  const ini = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const clrs = [
    "#2563eb",
    "#7c3aed",
    "#16a34a",
    "#dc2626",
    "#ca8a04",
    "#0369a1",
  ];
  const bg = clrs[(name || "").charCodeAt(0) % clrs.length] || "#2563eb";
  const sz =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "lg"
        ? "w-16 h-16 text-2xl"
        : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center text-white font-black flex-shrink-0`}
      style={{ backgroundColor: bg }}
    >
      {ini}
    </div>
  );
};

// Input field
const FInput = ({
  label,
  value,
  onChange,
  type = "text",
  options,
  required,
  error,
}) => (
  <div className="flex flex-col gap-1">
    <label
      className="text-xs font-bold uppercase tracking-wider"
      style={{ color: "var(--dark-gray)" }}
    >
      {label}
      {required && <span style={{ color: "var(--accent-red)" }}> *</span>}
    </label>
    {options ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 text-sm rounded-lg border-2 outline-none bg-white"
        style={{
          borderColor: error ? "var(--accent-red)" : "var(--medium-gray)",
          color: "var(--dark-gray)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
        onBlur={(e) =>
          (e.target.style.borderColor = error
            ? "var(--accent-red)"
            : "var(--medium-gray)")
        }
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 text-sm rounded-lg border-2 outline-none"
        style={{
          borderColor: error ? "var(--accent-red)" : "var(--medium-gray)",
          color: "var(--dark-gray)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
        onBlur={(e) =>
          (e.target.style.borderColor = error
            ? "var(--accent-red)"
            : "var(--medium-gray)")
        }
      />
    )}
    {error && (
      <span className="text-xs" style={{ color: "var(--accent-red)" }}>
        {error}
      </span>
    )}
  </div>
);

// Add / Edit Student Modal
const StudentFormModal = ({
  student,
  onSave,
  onClose,
  parents = [],
  classNames = [],
  courses = [],
}) => {
  const isEdit = !!student?.id;
  const [form, setForm] = useState(student || EMPTY);
  const classOptions = [
    "",
    ...(form.formClass && !classNames.includes(form.formClass)
      ? [form.formClass]
      : []),
    ...classNames,
  ];
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.studentId.trim()) e.studentId = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.dob) e.dob = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
            borderRadius: "1rem 1rem 0 0",
          }}
        >
          <div className="flex items-center gap-3 text-white">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              {isEdit ? <Edit3 size={16} /> : <Plus size={16} />}
            </div>
            <div>
              <p className="font-black">
                {isEdit ? "Edit Student" : "Register New Student"}
              </p>
              <p className="text-blue-200 text-xs">
                {isEdit ? form.studentId : "Complete all required fields"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-200">
            <X size={20} />
          </button>
        </div>
        <div
          className="h-1 flex-shrink-0"
          style={{ backgroundColor: "var(--accent-red)" }}
        />

        {/* Form body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Personal */}
          <div>
            <p
              className="text-xs font-black uppercase tracking-widest mb-3 px-1"
              style={{ color: "var(--royal-blue)", opacity: 0.7 }}
            >
              Personal Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FInput
                label="First Name"
                value={form.firstName}
                onChange={(v) => set("firstName", v)}
                required
                error={errors.firstName}
              />
              <FInput
                label="Last Name"
                value={form.lastName}
                onChange={(v) => set("lastName", v)}
                required
                error={errors.lastName}
              />
              <FInput
                label="Student ID"
                value={form.studentId}
                onChange={(v) => set("studentId", v)}
                required
                error={errors.studentId}
              />
              <FInput
                label="Email"
                value={form.email}
                onChange={(v) => set("email", v)}
                required
                error={errors.email}
                type="email"
              />
              <FInput
                label="Gender"
                value={form.gender}
                onChange={(v) => set("gender", v)}
                options={["Male", "Female"]}
              />
              <FInput
                label="Date of Birth"
                value={form.dob}
                onChange={(v) => set("dob", v)}
                required
                error={errors.dob}
                type="date"
              />
              <FInput
                label="Address"
                value={form.address}
                onChange={(v) => set("address", v)}
              />
              <FInput
                label="Enrol Date"
                value={form.enrollDate}
                onChange={(v) => set("enrollDate", v)}
                type="date"
              />
            </div>
          </div>

          {/* Academic */}
          <div>
            <p
              className="text-xs font-black uppercase tracking-widest mb-3 px-1"
              style={{ color: "var(--royal-blue)", opacity: 0.7 }}
            >
              Academic Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FInput
                label="Course"
                value={form.course || ""}
                onChange={(v) => set("course", v)}
                options={["", ...withCurrent(courses, form.course)]}
              />
              <FInput
                label="Year Group"
                value={form.yearGroup}
                onChange={(v) => set("yearGroup", v)}
                options={YEAR_GROUPS}
              />
              <FInput
                label="Form Class"
                value={form.formClass || ""}
                onChange={(v) => set("formClass", v)}
                options={classOptions}
              />
              <FInput
                label="House"
                value={form.house}
                onChange={(v) => set("house", v)}
                options={HOUSES}
              />
              <FInput
                label="Status"
                value={form.status}
                onChange={(v) => set("status", v)}
                options={STATUSES}
              />
            </div>
          </div>

          {/* Parent */}
          <div>
            <p
              className="text-xs font-black uppercase tracking-widest mb-3 px-1"
              style={{ color: "var(--royal-blue)", opacity: 0.7 }}
            >
              Parent / Guardian
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Linked Parent
                </label>
                <select
                  value={form.parentId || ""}
                  onChange={(e) => set("parentId", e.target.value || null)}
                  className="px-3 py-2 text-sm rounded-lg border-2 outline-none bg-white"
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
                  <option value="">-- No parent linked --</option>
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title ? `${p.title} ` : ""}
                      {p.firstName} {p.lastName}
                      {p.email ? ` · ${p.email}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t flex-shrink-0"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
            borderRadius: "0 0 1rem 1rem",
          }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl border"
            style={{
              borderColor: "var(--medium-gray)",
              color: "var(--dark-gray)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (validate()) onSave(form);
            }}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl"
            style={{ backgroundColor: "var(--royal-blue)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--royal-blue-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--royal-blue)")
            }
          >
            <Save size={14} /> {isEdit ? "Save Changes" : "Register Student"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirm
const DeleteConfirm = ({ student, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: "#fff1f2" }}
      >
        <Trash2 size={24} style={{ color: "var(--accent-red)" }} />
      </div>
      <h3
        className="font-black text-lg mb-1"
        style={{ color: "var(--dark-gray)" }}
      >
        Delete Student?
      </h3>
      <p className="text-sm text-gray-500 mb-1">
        <strong>
          {student.firstName} {student.lastName}
        </strong>{" "}
        · {student.studentId}
      </p>
      <p className="text-xs text-gray-400 mb-6">
        This action cannot be undone. The student's scores, attendance, remarks
        and login account will be removed.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onClose}
          className="px-5 py-2 text-sm font-semibold rounded-xl border"
          style={{
            borderColor: "var(--medium-gray)",
            color: "var(--dark-gray)",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2 text-sm font-bold text-white rounded-xl"
          style={{ backgroundColor: "var(--accent-red)" }}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
);

// Student Profile Drawer
const ProfileDrawer = ({ student, onEdit, onClose, parents = [] }) => {
  if (!student) return null;
  const ss = statusStyle(student.status);
  const parentInfo = getParentInfo(student.parentId, parents);

  return (
    <div
      className="fixed inset-0 z-50 flex"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full max-w-md bg-white h-full overflow-y-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
          }}
        >
          <p className="text-white font-black">Student Profile</p>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Edit3 size={12} /> Edit
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div
          className="h-1 flex-shrink-0"
          style={{ backgroundColor: "var(--accent-red)" }}
        />

        <div className="flex-1 p-5 space-y-5">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <Avatar
              name={`${student.firstName} ${student.lastName}`}
              size="lg"
            />
            <div>
              <h2
                className="font-black text-lg"
                style={{ color: "var(--dark-gray)" }}
              >
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-xs font-mono text-gray-400">
                {student.studentId}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: ss.bg, color: ss.color }}
                >
                  {student.status}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: "#eef2ff",
                    color: "var(--royal-blue)",
                  }}
                >
                  {student.year}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: "#eef2ff",
                    color: "var(--royal-blue)",
                  }}
                >
                  {student.year || student.yearGroup}
                </span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Course",
                value: (student.course || student.program || "").replace(
                  "General ",
                  "",
                ),
                color: "var(--royal-blue)",
              },
              {
                label: "Form Class",
                value: student.formClass,
                color: "#7c3aed",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="text-center p-3 rounded-xl"
                style={{ backgroundColor: "var(--light-gray)" }}
              >
                <p
                  className="text-base font-black leading-tight"
                  style={{ color }}
                >
                  {value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Info rows */}
          {[
            {
              icon: User,
              label: "Full Name",
              value: `${student.firstName} ${student.lastName}`,
            },
            { icon: Mail, label: "Email", value: student.email },
            { icon: BookOpen, label: "Form Class", value: student.formClass },
            { icon: BookOpen, label: "House", value: student.house },
            {
              icon: Phone,
              label: "Parent Phone",
              value: parentInfo.parentPhone,
            },
            {
              icon: User,
              label: "Parent/Guardian",
              value: parentInfo.parentName,
            },
            { icon: MapPin, label: "Address", value: student.address },
            {
              icon: Calendar,
              label: "Enrolled",
              value: student.enrollDate
                ? new Date(student.enrollDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "-",
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-start gap-3 py-2.5 border-b"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#eef2ff" }}
              >
                <Icon size={13} style={{ color: "var(--royal-blue)" }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400">{label}</p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {value || "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Students Component
const Students = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [parents, setParents] = useState<ManagedUser[]>([]);
  const [studentUsers, setStudentUsers] = useState<ManagedUser[]>([]);
  const [credential, setCredential] = useState<{
    name: string;
    tempPassword?: string;
    userId?: string;
  } | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<
    (BulkImportResult & { ignoredColumns?: string[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCourse, setFP] = useState("All");
  const [filterYearGroup, setFT] = useState("All");
  const [filterStatus, setFS] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'
  const [selected, setSelected] = useState([]); // bulk selection IDs
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStu] = useState(null);
  const [deleteStudent, setDeleteStu] = useState(null);
  const [viewStudent, setViewStu] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [classNames, setClassNames] = useState<string[]>([]);
  const { courses } = useSchoolLists();
  // Filter by any course in use, including ones not (yet) in a department.
  const courseFilterOptions = useMemo(() => {
    const all = new Set(courses);
    students.forEach((st) => st.course && all.add(st.course));
    return [...all].sort((a, b) => a.localeCompare(b));
  }, [courses, students]);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      setStudents(await studentsApi.list());
    } catch (err) {
      showToast(err?.message || "Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadClassNames = () =>
    classesApi
      .list()
      .then((cls) =>
        setClassNames(
          cls
            .map((c) => c.name)
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
        ),
      )
      .catch(() => setClassNames([]));

  useEffect(() => {
    loadStudents();
    loadClassNames();
    usersApi
      .list()
      .then((all) => {
        setParents(all.filter((u) => u.role === "parent"));
        setStudentUsers(all.filter((u) => u.role === "student"));
      })
      .catch(() => {
        setParents([]);
        setStudentUsers([]);
      });
  }, []);

  // Filtered list
  const filtered = useMemo(
    () =>
      students.filter((s) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          (s.studentId || "").toLowerCase().includes(q) ||
          (s.email || "").toLowerCase().includes(q) ||
          (s.formClass || "").toLowerCase().includes(q);
        const matchCourse = filterCourse === "All" || s.course === filterCourse;
        const matchYearGroup =
          filterYearGroup === "All" || levelOf(s) === filterYearGroup;
        const matchStatus = filterStatus === "All" || s.status === filterStatus;
        return matchSearch && matchCourse && matchYearGroup && matchStatus;
      }),
    [students, search, filterCourse, filterYearGroup, filterStatus],
  );

  // CRUD
  const handleSave = async (form) => {
    try {
      if (form.id) {
        const saved = await studentsApi.update(form.id, form);
        setStudents((ss) => ss.map((s) => (s.id === saved.id ? saved : s)));
        showToast(`${saved.firstName} ${saved.lastName} updated successfully`);
      } else {
        const saved = await studentsApi.create(form);
        setStudents((ss) => [saved, ...ss]);
        setShowForm(false);
        setEditStu(null);
        // Also create the student's login (matched to their record by email)
        if (saved.email) {
          try {
            const { user, tempPassword } = await usersApi.create({
              role: "student",
              firstName: saved.firstName,
              lastName: saved.lastName,
              email: saved.email,
              studentId: saved.studentId,
            });
            setStudentUsers((us) => [user, ...us]);
            setCredential({
              name: `${saved.firstName} ${saved.lastName}`,
              tempPassword,
            });
          } catch (e) {
            showToast(
              `${saved.firstName} registered. A login for ${saved.email} already exists - use the key icon to reset it.`,
              "info",
            );
          }
        } else {
          showToast(
            `${saved.firstName} registered. Add an email to give them a login.`,
            "info",
          );
        }
        return;
      }
      setShowForm(false);
      setEditStu(null);
    } catch (err) {
      showToast(err?.message || "Failed to save student", "error");
    }
  };

  const handleResetLogin = async (student) => {
    if (!student.email) {
      showToast("Add an email to this student first", "error");
      return;
    }
    const existing = studentUsers.find(
      (u) => u.email?.toLowerCase() === student.email.toLowerCase(),
    );
    const name = `${student.firstName} ${student.lastName}`;
    if (existing) {
      setCredential({ name, userId: existing.id as string });
      return;
    }
    // No login yet - create one now
    try {
      const { user, tempPassword } = await usersApi.create({
        role: "student",
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        studentId: student.studentId,
      });
      setStudentUsers((us) => [user, ...us]);
      setCredential({ name, tempPassword });
    } catch (e) {
      showToast(e?.message || "Failed to create login", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await studentsApi.remove(deleteStudent.id);
      setStudents((ss) => ss.filter((s) => s.id !== deleteStudent.id));
      setSelected((sel) => sel.filter((id) => id !== deleteStudent.id));
      showToast(
        `${deleteStudent.firstName} ${deleteStudent.lastName} removed`,
        "error",
      );
    } catch (err) {
      showToast(err?.message || "Failed to delete student", "error");
    } finally {
      setDeleteStu(null);
    }
  };

  // One request for the whole selection; firing one DELETE per student
  // tripped the API rate limit and surfaced as a "network error".
  const handleBulkDelete = async () => {
    if (!confirmBulkDelete) {
      setConfirmBulkDelete(true);
      return;
    }
    try {
      setBulkBusy(true);
      const { deleted } = await studentsApi.bulkDelete(selected);
      const gone = new Set(selected);
      setStudents((ss) => ss.filter((s) => !gone.has(s.id)));
      showToast(`${deleted} student(s) removed`);
      setSelected([]);
      setShowBulk(false);
    } catch (err) {
      showToast(err?.message || "Failed to delete students", "error");
    } finally {
      setBulkBusy(false);
      setConfirmBulkDelete(false);
    }
  };

  const [loginNote, setLoginNote] = useState<{
    created: number;
    skipped: { studentId: string; name: string; reason: string }[];
  } | null>(null);

  // Students without a login cannot see their results. Creates logins for
  // the given records and downloads the one-time passwords once.
  const createLogins = async (ids: string[]) => {
    if (ids.length === 0) {
      showToast("No students to create logins for", "error");
      return;
    }
    try {
      setBulkBusy(true);
      const res = await inBatches(ids, 50, (batch) =>
        studentsApi.createLogins(batch),
      );
      if (res.created.length) {
        downloadCredentialSheet(
          `AFSHTS_Student_Logins_${new Date().toISOString().slice(0, 10)}.xlsx`,
          ["Name", "Index No.", "Class", "Email", "One-time password"],
          res.created.map((c: any) => [
            c.name,
            c.studentId,
            c.formClass,
            c.email,
            c.tempPassword,
          ]),
        );
        const all = await usersApi.list().catch(() => null);
        if (all) setStudentUsers(all.filter((u) => u.role === "student"));
      }
      setLoginNote({
        created: res.created.length,
        skipped: res.skipped as any,
      });
      setShowBulk(false);
      setSelected([]);
    } catch (err) {
      showToast(err?.message || "Failed to create logins", "error");
    } finally {
      setBulkBusy(false);
    }
  };

  const studentsWithoutLogin = () => {
    const emails = new Set(
      studentUsers.map((u) => (u.email || "").toLowerCase()),
    );
    return students.filter(
      (st) => st.email && !emails.has(st.email.toLowerCase()),
    );
  };

  const handlePromote = async () => {
    const yearMap = {
      "Form 1": "Form 2",
      "Form 2": "Form 3",
      "Form 3": "Form 3",
    };
    try {
      setBulkBusy(true);
      const chosen = new Set(selected);
      const changes = students
        .filter((s) => chosen.has(s.id))
        .map((s) => {
          const level = levelOf(s);
          const next = yearMap[level];
          if (!next || next === level) return null;
          const set: Record<string, string> = { yearGroup: next };
          if (/form\s*[1-3]/i.test(String(s.year || ""))) set.year = next;
          return { id: s.id, set };
        })
        .filter(Boolean);
      if (changes.length === 0) {
        showToast("No selected student can be promoted", "info");
        return;
      }
      await studentsApi.bulkUpdate(changes);
      const bySid = new Map(changes.map((c) => [c.id, c.set]));
      setStudents((ss) =>
        ss.map((s) => (bySid.has(s.id) ? { ...s, ...bySid.get(s.id) } : s)),
      );
      showToast(`${changes.length} student(s) promoted`);
      setSelected([]);
    } catch (err) {
      showToast(err?.message || "Failed to promote students", "error");
    } finally {
      setBulkBusy(false);
      setShowBulk(false);
    }
  };

  const handleSampleGuide = () => {
    const header = [
      "firstName",
      "lastName",
      "gender",
      "email",
      "studentId",
      "year",
      "formClass",
      "course",
      "track",
      "status",
      "parentId",
    ];
    const exampleClasses = classNames.length
      ? classNames
      : ["Form 1 Science A", "Form 2 Arts B"];
    const rows = [
      header,
      [
        "Kofi",
        "Asante",
        "Male",
        "k.asante@afshts.edu.gh",
        "AFSHTS/2025/001",
        "2025",
        exampleClasses[0],
        "General Science",
        "A",
        "Active",
        "",
      ],
      [
        "Ama",
        "Mensah",
        "Female",
        "a.mensah@afshts.edu.gh",
        "AFSHTS/2025/002",
        "2025",
        exampleClasses[1] || exampleClasses[0],
        "General Arts",
        "B",
        "Active",
        "",
      ],
    ];
    const guide = [
      ["AFSHTS STUDENT IMPORT - GUIDE"],
      [""],
      ["Fill in the 'Students' sheet. Keep the header row exactly as it is."],
      ["Required columns: studentId, firstName, lastName."],
      ["formClass must match a class name (see the 'Classes' sheet)."],
      [
        "A formClass that does not exist yet is created automatically on import.",
      ],
      ["course: General Science, General Arts, Business or Technical."],
      ["track: A or B.   status: Active, Inactive or Suspended."],
      ["Rows whose studentId already exists are skipped."],
      ["parentId is ignored - link parents afterwards from the Parents page."],
      [
        "Import creates student records only. Create a login later with the key icon.",
      ],
      ["Accepted files: .xlsx, .xls and .csv."],
    ];
    const wb = XLSX.utils.book_new();
    const studentsSheet = XLSX.utils.aoa_to_sheet(rows);
    studentsSheet["!cols"] = header.map((h) => ({
      wch: Math.max(12, h.length + 4),
    }));
    XLSX.utils.book_append_sheet(wb, studentsSheet, "Students");
    const guideSheet = XLSX.utils.aoa_to_sheet(guide);
    guideSheet["!cols"] = [{ wch: 90 }];
    XLSX.utils.book_append_sheet(wb, guideSheet, "Guide");
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([
        ["Existing class names"],
        ...(classNames.length
          ? classNames.map((c) => [c])
          : [["(no classes created yet)"]]),
      ]),
      "Classes",
    );
    XLSX.writeFile(wb, "AFSHTS_Student_Import_Template.xlsx");
    showToast("Excel import template downloaded");
  };

  const [importProgress, setImportProgress] = useState("");

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    try {
      setImporting(true);
      setImportProgress("Reading file…");
      const parsed = await parseStudentFile(file);
      if (parsed.rows.length === 0) {
        showToast("The file has a header row but no student rows.", "error");
        return;
      }
      // Batches keep each upload small and give visible progress on big files.
      const BATCH = 500;
      const total: BulkImportResult = {
        success: true,
        created: 0,
        skipped: 0,
        total: 0,
        classesCreated: [],
        errors: [],
      };
      for (let i = 0; i < parsed.rows.length; i += BATCH) {
        setImportProgress(
          `Importing ${Math.min(i + BATCH, parsed.rows.length)} of ${parsed.rows.length}…`,
        );
        const part = await studentsApi.bulkCreate(
          parsed.rows.slice(i, i + BATCH),
        );
        total.created += part.created;
        total.skipped += part.skipped;
        total.total += part.total;
        total.classesCreated.push(...(part.classesCreated || []));
        if (total.errors.length < 100) {
          total.errors.push(...part.errors.slice(0, 100 - total.errors.length));
        }
      }
      setImportResult({ ...total, ignoredColumns: parsed.ignoredColumns });
      if (total.created > 0) await loadStudents();
      if (total.classesCreated.length) loadClassNames();
    } catch (err) {
      showToast(err?.message || "Failed to import file", "error");
    } finally {
      setImporting(false);
      setImportProgress("");
    }
  };

  const handleExport = (onlySelected = false) => {
    // Headers are understood by the importer, so an export can be edited
    // and imported back.
    const rows: unknown[][] = [
      [
        "Student ID",
        "First Name",
        "Last Name",
        "Gender",
        "Course",
        "Year",
        "Form Class",
        "Year Group",
        "Track",
        "Status",
        "Email",
        "Parent",
      ],
    ];
    const chosen = new Set(selected);
    const source =
      onlySelected === true
        ? students.filter((s) => chosen.has(s.id))
        : filtered;
    source.forEach((s) => {
      const { parentName } = getParentInfo(s.parentId, parents);
      rows.push([
        s.studentId,
        s.firstName,
        s.lastName,
        s.gender,
        s.course || s.program,
        s.year,
        s.formClass,
        levelOf(s) || s.yearGroup,
        s.track,
        s.status,
        s.email,
        parentName === "-" ? "" : parentName,
      ]);
    });
    downloadCsv("AFTS_Students.csv", rows);
    showToast(`${source.length} student(s) exported as CSV`);
  };

  const toggleSelect = (id) =>
    setSelected((sel) =>
      sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id],
    );
  const toggleAll = () =>
    setSelected((sel) =>
      sel.length === filtered.length ? [] : filtered.map((s) => s.id),
    );
  const allSelected =
    filtered.length > 0 && selected.length === filtered.length;

  const activeFilters = [filterCourse, filterYearGroup, filterStatus].filter(
    (f) => f !== "All",
  ).length;

  // Stats
  const total = students.length;
  const active = students.filter((s) => s.status === "Active").length;

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2"
          style={{
            backgroundColor:
              toast.type === "error"
                ? "var(--accent-red)"
                : "var(--success-dark)",
            animation: "fadeIn .2s ease",
          }}
        >
          {toast.type === "error" ? (
            <Trash2 size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}
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
            Students
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {total} students enrolled · {active} active
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sample Guide */}
          <button
            onClick={handleSampleGuide}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition"
            style={{
              borderColor: "var(--success-dark)",
              color: "var(--success-dark)",
              backgroundColor: "#f0fdf4",
            }}
          >
            <Download size={13} /> Sample Guide
          </button>
          {/* Import */}
          <label
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition cursor-pointer"
            style={{
              borderColor: "var(--royal-blue)",
              color: "var(--royal-blue)",
              backgroundColor: "#eef2ff",
            }}
          >
            <Upload size={13} />{" "}
            {importing ? importProgress || "Importing…" : "Import CSV/Excel"}
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              disabled={importing}
              onChange={handleImport}
            />
          </label>
          <button
            onClick={() => handleExport(false)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition"
            style={{
              borderColor: "var(--medium-gray)",
              color: "var(--dark-gray)",
              backgroundColor: "white",
            }}
          >
            <Download size={13} /> Export CSV
          </button>
          {selected.length > 0 && (
            <button
              onClick={() => setShowBulk(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-white"
              style={{ backgroundColor: "#7c3aed" }}
            >
              <Users size={13} /> {selected.length} Selected
            </button>
          )}
          <button
            onClick={() => {
              setEditStu(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-sm"
            style={{ backgroundColor: "var(--royal-blue)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--royal-blue-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--royal-blue)")
            }
          >
            <Plus size={15} /> Add Student
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: total,
            color: "var(--royal-blue)",
            icon: GraduationCap,
          },
          {
            label: "Active Students",
            value: active,
            color: "var(--success-dark)",
            icon: CheckCircle2,
          },
        ].map(({ label, value, color, icon: Icon }) => (
          <div
            key={label}
            className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: color + "18" }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p
                className="text-xl font-black"
                style={{ color: "var(--dark-gray)" }}
              >
                {value}
              </p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters toolbar */}
      <div
        className="bg-white rounded-xl border shadow-sm p-4"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, student ID or email…"
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border-2 outline-none"
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

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((f) => !f)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition"
            style={{
              borderColor:
                activeFilters > 0 ? "var(--royal-blue)" : "var(--medium-gray)",
              backgroundColor: activeFilters > 0 ? "#eef2ff" : "white",
              color:
                activeFilters > 0 ? "var(--royal-blue)" : "var(--dark-gray)",
            }}
          >
            <Filter size={14} />
            Filters{" "}
            {activeFilters > 0 && (
              <span
                className="w-4 h-4 rounded-full text-white text-xs flex items-center justify-center"
                style={{ backgroundColor: "var(--royal-blue)" }}
              >
                {activeFilters}
              </span>
            )}
          </button>

          {/* View toggle */}
          <div
            className="flex rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {[
              ["table", LayoutList],
              ["cards", LayoutGrid],
            ].map(([mode, Icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="p-2.5 transition"
                style={{
                  backgroundColor:
                    viewMode === mode ? "var(--royal-blue)" : "white",
                  color: viewMode === mode ? "white" : "var(--dark-gray)",
                }}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Filter dropdowns */}
        {showFilters && (
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {[
              {
                label: "Course",
                value: filterCourse,
                set: setFP,
                opts: ["All", ...courseFilterOptions],
              },
              {
                label: "Year Group",
                value: filterYearGroup,
                set: setFT,
                opts: ["All", ...YEAR_GROUPS],
              },
              {
                label: "Status",
                value: filterStatus,
                set: setFS,
                opts: ["All", ...STATUSES],
              },
            ].map(({ label, value, set, opts }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <select
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border-2 outline-none bg-white"
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
                  {opts.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">
            Showing <strong>{filtered.length}</strong> of{" "}
            <strong>{total}</strong> students
          </p>
          {(search || activeFilters > 0) && (
            <button
              onClick={() => {
                setSearch("");
                setFP("All");
                setFT("All");
                setFS("All");
              }}
              className="text-xs font-semibold"
              style={{ color: "var(--accent-red)" }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <div
          className="bg-white rounded-xl border shadow-sm overflow-hidden"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead
                className="border-b"
                style={{
                  backgroundColor: "var(--light-gray)",
                  borderColor: "var(--medium-gray)",
                }}
              >
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: "var(--royal-blue)" }}
                    />
                  </th>
                  {[
                    "Student",
                    "ID",
                    "Course",
                    "Class",
                    "Semester",
                    "Status",
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
              <tbody
                className="divide-y"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-12 text-center text-gray-400"
                    >
                      {loading
                        ? "Loading students…"
                        : students.length === 0
                          ? "No students yet - click Add Student to register one"
                          : "No students match your search"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    const ss = statusStyle(s.status);
                    const isSel = selected.includes(s.id);
                    return (
                      <tr
                        key={s.id}
                        className="hover:bg-gray-50 transition"
                        style={{
                          backgroundColor: isSel ? "#eef2ff" : undefined,
                        }}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSel}
                            onChange={() => toggleSelect(s.id)}
                            className="w-4 h-4 rounded"
                            style={{ accentColor: "var(--royal-blue)" }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={`${s.firstName} ${s.lastName}`}
                              size="sm"
                            />
                            <div>
                              <p
                                className="font-semibold"
                                style={{ color: "var(--dark-gray)" }}
                              >
                                {s.firstName} {s.lastName}
                              </p>
                              <p className="text-xs text-gray-400">
                                {s.gender}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">
                          {s.studentId}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {(s.course || s.program || "").replace(
                            "General ",
                            "Gen. ",
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {s.formClass}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: "#eef2ff",
                              color: "var(--royal-blue)",
                            }}
                          >
                            {s.year || s.yearGroup}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded"
                            style={{ backgroundColor: ss.bg, color: ss.color }}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setViewStu(s)}
                              title="View Profile"
                              className="p-1.5 rounded-lg hover:bg-blue-50 transition"
                              style={{ color: "var(--royal-blue)" }}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleResetLogin(s)}
                              title="Login & reset password"
                              className="p-1.5 rounded-lg hover:bg-blue-50 transition"
                              style={{ color: "var(--royal-blue)" }}
                            >
                              <KeyRound size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setEditStu(s);
                                setShowForm(true);
                              }}
                              title="Edit"
                              className="p-1.5 rounded-lg hover:bg-yellow-50 transition"
                              style={{ color: "var(--warning)" }}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteStu(s)}
                              title="Delete"
                              className="p-1.5 rounded-lg hover:bg-red-50 transition"
                              style={{ color: "var(--accent-red)" }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CARDS VIEW */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              {loading
                ? "Loading students…"
                : students.length === 0
                  ? "No students yet - click Add Student to register one"
                  : "No students match your search"}
            </div>
          ) : (
            filtered.map((s) => {
              const ss = statusStyle(s.status);
              const isSel = selected.includes(s.id);
              return (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md cursor-pointer"
                  style={{
                    borderColor: isSel
                      ? "var(--royal-blue)"
                      : "var(--medium-gray)",
                    transform: isSel ? "scale(1.01)" : undefined,
                  }}
                >
                  {/* Card header */}
                  <div
                    className="h-14 relative"
                    style={{
                      background:
                        "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggleSelect(s.id)}
                      className="absolute top-2 right-2 w-4 h-4"
                      style={{ accentColor: "white" }}
                    />
                    <div className="absolute -bottom-5 left-4">
                      <Avatar name={`${s.firstName} ${s.lastName}`} />
                    </div>
                  </div>

                  <div className="pt-7 px-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p
                          className="font-black text-sm truncate"
                          style={{ color: "var(--dark-gray)" }}
                        >
                          {s.firstName} {s.lastName}
                        </p>
                        <p className="text-xs font-mono text-gray-400">
                          {s.studentId}
                        </p>
                      </div>
                      <span
                        className="text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ml-2"
                        style={{ backgroundColor: ss.bg, color: ss.color }}
                      >
                        {s.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: "#eef2ff",
                          color: "var(--royal-blue)",
                        }}
                      >
                        {s.year}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: "#eef2ff",
                          color: "var(--royal-blue)",
                        }}
                      >
                        {s.year || s.yearGroup}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}
                      >
                        {(s.course || s.program || "").replace("General ", "")}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-1 mt-3 pt-3 border-t"
                      style={{ borderColor: "var(--medium-gray)" }}
                    >
                      <button
                        onClick={() => setViewStu(s)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg transition"
                        style={{
                          backgroundColor: "#eef2ff",
                          color: "var(--royal-blue)",
                        }}
                      >
                        <Eye size={12} /> View
                      </button>
                      <button
                        onClick={() => {
                          setEditStu(s);
                          setShowForm(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg transition"
                        style={{
                          backgroundColor: "#fffbeb",
                          color: "var(--warning)",
                        }}
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleResetLogin(s)}
                        title="Login & reset password"
                        className="flex items-center justify-center p-1.5 rounded-lg transition"
                        style={{
                          backgroundColor: "#eef2ff",
                          color: "var(--royal-blue)",
                        }}
                      >
                        <KeyRound size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteStu(s)}
                        className="flex items-center justify-center p-1.5 rounded-lg transition"
                        style={{
                          backgroundColor: "#fff1f2",
                          color: "var(--accent-red)",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* BULK ACTIONS MODAL */}
      {showBulk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black" style={{ color: "var(--dark-gray)" }}>
                Bulk Actions · {selected.length} student
                {selected.length > 1 ? "s" : ""}
              </h3>
              <button
                onClick={() => {
                  setShowBulk(false);
                  setConfirmBulkDelete(false);
                }}
                style={{ color: "var(--dark-gray)" }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => createLogins(selected)}
                disabled={bulkBusy}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition hover:shadow-sm disabled:opacity-60"
                style={{
                  borderColor: "var(--warning)",
                  backgroundColor: "#fffbeb",
                }}
              >
                <KeyRound size={20} style={{ color: "var(--warning)" }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: "#92400e" }}>
                    Create Logins
                  </p>
                  <p className="text-xs text-gray-500">
                    For selected students with an email and no login yet.
                    Downloads their one-time passwords.
                  </p>
                </div>
              </button>
              <button
                onClick={handlePromote}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition hover:shadow-sm"
                style={{
                  borderColor: "var(--royal-blue)",
                  backgroundColor: "#eef2ff",
                }}
              >
                <ArrowUpCircle
                  size={20}
                  style={{ color: "var(--royal-blue)" }}
                />
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--royal-blue)" }}
                  >
                    Promote Students
                  </p>
                  <p className="text-xs text-gray-500">
                    Move Form 1 → Form 2, Form 2 → Form 3 (year group only -
                    change form classes separately)
                  </p>
                </div>
              </button>
              <button
                onClick={() => handleExport(true)}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition hover:shadow-sm"
                style={{
                  borderColor: "var(--success-dark)",
                  backgroundColor: "#f0fdf4",
                }}
              >
                <Download size={20} style={{ color: "var(--success-dark)" }} />
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--success-dark)" }}
                  >
                    Export Selected
                  </p>
                  <p className="text-xs text-gray-500">Download as CSV file</p>
                </div>
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={bulkBusy}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition hover:shadow-sm disabled:opacity-60"
                style={{
                  borderColor: "var(--accent-red)",
                  backgroundColor: confirmBulkDelete
                    ? "var(--accent-red)"
                    : "#fff1f2",
                }}
              >
                <Trash2
                  size={20}
                  style={{
                    color: confirmBulkDelete ? "white" : "var(--accent-red)",
                  }}
                />
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: confirmBulkDelete ? "white" : "var(--accent-red)",
                    }}
                  >
                    {bulkBusy
                      ? "Deleting…"
                      : confirmBulkDelete
                        ? `Click again to delete ${selected.length} student${selected.length > 1 ? "s" : ""}`
                        : "Delete Selected"}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: confirmBulkDelete
                        ? "rgba(255,255,255,.85)"
                        : "#6b7280",
                    }}
                  >
                    Permanently removes the student records with their scores,
                    attendance, remarks and login accounts. This cannot be
                    undone.
                  </p>
                </div>
              </button>
            </div>
            <button
              onClick={() => {
                setShowBulk(false);
                setConfirmBulkDelete(false);
              }}
              className="w-full mt-4 py-2 text-sm font-semibold rounded-xl border"
              style={{
                borderColor: "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showForm && (
        <StudentFormModal
          student={editStudent}
          parents={parents}
          classNames={classNames}
          courses={courses}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditStu(null);
          }}
        />
      )}

      {deleteStudent && (
        <DeleteConfirm
          student={deleteStudent}
          onConfirm={handleDelete}
          onClose={() => setDeleteStu(null)}
        />
      )}

      {viewStudent && (
        <ProfileDrawer
          student={viewStudent}
          parents={parents}
          onEdit={() => {
            setEditStu(viewStudent);
            setViewStu(null);
            setShowForm(true);
          }}
          onClose={() => setViewStu(null)}
        />
      )}

      {credential && (
        <CredentialModal
          name={credential.name}
          tempPassword={credential.tempPassword}
          userId={credential.userId}
          onClose={() => setCredential(null)}
        />
      )}

      {importResult && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
            <div
              className="px-6 py-5 text-center"
              style={{
                background:
                  "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
              }}
            >
              <p className="text-white font-black text-lg">Import Complete</p>
              <p className="text-blue-200 text-xs mt-1">
                {importResult.total} row{importResult.total === 1 ? "" : "s"}{" "}
                processed
              </p>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="text-center p-3 rounded-xl"
                  style={{ backgroundColor: "#f0fdf4" }}
                >
                  <p
                    className="text-2xl font-black"
                    style={{ color: "var(--success-dark)" }}
                  >
                    {importResult.created}
                  </p>
                  <p className="text-xs text-gray-500">Imported</p>
                </div>
                <div
                  className="text-center p-3 rounded-xl"
                  style={{ backgroundColor: "#fffbeb" }}
                >
                  <p
                    className="text-2xl font-black"
                    style={{ color: "var(--warning)" }}
                  >
                    {importResult.skipped}
                  </p>
                  <p className="text-xs text-gray-500">Skipped</p>
                </div>
              </div>

              {(importResult.ignoredColumns?.length ?? 0) > 0 && (
                <p className="text-xs text-gray-500">
                  Columns not imported: {importResult.ignoredColumns.join(", ")}
                </p>
              )}

              {(importResult.classesCreated?.length ?? 0) > 0 && (
                <div
                  className="text-xs p-3 rounded-xl"
                  style={{ backgroundColor: "#eef2ff", color: "#3730a3" }}
                >
                  <strong>
                    {importResult.classesCreated.length} new class(es)
                  </strong>{" "}
                  created from the file:{" "}
                  {importResult.classesCreated.slice(0, 6).join(", ")}
                  {importResult.classesCreated.length > 6 ? ", …" : ""}. Assign
                  teachers to them under Teachers.
                </div>
              )}

              {importResult.errors.length > 0 && (
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    Skipped rows
                  </p>
                  <div
                    className="rounded-xl border divide-y max-h-48 overflow-y-auto"
                    style={{ borderColor: "var(--medium-gray)" }}
                  >
                    {importResult.errors.map((e, i) => (
                      <div key={i} className="px-3 py-2 text-xs">
                        <span
                          className="font-semibold"
                          style={{ color: "var(--dark-gray)" }}
                        >
                          {e.studentId || (e.row ? `Row ${e.row}` : "Row")}
                        </span>
                        <span className="text-gray-500"> - {e.reason}</span>
                      </div>
                    ))}
                  </div>
                  {importResult.skipped > importResult.errors.length && (
                    <p className="text-xs text-gray-400 mt-1">
                      Showing first {importResult.errors.length} of{" "}
                      {importResult.skipped}.
                    </p>
                  )}
                </div>
              )}

              {importResult.created > 0 && (
                <button
                  type="button"
                  disabled={bulkBusy}
                  onClick={async () => {
                    const ids = studentsWithoutLogin().map((st) => st.id);
                    setImportResult(null);
                    await createLogins(ids);
                  }}
                  className="w-full py-2.5 text-sm font-bold rounded-xl border-2 disabled:opacity-60"
                  style={{
                    borderColor: "var(--warning)",
                    color: "#92400e",
                    backgroundColor: "#fffbeb",
                  }}
                >
                  {bulkBusy
                    ? "Creating logins…"
                    : "Create logins for students without one"}
                </button>
              )}
              <button
                onClick={() => setImportResult(null)}
                className="w-full py-2.5 text-sm font-bold text-white rounded-xl"
                style={{ backgroundColor: "var(--royal-blue)" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {loginNote && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
            <div
              className="px-6 py-5 text-center"
              style={{
                background:
                  "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
              }}
            >
              <p className="text-white font-black text-lg">Student Logins</p>
              <p className="text-blue-200 text-xs mt-1">
                {loginNote.created} created · {loginNote.skipped.length} skipped
              </p>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto text-sm">
              {loginNote.created > 0 && (
                <p
                  className="p-3 rounded-xl text-xs"
                  style={{ backgroundColor: "#fffbeb", color: "#92400e" }}
                >
                  The login sheet with one-time passwords has been downloaded.
                  It is the only copy - hand each password out privately and
                  delete the file afterwards.
                </p>
              )}
              {loginNote.skipped.length > 0 && (
                <div className="rounded-xl border divide-y max-h-48 overflow-y-auto">
                  {loginNote.skipped.map((x, i) => (
                    <div key={i} className="px-3 py-2 text-xs">
                      <span className="font-semibold">
                        {x.name} ({x.studentId})
                      </span>
                      <span className="text-gray-500"> - {x.reason}</span>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => setLoginNote(null)}
                className="w-full py-2.5 text-sm font-bold text-white rounded-xl"
                style={{ backgroundColor: "var(--royal-blue)" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
};

export default Students;
