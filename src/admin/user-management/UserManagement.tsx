// src/admin/user-management/UserManagement.jsx
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  X,
  Save,
  Users,
  Shield,
  GraduationCap,
  UserCheck,
  Download,
  Filter,
  LayoutList,
  LayoutGrid,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  User,
  Calendar,
  RefreshCw,
  ChevronRight,
  Copy,
} from "lucide-react";
import { STUDENTS, PARENTS } from "../data/adminData";

// ─── Build all users from existing data ───────────────────────────────────────
const ADMIN_USERS = [
  {
    id: "a1",
    role: "admin",
    title: "Mr",
    firstName: "System",
    lastName: "Administrator",
    email: "admin@afts.edu.gh",
    phone: "0244000001",
    status: "Active",
    lastLogin: "2025-03-17 14:32",
    joinDate: "2018-09-01",
    position: "System Administrator",
  },
];

const TEACHER_USERS = [
  {
    id: "t1",
    role: "teacher",
    title: "Capt",
    firstName: "Kwabena",
    lastName: "Adjei",
    email: "k.adjei@afts.edu.gh",
    phone: "0244123456",
    status: "Active",
    lastLogin: "2025-03-17 08:05",
    joinDate: "2018-09-01",
    department: "Mathematics",
    staffId: "AFSHTS/TCH/001",
    teacherRole: "Subject Teacher + Form Teacher",
    formClass: "Form 3 Science A",
  },
  {
    id: "t2",
    role: "teacher",
    title: "Mrs",
    firstName: "Ama",
    lastName: "Eshun",
    email: "a.eshun@afts.edu.gh",
    phone: "0277654321",
    status: "Active",
    lastLogin: "2025-03-17 09:10",
    joinDate: "2019-01-15",
    department: "English",
    staffId: "AFSHTS/TCH/002",
    teacherRole: "Subject Teacher",
    formClass: "",
  },
  {
    id: "t3",
    role: "teacher",
    title: "Dr",
    firstName: "Kofi",
    lastName: "Osei",
    email: "k.osei@afts.edu.gh",
    phone: "0200112233",
    status: "Active",
    lastLogin: "2025-03-16 10:55",
    joinDate: "2017-09-01",
    department: "Science",
    staffId: "AFSHTS/TCH/003",
    teacherRole: "Subject Teacher + HOD",
    formClass: "",
  },
  {
    id: "t4",
    role: "teacher",
    title: "Sgt",
    firstName: "Efua",
    lastName: "Frimpong",
    email: "e.frimpong@afts.edu.gh",
    phone: "0244987654",
    status: "Active",
    lastLogin: "2025-03-15 08:30",
    joinDate: "2020-09-01",
    department: "Technical",
    staffId: "AFSHTS/TCH/004",
    teacherRole: "Subject Teacher",
    formClass: "",
  },
  {
    id: "t5",
    role: "teacher",
    title: "Mr",
    firstName: "Nana",
    lastName: "Boateng",
    email: "n.boateng@afts.edu.gh",
    phone: "0207654321",
    status: "Active",
    lastLogin: "2025-03-14 09:00",
    joinDate: "2016-09-01",
    department: "Social Studies",
    staffId: "AFSHTS/TCH/005",
    teacherRole: "Subject Teacher + Form Teacher + HOD",
    formClass: "Form 2 Arts A",
  },
  {
    id: "t6",
    role: "teacher",
    title: "Mrs",
    firstName: "Abena",
    lastName: "Mensah",
    email: "a.mensah@afts.edu.gh",
    phone: "0244555666",
    status: "Active",
    lastLogin: "2025-03-17 11:00",
    joinDate: "2021-01-10",
    department: "Science",
    staffId: "AFSHTS/TCH/006",
    teacherRole: "Subject Teacher + Form Teacher",
    formClass: "Form 3 Science B",
  },
  {
    id: "t7",
    role: "teacher",
    title: "Lt",
    firstName: "Kwame",
    lastName: "Asare",
    email: "k.asare@afts.edu.gh",
    phone: "0277112233",
    status: "Active",
    lastLogin: "2025-03-13 08:45",
    joinDate: "2019-09-01",
    department: "Science",
    staffId: "AFSHTS/TCH/007",
    teacherRole: "Examiner",
    formClass: "",
  },
  {
    id: "t8",
    role: "teacher",
    title: "Dr",
    firstName: "Yaa",
    lastName: "Agyemang",
    email: "y.agyemang@afts.edu.gh",
    phone: "0244567890",
    status: "Active",
    lastLogin: "2025-03-17 07:50",
    joinDate: "2015-09-01",
    department: "Mathematics",
    staffId: "AFSHTS/TCH/015",
    teacherRole: "Form Teacher + HOD",
    formClass: "Form 1 Science A",
  },
  {
    id: "t9",
    role: "teacher",
    title: "Mr",
    firstName: "Ekow",
    lastName: "Sarpong",
    email: "e.sarpong@afts.edu.gh",
    phone: "0244666777",
    status: "Inactive",
    lastLogin: "2025-01-10 09:00",
    joinDate: "2017-01-10",
    department: "Social Studies",
    staffId: "AFSHTS/TCH/012",
    teacherRole: "Subject Teacher",
    formClass: "",
  },
];

