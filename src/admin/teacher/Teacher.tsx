// src/admin/teacher/Teacher.jsx
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
  BookOpen,
  Filter,
  Download,
  Upload,
  LayoutGrid,
  LayoutList,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  Briefcase,
  Award,
  ChevronDown,
  GraduationCap,
  Shield,
} from "lucide-react";

// ─── Mock teacher data ────────────────────────────────────────────────────────
const INITIAL_TEACHERS = [
  {
    id: 1,
    staffId: "AFSHTS/TCH/001",
    title: "Capt",
    firstName: "Kwabena",
    lastName: "Adjei",
    gender: "Male",
    subject: "Mathematics",
    department: "Mathematics",
    qualification: "BSc Mathematics",
    employmentType: "Full-time",
    yearGroup: "form1",
    formClass: "Form 3 Science A",
    status: "Active",
    phone: "0244123456",
    email: "k.adjei@afts.edu.gh",
    address: "Uaddara Barracks, Kumasi",
    joinDate: "2018-09-01",
  },
  {
    id: 2,
    staffId: "AFSHTS/TCH/002",
    title: "Mrs",
    firstName: "Ama",
    lastName: "Eshun",
    gender: "Female",
    subject: "English Language",
    department: "English",
    qualification: "BA English",
    employmentType: "Full-time",
    yearGroup: "form1",
    formClass: "Form 2 Arts A",
    status: "Active",
    phone: "0277654321",
    email: "a.eshun@afts.edu.gh",
    address: "Asokwa, Kumasi",
    joinDate: "2019-01-15",
  },
  {
    id: 3,
    staffId: "AFSHTS/TCH/003",
    title: "Dr",
    firstName: "Kofi",
    lastName: "Osei",
    gender: "Male",
    subject: "Integrated Science",
    department: "Science",
    qualification: "MSc Biology",
    employmentType: "Full-time",
    yearGroup: "form3",
    formClass: "",
    status: "Active",
    phone: "0200112233",
    email: "k.osei@afts.edu.gh",
    address: "Bantama, Kumasi",
    joinDate: "2017-09-01",
  },
  {
    id: 4,
    staffId: "AFSHTS/TCH/004",
    title: "Sgt",
    firstName: "Efua",
    lastName: "Frimpong",
    gender: "Female",
    subject: "ICT",
    department: "Technical",
    qualification: "BSc Computer Science",
    employmentType: "Full-time",
    yearGroup: "form1",
    formClass: "Form 1 Science A",
    status: "Active",
    phone: "0244987654",
    email: "e.frimpong@afts.edu.gh",
    address: "Nhyiaeso, Kumasi",
    joinDate: "2020-09-01",
  },
  {
    id: 5,
    staffId: "AFSHTS/TCH/005",
    title: "Mr",
    firstName: "Nana",
    lastName: "Boateng",
    gender: "Male",
    subject: "Social Studies",
    department: "Social Studies",
    qualification: "BA Social Studies",
    employmentType: "Full-time",
    yearGroup: "form1",
    formClass: "",
    status: "Active",
    phone: "0207654321",
    email: "n.boateng@afts.edu.gh",
    address: "Suame, Kumasi",
    joinDate: "2016-09-01",
  },
  {
    id: 6,
    staffId: "AFSHTS/TCH/006",
    title: "Mrs",
    firstName: "Abena",
    lastName: "Mensah",
    gender: "Female",
    subject: "Physics",
    department: "Science",
    qualification: "BSc Physics",
    employmentType: "Full-time",
    yearGroup: "form3",
    formClass: "Form 3 Science B",
    status: "Active",
    phone: "0244555666",
    email: "a.mensah@afts.edu.gh",
    address: "Oforikrom, Kumasi",
    joinDate: "2021-01-10",
  },
  {
    id: 7,
    staffId: "AFSHTS/TCH/007",
    title: "Lt",
    firstName: "Kwame",
    lastName: "Asare",
    gender: "Male",
    subject: "Chemistry",
    department: "Science",
    qualification: "BSc Chemistry",
    employmentType: "Full-time",
    yearGroup: "form1",
    formClass: "",
    status: "Active",
    phone: "0277112233",
    email: "k.asare@afts.edu.gh",
    address: "Dichemso, Kumasi",
    joinDate: "2019-09-01",
  },
  {
    id: 8,
    staffId: "AFSHTS/TCH/008",
    title: "Mr",
    firstName: "Yaw",
    lastName: "Tawiah",
    gender: "Male",
    subject: "Biology",
    department: "Science",
    qualification: "BSc Biology",
    employmentType: "Full-time",
    yearGroup: "form3",
    formClass: "Form 2 Science B",
    status: "Active",
    phone: "0244321654",
    email: "y.tawiah@afts.edu.gh",
    address: "Kumasi Central",
    joinDate: "2020-01-05",
  },
  {
    id: 9,
    staffId: "AFSHTS/TCH/009",
    title: "Mrs",
    firstName: "Akua",
    lastName: "Bonsu",
    gender: "Female",
    subject: "Economics",
    department: "Business",
    qualification: "BA Economics",
    employmentType: "Full-time",
    yearGroup: "form1",
    formClass: "Form 3 Business A",
    status: "Active",
    phone: "0207111222",
    email: "a.bonsu@afts.edu.gh",
    address: "Ayigya, Kumasi",
    joinDate: "2018-01-15",
  },
  {
    id: 10,
    staffId: "AFSHTS/TCH/010",
    title: "Mr",
    firstName: "Fiifi",
    lastName: "Annan",
    gender: "Male",
    subject: "Accounting",
    department: "Business",
    qualification: "BSc Accounting",
    employmentType: "Part-time",
    yearGroup: "form3",
    formClass: "",
    status: "Active",
    phone: "0244888999",
    email: "f.annan@afts.edu.gh",
    address: "Tafo, Kumasi",
    joinDate: "2022-09-01",
  },
  {
    id: 11,
    staffId: "AFSHTS/TCH/011",
    title: "Cpl",
    firstName: "Esi",
    lastName: "Darkwah",
    gender: "Female",
    subject: "Technical Drawing",
    department: "Technical",
    qualification: "BSc Civil Engineering",
    employmentType: "Full-time",
    yearGroup: "form1",
    formClass: "Form 2 Tech A",
    status: "Active",
    phone: "0277888777",
    email: "e.darkwah@afts.edu.gh",
    address: "Manhyia, Kumasi",
    joinDate: "2021-09-01",
  },
  {
    id: 12,
    staffId: "AFSHTS/TCH/012",
    title: "Mr",
    firstName: "Ekow",
    lastName: "Sarpong",
    gender: "Male",
    subject: "Geography",
    department: "Social Studies",
    qualification: "BA Geography",
    employmentType: "Full-time",
    yearGroup: "form3",
    formClass: "Form 1 Arts B",
    status: "Inactive",
    phone: "0244666777",
    email: "e.sarpong@afts.edu.gh",
    address: "Kwadaso, Kumasi",
    joinDate: "2017-01-10",
  },
  {
    id: 13,
    staffId: "AFSHTS/TCH/013",
    title: "Mrs",
    firstName: "Adwoa",
    lastName: "Acheampong",
    gender: "Female",
    subject: "Literature",
    department: "English",
    qualification: "MA Literature",
    employmentType: "Full-time",
    yearGroup: "form1",
    formClass: "Form 1 Arts A",
    status: "Active",
    phone: "0207567890",
    email: "a.acheampong@afts.edu.gh",
    address: "Patasi, Kumasi",
    joinDate: "2020-09-01",
  },
  {
    id: 14,
    staffId: "AFSHTS/TCH/014",
    title: "Mr",
    firstName: "Kojo",
    lastName: "Owusu",
    gender: "Male",
    subject: "Government",
    department: "Social Studies",
    qualification: "BA Political Science",
    employmentType: "Part-time",
    yearGroup: "form3",
    formClass: "",
    status: "Active",
    phone: "0277345678",
    email: "k.owusu@afts.edu.gh",
    address: "Suame, Kumasi",
    joinDate: "2023-01-15",
  },
  {
    id: 15,
    staffId: "AFSHTS/TCH/015",
    title: "Dr",
    firstName: "Yaa",
    lastName: "Agyemang",
    gender: "Female",
    subject: "Core Mathematics",
    department: "Mathematics",
    qualification: "PhD Mathematics",
    employmentType: "Full-time",
    yearGroup: "form1",
    formClass: "Form 2 Science A",
    status: "Active",
    phone: "0244567890",
    email: "y.agyemang@afts.edu.gh",
    address: "Asokwa, Kumasi",
    joinDate: "2015-09-01",
  },
];

const DEPARTMENTS = [
  "Mathematics",
  "English",
  "Science",
  "Social Studies",
  "Technical",
  "Business",
  "Arts",
  "Physical Education",
];
const SUBJECTS = [
  "Mathematics",
  "Core Mathematics",
  "English Language",
  "Integrated Science",
  "Social Studies",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT",
  "Economics",
  "Accounting",
  "Technical Drawing",
  "Geography",
  "Literature",
  "Government",
  "History",
  "French",
  "Physical Education",
];
const QUALIFICATIONS = [
  "BSc",
  "BA",
  "MSc",
  "MA",
  "PhD",
  "HND",
  "Diploma",
  "Certificate",
];
const EMP_TYPES = ["Full-time", "Part-time", "Contract", "National Service"];
const TITLES = [
  "Mr",
  "Mrs",
  "Miss",
  "Dr",
  "Prof",
  "Rev",
  "Capt",
  "Lt",
  "Sgt",
  "Cpl",
  "WOI",
];
const TRACKS = ["A", "B", "A & B"];
const STATUSES = ["Active", "Inactive", "On Leave"];

const EMPTY = {
  staffId: "",
  title: "Mr",
  firstName: "",
  lastName: "",
  gender: "Male",
  subject: "Mathematics",
  department: "Mathematics",
  qualification: "BSc",
  employmentType: "Full-time",
  yearGroup: "form1",
  formClass: "",
  status: "Active",
  phone: "",
  email: "",
  address: "",
  joinDate: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusStyle = (s) =>
  ({
    Active: { bg: "#f0fdf4", color: "var(--success-dark)" },
    Inactive: { bg: "#fff1f2", color: "var(--accent-red)" },
    "On Leave": { bg: "#fffbeb", color: "var(--warning)" },
  })[s] || { bg: "#f3f4f6", color: "#6b7280" };

const Avatar = ({ name, size = "md" }) => {
  const ini = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const clrs = [
    "#0e07dd",
    "#dc2626",
    "#7c3aed",
    "#16a34a",
    "#ca8a04",
    "#0369a1",
  ];
  const bg = clrs[(name || "").charCodeAt(0) % clrs.length];
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

// ─── Teacher Form Modal ───────────────────────────────────────────────────────
const TeacherFormModal = ({ teacher, onSave, onClose }) => {
  const isEdit = !!teacher?.id;
  const [form, setForm] = useState(teacher || EMPTY);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.staffId.trim()) e.staffId = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
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
                {isEdit ? "Edit Teacher" : "Add New Teacher"}
              </p>
              <p className="text-blue-200 text-xs">
                {isEdit ? form.staffId : "Complete all required fields"}
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

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Personal */}
          <div>
            <p
              className="text-xs font-black uppercase tracking-widest mb-3"
              style={{ color: "var(--royal-blue)", opacity: 0.7 }}
            >
              Personal Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FInput
                label="Title"
                value={form.title}
                onChange={(v) => set("title", v)}
                options={TITLES}
              />
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
                label="Staff ID"
                value={form.staffId}
                onChange={(v) => set("staffId", v)}
                required
                error={errors.staffId}
              />
              <FInput
                label="Gender"
                value={form.gender}
                onChange={(v) => set("gender", v)}
                options={["Male", "Female"]}
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
                label="Phone"
                value={form.phone}
                onChange={(v) => set("phone", v)}
                required
                error={errors.phone}
              />
              <FInput
                label="Address"
                value={form.address}
                onChange={(v) => set("address", v)}
              />
              <FInput
                label="Join Date"
                value={form.joinDate}
                onChange={(v) => set("joinDate", v)}
                type="date"
              />
              <FInput
                label="Status"
                value={form.status}
                onChange={(v) => set("status", v)}
                options={STATUSES}
              />
            </div>
          </div>

          {/* Academic */}
          <div>
            <p
              className="text-xs font-black uppercase tracking-widest mb-3"
              style={{ color: "var(--royal-blue)", opacity: 0.7 }}
            >
              Academic & School Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FInput
                label="Subject Taught"
                value={form.subject}
                onChange={(v) => set("subject", v)}
                options={SUBJECTS}
              />
              <FInput
                label="Department"
                value={form.department}
                onChange={(v) => set("department", v)}
                options={DEPARTMENTS}
              />
              <FInput
                label="Qualification"
                value={form.qualification}
                onChange={(v) => set("qualification", v)}
                options={QUALIFICATIONS}
              />
              <FInput
                label="Employment Type"
                value={form.employmentType}
                onChange={(v) => set("employmentType", v)}
                options={EMP_TYPES}
              />
              <FInput
                label="Year Group"
                value={form.yearGroup}
                onChange={(v) => set("yearGroup", v)}
                options={TRACKS}
              />
              <FInput
                label="Form Class (if any)"
                value={form.formClass}
                onChange={(v) => set("formClass", v)}
              />
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t flex-shrink-0"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
            borderRadius: "0 0 1rem 1rem",
          }}
        >
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
            <Save size={14} /> {isEdit ? "Save Changes" : "Add Teacher"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirm ───────────────────────────────────────────────────────────
const DeleteConfirm = ({ teacher, onConfirm, onClose }) => (
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
        Remove Teacher?
      </h3>
      <p className="text-sm text-gray-500 mb-1">
        <strong>
          {teacher.title} {teacher.firstName} {teacher.lastName}
        </strong>{" "}
        · {teacher.staffId}
      </p>
      <p className="text-xs text-gray-400 mb-6">
        This will remove the teacher's account and all associated records.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          type="button"
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
          type="button"
          onClick={onConfirm}
          className="px-5 py-2 text-sm font-bold text-white rounded-xl"
          style={{ backgroundColor: "var(--accent-red)" }}
        >
          Yes, Remove
        </button>
      </div>
    </div>
  </div>
);

// ─── Profile Drawer ───────────────────────────────────────────────────────────
const ProfileDrawer = ({ teacher, onEdit, onClose }) => {
  if (!teacher) return null;
  const ss = statusStyle(teacher.status);
  const fullName = `${teacher.title} ${teacher.firstName} ${teacher.lastName}`;
  return (
    <div
      className="fixed inset-0 z-50 flex"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto flex flex-col shadow-2xl">
        <div
          className="px-5 py-4 flex items-center justify-between flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
          }}
        >
          <p className="text-white font-black">Teacher Profile</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Edit3 size={12} /> Edit
            </button>
            <button
              type="button"
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
            <Avatar name={fullName} size="lg" />
            <div>
              <h2
                className="font-black text-lg"
                style={{ color: "var(--dark-gray)" }}
              >
                {fullName}
              </h2>
              <p className="text-xs font-mono text-gray-400">
                {teacher.staffId}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: ss.bg, color: ss.color }}
                >
                  {teacher.status}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: "#eef2ff",
                    color: "var(--royal-blue)",
                  }}
                >
                  {teacher.department}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: "#fffbeb",
                    color: "var(--warning)",
                  }}
                >
                  {teacher.yearGroup || "Form 1"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <div
              className="text-center p-3 rounded-xl"
              style={{ backgroundColor: "var(--light-gray)" }}
            ></div>
            <div
              className="text-center p-3 rounded-xl"
              style={{ backgroundColor: "var(--light-gray)" }}
            >
              <p
                className="text-lg font-black"
                style={{ color: "var(--success-dark)" }}
              >
                {teacher.qualification}
              </p>
              <p className="text-xs text-gray-400">Qualification</p>
            </div>
            <div
              className="text-center p-3 rounded-xl"
              style={{ backgroundColor: "var(--light-gray)" }}
            >
              <p
                className="text-lg font-black"
                style={{ color: "var(--warning)" }}
              >
                {teacher.joinDate
                  ? new Date().getFullYear() -
                    new Date(teacher.joinDate).getFullYear()
                  : "—"}
              </p>
              <p className="text-xs text-gray-400">Yrs Service</p>
            </div>
          </div>

          {/* Form class info */}
          <div
            className="bg-white rounded-xl border p-4"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {teacher.formClass && (
              <p className="text-xs font-semibold" style={{ color: "#7c3aed" }}>
                Form Teacher: {teacher.formClass}
              </p>
            )}
          </div>

          {/* Info rows */}
          {[
            { icon: User, label: "Full Name", value: fullName },
            { icon: Mail, label: "Email", value: teacher.email },
            { icon: Phone, label: "Phone", value: teacher.phone },
            { icon: BookOpen, label: "Subject", value: teacher.subject },
            { icon: Briefcase, label: "Department", value: teacher.department },
            {
              icon: Award,
              label: "Qualification",
              value: teacher.qualification,
            },
            {
              icon: User,
              label: "Employment Type",
              value: teacher.employmentType,
            },
            { icon: MapPin, label: "Address", value: teacher.address },
            {
              icon: Calendar,
              label: "Joined",
              value: teacher.joinDate
                ? new Date(teacher.joinDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—",
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
                  {value || "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Teacher Component ───────────────────────────────────────────────────
const Teacher = () => {
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [search, setSearch] = useState("");
  const [filterDept, setFD] = useState("All");
  const [filterStatus, setFS] = useState("All");
  const [filterYearGroup, setFYG] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTeacher, setEditT] = useState(null);
  const [deleteTeacher, setDeleteT] = useState(null);
  const [viewTeacher, setViewT] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(
    () =>
      teachers.filter((t) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          t.firstName.toLowerCase().includes(q) ||
          t.lastName.toLowerCase().includes(q) ||
          t.staffId.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q);
        const matchDept = filterDept === "All" || t.department === filterDept;
        const matchStatus = filterStatus === "All" || t.status === filterStatus;
        const matchYearGroup =
          filterYearGroup === "All" || t.yearGroup.includes(filterYearGroup);
        return matchSearch && matchDept && matchStatus && matchYearGroup;
      }),
    [teachers, search, filterDept, filterStatus, filterYearGroup],
  );

  const handleSave = (form) => {
    if (form.id) {
      setTeachers((tt) => tt.map((t) => (t.id === form.id ? form : t)));
      showToast(`${form.title} ${form.firstName} ${form.lastName} updated`);
    } else {
      setTeachers((tt) => [{ ...form, id: Date.now() }, ...tt]);
      showToast(`${form.title} ${form.firstName} ${form.lastName} added`);
    }
    setShowForm(false);
    setEditT(null);
  };

  const handleDelete = () => {
    setTeachers((tt) => tt.filter((t) => t.id !== deleteTeacher.id));
    showToast(
      `${deleteTeacher.firstName} ${deleteTeacher.lastName} removed`,
      "error",
    );
    setDeleteT(null);
    setSelected((sel) => sel.filter((id) => id !== deleteTeacher.id));
  };

  const handleBulkDelete = () => {
    setTeachers((tt) => tt.filter((t) => !selected.includes(t.id)));
    showToast(`${selected.length} teacher(s) removed`, "error");
    setSelected([]);
  };

  const handleSampleGuide = () => {
    const lines = [
      "============================================",
      "AFSHTS TEACHER IMPORT — SAMPLE GUIDE",
      "============================================",
      "",
      "CSV FORMAT (first row must be the header):",
      "title,firstName,lastName,email,phone,staffId,department,teacherRole,formClass",
      "",
      "EXAMPLE ROWS:",
      "Mr,Kwabena,Adjei,k.adjei@afshts.edu.gh,0244123456,AFSHTS/TCH/001,Mathematics,Subject Teacher,",
      "Mrs,Ama,Eshun,a.eshun@afshts.edu.gh,0277654321,AFSHTS/TCH/002,English,Subject Teacher + Form Teacher,Form 1 Arts A",
      "Dr,Kofi,Osei,k.osei@afshts.edu.gh,0200112233,AFSHTS/TCH/003,Science,Subject Teacher + HOD,",
      "",
      "TEACHER ROLE OPTIONS (pick exactly one):",
      "  - Subject Teacher",
      "  - Subject Teacher + Form Teacher",
      "  - Subject Teacher + HOD",
      "  - Subject Teacher + Form Teacher + HOD",
      "  - Form Teacher + HOD",
      "  - Examiner",
      "",
      "TITLE OPTIONS:  Mr  Mrs  Ms  Dr  Prof  Rev  Col  Maj  Capt  WO  WOI",
      "",
      "STAFF ID FORMAT:  AFSHTS/TCH/001",
      "",
      "NOTES:",
      "  - formClass only required for Form Teacher roles.",
      "  - Email must be unique per teacher.",
      "  - Default password is sent to teacher email after account creation.",
      "============================================",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "AFSHTS_Teacher_Sample_Guide.txt";
    a.click();
    showToast("Teacher sample guide downloaded");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    showToast(
      `"${file.name}" ready — import will be processed by the backend`,
      "info",
    );
    e.target.value = "";
  };

  const handleExport = () => {
    const rows = [
      "Staff ID,Title,First Name,Last Name,Gender,Subject,Department,Qualification,Employment,Year Group,Status,Email,Phone",
    ];
    filtered.forEach((t) =>
      rows.push(
        `${t.staffId},${t.title},${t.firstName},${t.lastName},${t.gender},${t.subject},${t.department},${t.qualification},${t.employmentType},${t.yearGroup},${t.status},${t.email},${t.phone}`,
      ),
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "AFTS_Teachers.csv";
    a.click();
    showToast("Teacher list exported");
  };

  const toggleSelect = (id) =>
    setSelected((sel) =>
      sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id],
    );
  const toggleAll = () =>
    setSelected((sel) =>
      sel.length === filtered.length ? [] : filtered.map((t) => t.id),
    );
  const allSelected =
    filtered.length > 0 && selected.length === filtered.length;

  const total = teachers.length;
  const active = teachers.filter((t) => t.status === "Active").length;
  const fullTime = teachers.filter(
    (t) => t.employmentType === "Full-time",
  ).length;
  const activeFilters = [filterDept, filterStatus, filterYearGroup].filter(
    (f) => f !== "All",
  ).length;

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
          }}
        >
          {toast.type === "error" ? (
            <Trash2 size={14} />
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
            Teachers & Staff
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {total} staff · {active} active
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
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
          <label
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition cursor-pointer"
            style={{
              borderColor: "var(--royal-blue)",
              color: "var(--royal-blue)",
              backgroundColor: "#eef2ff",
            }}
          >
            <Upload size={13} /> Import CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImport}
            />
          </label>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border"
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
              type="button"
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-white"
              style={{ backgroundColor: "var(--accent-red)" }}
            >
              <Trash2 size={13} /> Remove {selected.length}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setEditT(null);
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
            <Plus size={15} /> Add Teacher
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Staff",
            value: total,
            color: "var(--royal-blue)",
            icon: Users,
          },
          {
            label: "Active",
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

      {/* Search + Filters */}
      <div
        className="bg-white rounded-xl border shadow-sm p-4"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, staff ID, subject or email…"
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
          <button
            type="button"
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
          <div
            className="flex rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {[
              ["table", LayoutList],
              ["cards", LayoutGrid],
            ].map(([mode, Icon]) => (
              <button
                type="button"
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

        {showFilters && (
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {[
              {
                label: "Department",
                value: filterDept,
                set: setFD,
                opts: ["All", ...DEPARTMENTS],
              },
              {
                label: "Status",
                value: filterStatus,
                set: setFS,
                opts: ["All", ...STATUSES],
              },
              {
                label: "Year Group",
                value: filterYearGroup,
                set: setFYG,
                opts: ["All", "form1", "form2", "form3"],
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
            <strong>{total}</strong> staff
          </p>
          {(search || activeFilters > 0) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFD("All");
                setFS("All");
                setFYG("All");
              }}
              className="text-xs font-semibold"
              style={{ color: "var(--accent-red)" }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── TABLE VIEW ───────────────────────────────────────────────────────── */}
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
                      className="w-4 h-4"
                      style={{ accentColor: "var(--royal-blue)" }}
                    />
                  </th>
                  {[
                    "Teacher",
                    "Staff ID",
                    "Subject",
                    "Department",
                    "Year Group",
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
                      colSpan={9}
                      className="px-4 py-12 text-center text-gray-400"
                    >
                      No teachers match your search
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => {
                    const ss = statusStyle(t.status);
                    const isSel = selected.includes(t.id);
                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-gray-50 transition"
                        style={{
                          backgroundColor: isSel ? "#eef2ff" : undefined,
                        }}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSel}
                            onChange={() => toggleSelect(t.id)}
                            className="w-4 h-4"
                            style={{ accentColor: "var(--royal-blue)" }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={`${t.firstName} ${t.lastName}`}
                              size="sm"
                            />
                            <div>
                              <p
                                className="font-semibold"
                                style={{ color: "var(--dark-gray)" }}
                              >
                                {t.title} {t.firstName} {t.lastName}
                              </p>
                              <p className="text-xs text-gray-400">
                                {t.gender}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">
                          {t.staffId}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {t.subject}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {t.department}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{
                              backgroundColor:
                                t.yearGroup === "A"
                                  ? "#fefce8"
                                  : t.yearGroup === "B"
                                    ? "#f0fdf4"
                                    : "#eef2ff",
                              color:
                                t.yearGroup === "A"
                                  ? "#854d0e"
                                  : t.yearGroup === "B"
                                    ? "var(--success-dark)"
                                    : "var(--royal-blue)",
                            }}
                          >
                            {t.yearGroup}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded"
                            style={{ backgroundColor: ss.bg, color: ss.color }}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setViewT(t)}
                              title="View"
                              className="p-1.5 rounded-lg hover:bg-blue-50"
                              style={{ color: "var(--royal-blue)" }}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditT(t);
                                setShowForm(true);
                              }}
                              title="Edit"
                              className="p-1.5 rounded-lg hover:bg-yellow-50"
                              style={{ color: "var(--warning)" }}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteT(t)}
                              title="Delete"
                              className="p-1.5 rounded-lg hover:bg-red-50"
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

      {/* ── CARDS VIEW ───────────────────────────────────────────────────────── */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No teachers match your search
            </div>
          ) : (
            filtered.map((t) => {
              const ss = statusStyle(t.status);
              const isSel = selected.includes(t.id);
              return (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all"
                  style={{
                    borderColor: isSel
                      ? "var(--royal-blue)"
                      : "var(--medium-gray)",
                  }}
                >
                  <div
                    className="h-12 relative"
                    style={{
                      background:
                        "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggleSelect(t.id)}
                      className="absolute top-2 right-2 w-4 h-4"
                      style={{ accentColor: "white" }}
                    />
                    <div className="absolute -bottom-5 left-4">
                      <Avatar name={`${t.firstName} ${t.lastName}`} />
                    </div>
                  </div>
                  <div className="pt-7 px-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p
                          className="font-black text-sm truncate"
                          style={{ color: "var(--dark-gray)" }}
                        >
                          {t.title} {t.firstName} {t.lastName}
                        </p>
                        <p className="text-xs font-mono text-gray-400">
                          {t.staffId}
                        </p>
                      </div>
                      <span
                        className="text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ml-2"
                        style={{ backgroundColor: ss.bg, color: ss.color }}
                      >
                        {t.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: "#eef2ff",
                          color: "var(--royal-blue)",
                        }}
                      >
                        {t.subject}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}
                      >
                        {t.department}
                      </span>
                      {t.formClass && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: "#f0fdf4",
                            color: "var(--success-dark)",
                          }}
                        >
                          Form Teacher
                        </span>
                      )}
                    </div>
                    <div className="mt-3"></div>
                    <div
                      className="flex items-center gap-1 mt-3 pt-3 border-t"
                      style={{ borderColor: "var(--medium-gray)" }}
                    >
                      <button
                        type="button"
                        onClick={() => setViewT(t)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg"
                        style={{
                          backgroundColor: "#eef2ff",
                          color: "var(--royal-blue)",
                        }}
                      >
                        <Eye size={12} /> View
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditT(t);
                          setShowForm(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg"
                        style={{
                          backgroundColor: "#fffbeb",
                          color: "var(--warning)",
                        }}
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteT(t)}
                        className="flex items-center justify-center p-1.5 rounded-lg"
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

      {/* Modals */}
      {showForm && (
        <TeacherFormModal
          teacher={editTeacher}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditT(null);
          }}
        />
      )}
      {deleteTeacher && (
        <DeleteConfirm
          teacher={deleteTeacher}
          onConfirm={handleDelete}
          onClose={() => setDeleteT(null)}
        />
      )}
      {viewTeacher && (
        <ProfileDrawer
          teacher={viewTeacher}
          onEdit={() => {
            setEditT(viewTeacher);
            setViewT(null);
            setShowForm(true);
          }}
          onClose={() => setViewT(null)}
        />
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default Teacher;