// Build student users from adminData
const STUDENT_USERS = STUDENTS.slice(0, 20).map((s) => ({
  id: `s${s.id}`,
  role: "student",
  title: "",
  firstName: s.firstName,
  lastName: s.lastName,
  email:
    s.email ||
    `${s.firstName.toLowerCase()}.${s.lastName.toLowerCase()}@afts.edu.gh`,
  phone: "—",
  status: s.status,
  lastLogin: s.status === "Active" ? "2025-03-17 08:00" : "—",
  joinDate: s.enrollDate,
  studentId: s.studentId,
  formClass: s.formClass,
  course: s.course,
}));

// Build parent users from adminData
const PARENT_USERS = [
  {
    id: "p1",
    role: "parent",
    title: "Mr",
    firstName: "Emmanuel",
    lastName: "Asante",
    email: "e.asante@gmail.com",
    phone: "0244123456",
    status: "Active",
    lastLogin: "2025-03-17 19:00",
    joinDate: "2022-09-05",
    childrenCount: 3,
  },
  {
    id: "p2",
    role: "parent",
    title: "Mrs",
    firstName: "Grace",
    lastName: "Mensah",
    email: "g.mensah@gmail.com",
    phone: "0277654321",
    status: "Active",
    lastLogin: "2025-03-16 20:10",
    joinDate: "2024-09-02",
    childrenCount: 1,
  },
  {
    id: "p3",
    role: "parent",
    title: "Mr",
    firstName: "Samuel",
    lastName: "Boateng",
    email: "s.boateng@yahoo.com",
    phone: "0200334455",
    status: "Active",
    lastLogin: "2025-03-15 18:30",
    joinDate: "2024-09-02",
    childrenCount: 1,
  },
  {
    id: "p4",
    role: "parent",
    title: "Mrs",
    firstName: "Akua",
    lastName: "Darkwah",
    email: "a.darkwah@gmail.com",
    phone: "0244565758",
    status: "Active",
    lastLogin: "2025-03-14 19:45",
    joinDate: "2024-09-02",
    childrenCount: 1,
  },
  {
    id: "p5",
    role: "parent",
    title: "Mr",
    firstName: "Kwabena",
    lastName: "Asante",
    email: "k.asante@outlook.com",
    phone: "0277112233",
    status: "Active",
    lastLogin: "2025-03-13 20:00",
    joinDate: "2024-09-02",
    childrenCount: 1,
  },
  {
    id: "p6",
    role: "parent",
    title: "Mrs",
    firstName: "Comfort",
    lastName: "Osei",
    email: "c.osei@gmail.com",
    phone: "0244888111",
    status: "Active",
    lastLogin: "2025-03-12 19:00",
    joinDate: "2024-09-02",
    childrenCount: 1,
  },
  {
    id: "p7",
    role: "parent",
    title: "Mr",
    firstName: "Richard",
    lastName: "Frimpong",
    email: "r.frimpong@gmail.com",
    phone: "0207456789",
    status: "Active",
    lastLogin: "2025-03-11 20:30",
    joinDate: "2024-09-02",
    childrenCount: 1,
  },
  {
    id: "p8",
    role: "parent",
    title: "Mrs",
    firstName: "Janet",
    lastName: "Tawiah",
    email: "j.tawiah@yahoo.com",
    phone: "0244321777",
    status: "Active",
    lastLogin: "2025-03-10 18:00",
    joinDate: "2024-09-02",
    childrenCount: 1,
  },
  {
    id: "p9",
    role: "parent",
    title: "Mrs",
    firstName: "Ama",
    lastName: "Asare",
    email: "a.asare@gmail.com",
    phone: "0207111222",
    status: "Inactive",
    lastLogin: "2025-01-05 20:00",
    joinDate: "2022-09-05",
    childrenCount: 1,
  },
  {
    id: "p10",
    role: "parent",
    title: "Mr",
    firstName: "Eric",
    lastName: "Bonsu",
    email: "e.bonsu@gmail.com",
    phone: "0244888999",
    status: "Active",
    lastLogin: "2025-03-09 21:00",
    joinDate: "2024-09-03",
    childrenCount: 1,
  },
];

const ALL_USERS = [
  ...ADMIN_USERS,
  ...TEACHER_USERS,
  ...STUDENT_USERS,
  ...PARENT_USERS,
];

// ─── Config ───────────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    color: "var(--accent-red)",
    bg: "#fff1f2",
    icon: Shield,
    plural: "Admins",
  },
  teacher: {
    label: "Teacher",
    color: "var(--royal-blue)",
    bg: "#eef2ff",
    icon: Users,
    plural: "Teachers",
  },
  student: {
    label: "Student",
    color: "#7c3aed",
    bg: "#f5f3ff",
    icon: GraduationCap,
    plural: "Students",
  },
  parent: {
    label: "Parent",
    color: "var(--warning)",
    bg: "#fffbeb",
    icon: UserCheck,
    plural: "Parents",
  },
};

const STATUS_STYLE = {
  Active: {
    bg: "#f0fdf4",
    color: "var(--success-dark)",
    dot: "var(--success-dark)",
  },
  Inactive: {
    bg: "#fff1f2",
    color: "var(--accent-red)",
    dot: "var(--accent-red)",
  },
  Suspended: { bg: "#fffbeb", color: "var(--warning)", dot: "var(--warning)" },
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, role, size = "md" }) => {
  const ini = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const color = ROLE_CONFIG[role]?.color || "#6b7280";
  const sz =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "lg"
        ? "w-14 h-14 text-xl"
        : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center text-white font-black flex-shrink-0`}
      style={{ backgroundColor: color }}
    >
      {ini}
    </div>
  );
};

// ─── Reset Password Modal ─────────────────────────────────────────────────────
const ResetPasswordModal = ({ user, onClose }) => {
  const [copied, setCopied] = useState(false);
  const tempPw = `AFSHTS@${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(tempPw).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div
          className="px-6 py-5 text-center"
          style={{
            background:
              "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <Key size={24} className="text-white" />
          </div>
          <p className="text-white font-black text-lg">Reset Password</p>
          <p className="text-blue-200 text-xs mt-1">
            {user.firstName} {user.lastName}
          </p>
        </div>
        <div className="h-1" style={{ backgroundColor: "var(--accent-red)" }} />
        <div className="p-6 space-y-4">
          <p className="text-sm text-center text-gray-500">
            A temporary password has been generated. Share it securely with the
            user.
          </p>
          <div
            className="flex items-center gap-2 p-4 rounded-xl border-2"
            style={{
              borderColor: "var(--royal-blue)",
              backgroundColor: "#eef2ff",
            }}
          >
            <p
              className="flex-1 font-mono font-bold text-lg text-center"
              style={{ color: "var(--royal-blue)" }}
            >
              {tempPw}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-lg transition"
              style={{
                backgroundColor: copied
                  ? "var(--success-dark)"
                  : "var(--royal-blue)",
                color: "white",
              }}
            >
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <p className="text-xs text-center text-gray-400">
            User must change this password on next login
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold rounded-xl border"
              style={{
                borderColor: "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
            >
              Close
            </button>
            <button
              type="button"
              className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl"
              style={{ backgroundColor: "var(--royal-blue)" }}
              onClick={() => {
                handleCopy();
                setTimeout(onClose, 500);
              }}
            >
              Copy & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Add User Modal ───────────────────────────────────────────────────────────
const ROLE_STEPS = {
  admin: ["personal"],
  teacher: ["personal", "academic"],
  student: ["personal", "academic"],
  parent: ["personal", "children"],
};

// ─── Edit User Modal ──────────────────────────────────────────────────────────
const EditUserModal = ({ user, onSave, onClose }) => {
  const [form, setForm] = useState({ ...user });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const fields = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone" },
    ...(user.role === "teacher"
      ? [
          { key: "department", label: "Department" },
          { key: "staffId", label: "Staff ID" },
        ]
      : []),
    ...(user.role === "student"
      ? [
          { key: "studentId", label: "Student ID" },
          { key: "formClass", label: "Form Class" },
        ]
      : []),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,.45)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            borderColor: "var(--medium-gray)",
            background:
              "linear-gradient(135deg,var(--royal-blue-dark),var(--royal-blue))",
          }}
        >
          <div>
            <p className="text-white font-black text-sm">Edit User</p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "rgba(255,255,255,.6)" }}
            >
              {user.title} {user.firstName} {user.lastName} · {user.role}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <X size={14} />
          </button>
        </div>
        <div className="h-1" style={{ backgroundColor: "var(--accent-red)" }} />

        {/* Form */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {fields.map(({ key, label, type = "text" }) => (
            <div key={key}>
              <label
                className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: "#6b7280" }}
              >
                {label}
              </label>
              <input
                type={type}
                value={form[key] || ""}
                onChange={(e) => set(key, e.target.value)}
                className="w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderColor: "var(--medium-gray)" }}
              />
            </div>
          ))}
          {/* Status */}
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "#6b7280" }}
            >
              Status
            </label>
            <select
              value={form.status || "Active"}
              onChange={(e) => set("status", e.target.value)}
              className="w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 px-6 py-4 border-t"
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
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const AddUserModal = ({ onSave, onClose }) => {
  const [step, setStep] = useState("role"); // 'role' | 'form'
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const ROLE_OPTIONS = [
    {
      key: "admin",
      label: "Administrator",
      desc: "Full system access",
      color: "var(--accent-red)",
      bg: "#fff1f2",
      icon: Shield,
    },
    {
      key: "teacher",
      label: "Teacher",
      desc: "Enter scores, view classes, manage reports",
      color: "var(--royal-blue)",
      bg: "#eef2ff",
      icon: Users,
    },
    {
      key: "student",
      label: "Student",
      desc: "View results, report cards and timetable",
      color: "#7c3aed",
      bg: "#f5f3ff",
      icon: GraduationCap,
    },
    {
      key: "parent",
      label: "Parent",
      desc: "View child's academic records",
      color: "var(--warning)",
      bg: "#fffbeb",
      icon: UserCheck,
    },
  ];

  const validate = () => {
    const e = {};
    if (!form.firstName?.trim()) e.firstName = "Required";
    if (!form.lastName?.trim()) e.lastName = "Required";
    if (!form.email?.trim()) e.email = "Required";
    if (role === "teacher" && !form.staffId?.trim()) e.staffId = "Required";
    if (role === "student" && !form.studentId?.trim()) e.studentId = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const newUser = {
      id: `${role[0]}${Date.now()}`,
      role,
      title: form.title || "Mr",
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone || "—",
      status: "Active",
      lastLogin: "—",
      joinDate: new Date().toISOString().split("T")[0],
      ...(role === "teacher"
        ? {
            staffId: form.staffId,
            department: form.department || "Mathematics",
            teacherRole: form.teacherRole || "Subject Teacher",
            formClass: form.formClass || "",
          }
        : {}),
      ...(role === "student"
        ? {
            studentId: form.studentId,
            formClass: form.formClass || "",
            course: form.course || "General Science",
          }
        : {}),
      ...(role === "parent" ? { childrenCount: 0 } : {}),
    };
    onSave(newUser);
  };

  const FInput = ({
    label,
    field,
    placeholder,
    type = "text",
    options,
    required,
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
          value={form[field] || ""}
          onChange={(e) => set(field, e.target.value)}
          className="px-3 py-2.5 text-sm rounded-xl border-2 outline-none bg-white"
          style={{
            borderColor: errors[field]
              ? "var(--accent-red)"
              : "var(--medium-gray)",
            color: "var(--dark-gray)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
          onBlur={(e) =>
            (e.target.style.borderColor = errors[field]
              ? "var(--accent-red)"
              : "var(--medium-gray)")
          }
        >
          <option value="">-- Select --</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={form[field] || ""}
          onChange={(e) => set(field, e.target.value)}
          placeholder={placeholder}
          className="px-3 py-2.5 text-sm rounded-xl border-2 outline-none"
          style={{
            borderColor: errors[field]
              ? "var(--accent-red)"
              : "var(--medium-gray)",
            color: "var(--dark-gray)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
          onBlur={(e) =>
            (e.target.style.borderColor = errors[field]
              ? "var(--accent-red)"
              : "var(--medium-gray)")
          }
        />
      )}
      {errors[field] && (
        <span className="text-xs" style={{ color: "var(--accent-red)" }}>
          {errors[field]}
        </span>
      )}
    </div>
  );

  const selectedRole = role ? ROLE_OPTIONS.find((r) => r.key === role) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
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
              <Plus size={16} />
            </div>
            <div>
              <p className="font-black">Add New User</p>
              <p className="text-blue-200 text-xs">
                {step === "role"
                  ? "Step 1 — Select a role"
                  : `Step 2 — ${selectedRole?.label} details`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-blue-200"
          >
            <X size={20} />
          </button>
        </div>
        <div
          className="h-1 flex-shrink-0"
          style={{ backgroundColor: "var(--accent-red)" }}
        />

        {/* Progress dots */}
        <div
          className="flex items-center justify-center gap-2 py-3 border-b"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          {["role", "form"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                style={{
                  backgroundColor:
                    step === s
                      ? "var(--royal-blue)"
                      : step === "form" && s === "role"
                        ? "var(--success-dark)"
                        : "var(--medium-gray)",
                  color:
                    step === s || (step === "form" && s === "role")
                      ? "white"
                      : "#9ca3af",
                }}
              >
                {step === "form" && s === "role" ? "✓" : i + 1}
              </div>
              <span
                className="text-xs font-semibold"
                style={{ color: step === s ? "var(--royal-blue)" : "#9ca3af" }}
              >
                {s === "role" ? "Choose Role" : "Fill Details"}
              </span>
              {i === 0 && (
                <div
                  className="w-8 h-0.5"
                  style={{
                    backgroundColor:
                      step === "form"
                        ? "var(--success-dark)"
                        : "var(--medium-gray)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* ── Step 1: Role picker ── */}
          {step === "role" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">
                What type of user do you want to add?
              </p>
              {ROLE_OPTIONS.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => {
                      setRole(r.key);
                      setStep("form");
                      setForm({});
                      setErrors({});
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all hover:shadow-md"
                    style={{
                      borderColor: r.color + "40",
                      backgroundColor: r.bg,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = r.color)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = r.color + "40")
                    }
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: r.color + "20" }}
                    >
                      <Icon size={22} style={{ color: r.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-black text-base"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {r.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
                    </div>
                    <ChevronRight
                      size={16}
                      style={{ color: r.color, flexShrink: 0 }}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Step 2: Form fields ── */}
          {step === "form" && selectedRole && (
            <div className="space-y-5">
              {/* Role badge */}
              <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: selectedRole.bg }}
              >
                <selectedRole.icon
                  size={18}
                  style={{ color: selectedRole.color }}
                />
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: selectedRole.color }}
                  >
                    Adding a {selectedRole.label}
                  </p>
                  <p className="text-xs text-gray-400">{selectedRole.desc}</p>
                </div>
              </div>

              {/* Personal info */}
              <div>
                <p
                  className="text-xs font-black uppercase tracking-widest mb-3"
                  style={{ color: "var(--royal-blue)", opacity: 0.7 }}
                >
                  Personal Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {role !== "student" && (
                    <FInput
                      label="Title"
                      field="title"
                      options={[
                        "Mr",
                        "Mrs",
                        "Miss",
                        "Dr",
                        "Prof",
                        "Rev",
                        "Capt",
                        "Lt",
                        "Sgt",
                      ]}
                    />
                  )}
                  <FInput
                    label="First Name"
                    field="firstName"
                    placeholder="e.g. Kofi"
                    required
                  />
                  <FInput
                    label="Last Name"
                    field="lastName"
                    placeholder="e.g. Asante"
                    required
                  />
                  <FInput
                    label="Email"
                    field="email"
                    placeholder="user@afts.edu.gh"
                    type="email"
                    required
                  />
                  <FInput label="Phone" field="phone" placeholder="0244..." />
                  <FInput
                    label="Status"
                    field="status"
                    options={["Active", "Inactive"]}
                  />
                </div>
              </div>

              {/* Role-specific fields */}
              {role === "teacher" && (
                <div>
                  <p
                    className="text-xs font-black uppercase tracking-widest mb-3"
                    style={{ color: "var(--royal-blue)", opacity: 0.7 }}
                  >
                    School Information
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FInput
                      label="Staff ID"
                      field="staffId"
                      placeholder="e.g. AFSHTS/TCH/016"
                      required
                    />
                    <FInput
                      label="Department"
                      field="department"
                      options={[
                        "Mathematics",
                        "English",
                        "Science",
                        "Social Studies",
                        "Technical",
                        "Business",
                        "Arts",
                        "Physical Education",
                      ]}
                    />
                    <FInput
                      label="Subject Taught"
                      field="subject"
                      placeholder="e.g. Core Mathematics"
                    />
                    <FInput
                      label="Employment"
                      field="employmentType"
                      options={[
                        "Full-time",
                        "Part-time",
                        "Contract",
                        "National Service",
                      ]}
                    />
                    <div className="sm:col-span-2">
                      <FInput
                        label="Teacher Role"
                        field="teacherRole"
                        options={[
                          "Subject Teacher",
                          "Subject Teacher + Form Teacher",
                          "Subject Teacher + HOD",
                          "Subject Teacher + Form Teacher + HOD",
                          "Form Teacher + HOD",
                          "Examiner",
                        ]}
                      />
                    </div>
                    {(form.teacherRole || "").includes("Form Teacher") && (
                      <div className="sm:col-span-2">
                        <FInput
                          label="Form Class (assigned)"
                          field="formClass"
                          placeholder="e.g. Form 2 Science A"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {role === "student" && (
                <div>
                  <p
                    className="text-xs font-black uppercase tracking-widest mb-3"
                    style={{ color: "var(--royal-blue)", opacity: 0.7 }}
                  >
                    Academic Information
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FInput
                      label="Student ID"
                      field="studentId"
                      placeholder="e.g. AFSHTS/2025/050"
                      required
                    />
                    <FInput
                      label="Year Group"
                      field="year"
                      options={["Form 1", "Form 2", "Form 3"]}
                    />
                    <FInput
                      label="Course"
                      field="course"
                      options={[
                        "General Science",
                        "General Arts",
                        "Business",
                        "Technical",
                      ]}
                    />
                    <FInput label="Track" field="track" options={["A", "B"]} />
                    <FInput
                      label="Form Class"
                      field="formClass"
                      placeholder="e.g. Form 1 Science A"
                    />
                    <FInput
                      label="House"
                      field="house"
                      options={["Warrior", "Eagle", "Phoenix", "Valor"]}
                    />
                  </div>
                </div>
              )}

              {role === "parent" && (
                <div>
                  <p
                    className="text-xs font-black uppercase tracking-widest mb-3"
                    style={{ color: "var(--royal-blue)", opacity: 0.7 }}
                  >
                    Additional Details
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FInput
                      label="Occupation"
                      field="occupation"
                      placeholder="e.g. Engineer"
                    />
                    <FInput
                      label="Address"
                      field="address"
                      placeholder="e.g. Bantama, Kumasi"
                    />
                  </div>
                </div>
              )}

              {role === "admin" && (
                <div>
                  <p
                    className="text-xs font-black uppercase tracking-widest mb-3"
                    style={{ color: "var(--royal-blue)", opacity: 0.7 }}
                  >
                    Admin Details
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FInput
                      label="Position"
                      field="position"
                      options={[
                        "Headmaster",
                        "Assistant Headmaster",
                        "Admin Officer",
                        "Bursar",
                        "Academic Director",
                        "System Administrator",
                      ]}
                    />
                    <FInput
                      label="Staff ID"
                      field="staffId"
                      placeholder="e.g. AFSHTS/ADM/002"
                    />
                  </div>
                </div>
              )}

              {/* Temp password info */}
              <div
                className="p-3 rounded-xl border"
                style={{ backgroundColor: "#eef2ff", borderColor: "#c7d2fe" }}
              >
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--royal-blue)" }}
                >
                  A temporary password will be auto-generated. You can reset it
                  from the user's profile.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "form" && (
          <div
            className="flex items-center justify-between gap-3 px-6 py-4 border-t flex-shrink-0"
            style={{
              borderColor: "var(--medium-gray)",
              backgroundColor: "var(--light-gray)",
              borderRadius: "0 0 1rem 1rem",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setStep("role");
                setErrors({});
              }}
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border"
              style={{
                borderColor: "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
            >
              ← Back
            </button>
            <div className="flex gap-2">
              <button
                type="button"
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
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl"
                style={{ backgroundColor: "var(--royal-blue)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--royal-blue-dark)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--royal-blue)")
                }
              >
                <Save size={14} /> Add {selectedRole?.label}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Profile Drawer ───────────────────────────────────────────────────────────
const ProfileDrawer = ({ user, onClose, onReset, onToggleStatus }) => {
  if (!user) return null;
  const rc = ROLE_CONFIG[user.role];
  const ss = STATUS_STYLE[user.status] || STATUS_STYLE.Active;
  const fullName = [user.title, user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ");

  const infoRows = [
    { icon: Mail, label: "Email", value: user.email },
    { icon: Phone, label: "Phone", value: user.phone },
    {
      icon: Calendar,
      label: "Joined",
      value: user.joinDate
        ? new Date(user.joinDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "—",
    },
    { icon: User, label: "Last Login", value: user.lastLogin || "—" },
    ...(user.role === "teacher"
      ? [
          { icon: User, label: "Staff ID", value: user.staffId },
          { icon: User, label: "Department", value: user.department },
          {
            icon: Shield,
            label: "Teacher Role",
            value: user.teacherRole || "Subject Teacher",
          },
          ...(user.formClass
            ? [{ icon: User, label: "Form Class", value: user.formClass }]
            : []),
        ]
      : []),
    ...(user.role === "student"
      ? [
          { icon: User, label: "Student ID", value: user.studentId },
          { icon: User, label: "Form Class", value: user.formClass },
          { icon: User, label: "Course", value: user.course },
        ]
      : []),
    ...(user.role === "parent"
      ? [
          {
            icon: User,
            label: "Children",
            value: `${user.childrenCount || 1} enrolled`,
          },
        ]
      : []),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-sm bg-white h-full overflow-y-auto flex flex-col shadow-2xl">
        <div
          className="px-5 py-4 flex items-center justify-between flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
          }}
        >
          <p className="text-white font-black">User Profile</p>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-blue-200"
          >
            <X size={18} />
          </button>
        </div>
        <div
          className="h-1 flex-shrink-0"
          style={{ backgroundColor: rc.color }}
        />

        <div className="flex-1 p-5 space-y-5">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <Avatar name={fullName} role={user.role} size="lg" />
            <div className="min-w-0">
              <h2
                className="font-black text-lg leading-tight"
                style={{ color: "var(--dark-gray)" }}
              >
                {fullName}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: rc.bg, color: rc.color }}
                >
                  {rc.label}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                  style={{ backgroundColor: ss.bg, color: ss.color }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: ss.dot }}
                  />
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          {/* Info rows */}
          <div
            className="bg-white rounded-xl border p-4 space-y-0"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {infoRows.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 py-2.5 border-b last:border-0"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: rc.bg }}
                >
                  <Icon size={12} style={{ color: rc.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {value || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onReset(user)}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition hover:shadow-sm"
              style={{
                borderColor: "var(--royal-blue)",
                backgroundColor: "#eef2ff",
              }}
            >
              <Key size={16} style={{ color: "var(--royal-blue)" }} />
              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--royal-blue)" }}
                >
                  Reset Password
                </p>
                <p className="text-xs text-gray-400">
                  Generate a temporary password
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onToggleStatus(user)}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition hover:shadow-sm"
              style={{
                borderColor:
                  user.status === "Active"
                    ? "var(--accent-red)"
                    : "var(--success-dark)",
                backgroundColor:
                  user.status === "Active" ? "#fff1f2" : "#f0fdf4",
              }}
            >
              {user.status === "Active" ? (
                <Lock size={16} style={{ color: "var(--accent-red)" }} />
              ) : (
                <Unlock size={16} style={{ color: "var(--success-dark)" }} />
              )}
              <div>
                <p
                  className="text-sm font-bold"
                  style={{
                    color:
                      user.status === "Active"
                        ? "var(--accent-red)"
                        : "var(--success-dark)",
                  }}
                >
                  {user.status === "Active"
                    ? "Deactivate Account"
                    : "Activate Account"}
                </p>
                <p className="text-xs text-gray-400">
                  {user.status === "Active"
                    ? "Prevent this user from logging in"
                    : "Restore login access"}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main UserManagement ──────────────────────────────────────────────────────
const UserManagement = () => {
  const [users, setUsers] = useState(ALL_USERS);
  const [activeRole, setActiveRole] = useState("all");
  const [search, setSearch] = useState("");
  const [filterStatus, setFStatus] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddUser = (newUser) => {
    setUsers((us) => [newUser, ...us]);
    setShowAddUser(false);
    showToast(
      `${newUser.firstName} ${newUser.lastName} added as ${newUser.role}`,
    );
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    setUsers((us) =>
      us.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)),
    );
    showToast(
      `${user.firstName} ${user.lastName} ${newStatus === "Active" ? "activated" : "deactivated"}`,
    );
    setViewUser((u) => (u ? { ...u, status: newStatus } : null));
  };

  const handleExport = () => {
    const rows = ["Role,Name,Email,Phone,Status,Joined"];
    filtered.forEach((u) => {
      const name = [u.title, u.firstName, u.lastName].filter(Boolean).join(" ");
      rows.push(
        `${u.role},${name},${u.email},${u.phone || "—"},${u.status},${u.joinDate || "—"}`,
      );
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "AFTS_Users.csv";
    a.click();
    showToast(`${filtered.length} users exported`);
  };

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const q = search.toLowerCase();
        const name = [u.title, u.firstName, u.lastName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const matchSearch =
          !q ||
          name.includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.staffId || "").toLowerCase().includes(q) ||
          (u.studentId || "").toLowerCase().includes(q);
        const matchRole = activeRole === "all" || u.role === activeRole;
        const matchStatus = filterStatus === "All" || u.status === filterStatus;
        return matchSearch && matchRole && matchStatus;
      }),
    [users, search, activeRole, filterStatus],
  );

  const counts = {
    all: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    teacher: users.filter((u) => u.role === "teacher").length,
    student: users.filter((u) => u.role === "student").length,
    parent: users.filter((u) => u.role === "parent").length,
  };

  const activeCount = users.filter((u) => u.status === "Active").length;
  const inactiveCount = users.filter((u) => u.status !== "Active").length;

  const TABS = [
    {
      key: "all",
      label: "All Users",
      count: counts.all,
      color: "var(--dark-gray)",
    },
    {
      key: "admin",
      label: "Admins",
      count: counts.admin,
      color: "var(--accent-red)",
    },
    {
      key: "teacher",
      label: "Teachers",
      count: counts.teacher,
      color: "var(--royal-blue)",
    },
    {
      key: "student",
      label: "Students",
      count: counts.student,
      color: "#7c3aed",
    },
    {
      key: "parent",
      label: "Parents",
      count: counts.parent,
      color: "var(--warning)",
    },
  ];

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
          <CheckCircle2 size={14} /> {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            User Management
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {users.length} total · {activeCount} active · {inactiveCount}{" "}
            inactive
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition"
            style={{
              borderColor: "var(--medium-gray)",
              color: "var(--dark-gray)",
              backgroundColor: "white",
            }}
          >
            <Download size={13} /> Export
          </button>
          <button
            type="button"
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-sm"
            style={{ backgroundColor: "var(--royal-blue)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--royal-blue-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--royal-blue)")
            }
          >
            <Plus size={15} /> Add User
          </button>
        </div>
      </div>

      {/* Role stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {["admin", "teacher", "student", "parent"].map((role) => {
          const rc = ROLE_CONFIG[role];
          const Icon = rc.icon;
          const count = counts[role];
          const active = users.filter(
            (u) => u.role === role && u.status === "Active",
          ).length;
          return (
            <button
              key={role}
              type="button"
              onClick={() => setActiveRole(activeRole === role ? "all" : role)}
              className="bg-white rounded-xl border p-4 text-left shadow-sm hover:shadow-md transition-all"
              style={{
                borderColor:
                  activeRole === role ? rc.color : "var(--medium-gray)",
                borderWidth: activeRole === role ? 2 : 1,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: rc.bg }}
                >
                  <Icon size={18} style={{ color: rc.color }} />
                </div>
                <span
                  className="text-2xl font-black"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {count}
                </span>
              </div>
              <p
                className="text-sm font-bold"
                style={{
                  color: activeRole === role ? rc.color : "var(--dark-gray)",
                }}
              >
                {rc.plural}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{active} active</p>
            </button>
          );
        })}
      </div>

      {/* Role tabs + Search + Filters */}
      <div
        className="bg-white rounded-xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        {/* Tabs */}
        <div
          className="flex border-b overflow-x-auto"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveRole(t.key)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex-shrink-0"
              style={{
                borderColor: activeRole === t.key ? t.color : "transparent",
                color: activeRole === t.key ? t.color : "var(--dark-gray)",
                backgroundColor:
                  activeRole === t.key ? t.color + "08" : undefined,
              }}
            >
              {t.label}
              <span
                className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor:
                    activeRole === t.key
                      ? t.color + "20"
                      : "var(--medium-gray)",
                  color: activeRole === t.key ? t.color : "#6b7280",
                }}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search + controls */}
        <div
          className="flex flex-col sm:flex-row gap-3 p-4 border-b"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, staff ID or student ID…"
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
          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Inactive"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFStatus(f)}
                className="text-xs font-semibold px-3 py-2 rounded-xl transition"
                style={{
                  backgroundColor:
                    filterStatus === f ? "var(--royal-blue)" : "white",
                  color: filterStatus === f ? "white" : "var(--dark-gray)",
                  border: "1px solid var(--medium-gray)",
                }}
              >
                {f}
              </button>
            ))}
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
                  type="button"
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
        </div>

        <div
          className="px-4 py-2 text-xs text-gray-400 border-b"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          Showing <strong>{filtered.length}</strong> of{" "}
          <strong>{users.length}</strong> users
          {(search || filterStatus !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFStatus("All");
              }}
              className="ml-2 font-semibold"
              style={{ color: "var(--accent-red)" }}
            >
              Clear
            </button>
          )}
        </div>

        {/* ── TABLE VIEW ──────────────────────────────────────────────── */}
        {viewMode === "table" && (
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
                  {[
                    "User",
                    "Role",
                    "Identifier",
                    "Status",
                    "Last Login",
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
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-400"
                    >
                      No users match your search
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => {
                    const rc = ROLE_CONFIG[u.role];
                    const ss = STATUS_STYLE[u.status] || STATUS_STYLE.Active;
                    const fullName = [u.title, u.firstName, u.lastName]
                      .filter(Boolean)
                      .join(" ");
                    const identifier = u.staffId || u.studentId || u.email;
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={fullName} role={u.role} size="sm" />
                            <div className="min-w-0">
                              <p
                                className="font-semibold truncate"
                                style={{ color: "var(--dark-gray)" }}
                              >
                                {fullName}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: rc.bg, color: rc.color }}
                          >
                            {rc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          <div className="flex flex-col gap-1">
                            <span className="font-mono truncate max-w-[140px]">
                              {identifier}
                            </span>
                            {u.role === "teacher" && u.teacherRole && (
                              <span
                                className="px-1.5 py-0.5 rounded text-xs font-semibold inline-block truncate max-w-[160px]"
                                style={{
                                  backgroundColor: "#eef2ff",
                                  color: "var(--royal-blue)",
                                  fontSize: "10px",
                                }}
                              >
                                {u.teacherRole}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="flex items-center gap-1.5 text-xs font-semibold"
                            style={{ color: ss.color }}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: ss.dot }}
                            />
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {u.lastLogin || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setViewUser(u)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 transition"
                              style={{ color: "var(--royal-blue)" }}
                              title="View profile"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              className="p-1.5 rounded-lg hover:bg-purple-50 transition"
                              style={{ color: "#7c3aed" }}
                              title="Edit user"
                              onClick={() => setEditUser(u)}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setResetUser(u)}
                              className="p-1.5 rounded-lg hover:bg-yellow-50 transition"
                              style={{ color: "var(--warning)" }}
                              title="Reset password"
                            >
                              <Key size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(u)}
                              className="p-1.5 rounded-lg transition"
                              style={{
                                color:
                                  u.status === "Active"
                                    ? "var(--accent-red)"
                                    : "var(--success-dark)",
                              }}
                              title={
                                u.status === "Active"
                                  ? "Deactivate"
                                  : "Activate"
                              }
                            >
                              {u.status === "Active" ? (
                                <Lock size={14} />
                              ) : (
                                <Unlock size={14} />
                              )}
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
        )}

        {/* ── CARDS VIEW ──────────────────────────────────────────────── */}
        {viewMode === "cards" && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                No users match your search
              </div>
            ) : (
              filtered.map((u) => {
                const rc = ROLE_CONFIG[u.role];
                const ss = STATUS_STYLE[u.status] || STATUS_STYLE.Active;
                const fullName = [u.title, u.firstName, u.lastName]
                  .filter(Boolean)
                  .join(" ");
                const Icon = rc.icon;
                return (
                  <div
                    key={u.id}
                    className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all"
                    style={{ borderColor: "var(--medium-gray)" }}
                  >
                    <div
                      className="h-10 relative"
                      style={{ backgroundColor: rc.color }}
                    >
                      <div className="absolute -bottom-5 left-4">
                        <Avatar name={fullName} role={u.role} />
                      </div>
                    </div>
                    <div className="pt-7 px-4 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <p
                            className="font-black text-sm truncate"
                            style={{ color: "var(--dark-gray)" }}
                          >
                            {fullName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {u.email}
                          </p>
                        </div>
                        <span
                          className="text-xs font-semibold px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0 flex items-center gap-1"
                          style={{ backgroundColor: ss.bg, color: ss.color }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: ss.dot }}
                          />
                          {u.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ backgroundColor: rc.bg, color: rc.color }}
                        >
                          <Icon size={10} className="inline mr-1" />
                          {rc.label}
                        </span>
                        {u.role === "teacher" && u.teacherRole && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded font-semibold"
                            style={{
                              backgroundColor: "#eef2ff",
                              color: "var(--royal-blue)",
                              fontSize: "10px",
                            }}
                          >
                            {u.teacherRole}
                          </span>
                        )}
                      </div>
                      <div
                        className="flex items-center gap-1 mt-3 pt-3 border-t"
                        style={{ borderColor: "var(--medium-gray)" }}
                      >
                        <button
                          type="button"
                          onClick={() => setViewUser(u)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg"
                          style={{
                            backgroundColor: "#eef2ff",
                            color: "var(--royal-blue)",
                          }}
                        >
                          <Eye size={11} /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditUser(u)}
                          className="flex items-center justify-center p-1.5 rounded-lg"
                          style={{
                            backgroundColor: "#f5f3ff",
                            color: "#7c3aed",
                          }}
                          title="Edit user"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setResetUser(u)}
                          className="flex items-center justify-center p-1.5 rounded-lg"
                          style={{
                            backgroundColor: "#fffbeb",
                            color: "var(--warning)",
                          }}
                        >
                          <Key size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          className="flex items-center justify-center p-1.5 rounded-lg"
                          style={{
                            backgroundColor:
                              u.status === "Active" ? "#fff1f2" : "#f0fdf4",
                            color:
                              u.status === "Active"
                                ? "var(--accent-red)"
                                : "var(--success-dark)",
                          }}
                        >
                          {u.status === "Active" ? (
                            <Lock size={13} />
                          ) : (
                            <Unlock size={13} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddUser && (
        <AddUserModal
          onSave={handleAddUser}
          onClose={() => setShowAddUser(false)}
        />
      )}
      {editUser && (
        <EditUserModal
          user={editUser}
          onSave={(updated) => {
            setUsers((us) =>
              us.map((u) => (u.id === updated.id ? updated : u)),
            );
            setEditUser(null);
            showToast(`${updated.firstName} ${updated.lastName} updated`);
          }}
          onClose={() => setEditUser(null)}
        />
      )}
      {viewUser && (
        <ProfileDrawer
          user={viewUser}
          onClose={() => setViewUser(null)}
          onReset={(u) => {
            setViewUser(null);
            setResetUser(u);
          }}
          onToggleStatus={(u) => {
            handleToggleStatus(u);
          }}
        />
      )}
      {resetUser && (
        <ResetPasswordModal
          user={resetUser}
          onClose={() => {
            setResetUser(null);
            showToast(
              "Password reset for " +
                resetUser.firstName +
                " " +
                resetUser.lastName,
            );
          }}
        />
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default UserManagement;
