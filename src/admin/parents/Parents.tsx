// src/admin/parents/Parents.jsx
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
  UserCheck,
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
  MessageSquare,
  ChevronDown,
  GraduationCap,
} from "lucide-react";

// ─── Mock data ─────────────────────────────────────────────────────────────
// ─── Data from central source ─────────────────────────────────────────────────
import {
  PARENTS as INITIAL_PARENTS,
  STUDENTS,
  PARENT_CHILDREN,
} from "../data/adminData";

// Build children lookup from STUDENTS
const CHILDREN_LOOKUP = STUDENTS.reduce((acc, s) => {
  acc[s.studentId] = {
    name: `${s.firstName} ${s.lastName}`,
    class: s.formClass,
    course: s.course,
  };
  return acc;
}, {});

// Build parent → children by studentId list (for display in form & drawer)
const getChildrenByParentId = (parentId) =>
  STUDENTS.filter((s) => s.parentId === parentId);

const TITLES = ["Mr", "Mrs", "Miss", "Dr", "Prof", "Rev"];
const STATUSES = ["Active", "Inactive"];

const EMPTY = {
  title: "Mr",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  occupation: "",
  address: "",
  status: "Active",
  children: [],
  registeredDate: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────
const statusStyle = (s) =>
  ({
    Active: { bg: "#f0fdf4", color: "var(--success-dark)" },
    Inactive: { bg: "#fff1f2", color: "var(--accent-red)" },
  })[s] || { bg: "#f3f4f6", color: "#6b7280" };

const Avatar = ({ name, size = "md" }) => {
  const ini = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const clrs = [
    "#5b21b6",
    "#2563eb",
    "#16a34a",
    "#dc2626",
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

// ─── Parent Form Modal ─────────────────────────────────────────────────────
const ParentFormModal = ({ parent, onSave, onClose }) => {
  const isEdit = !!parent?.id;
  const [form, setForm] = useState(parent || EMPTY);
  const [errors, setErrors] = useState({});
  const [childInput, setChildInput] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Children linked to this parent derived from STUDENTS by parentId
  const linkedChildren = STUDENTS.filter((s) => s.parentId === form.id);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Note: adding/removing children in the parent form is informational only
  // in the real app this would update the student's parentId
  const addChild = () => {
    setChildInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            background: "linear-gradient(135deg,#5b21b6,#4c1d95)",
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
                {isEdit ? "Edit Parent" : "Register New Parent"}
              </p>
              <p className="text-purple-200 text-xs">
                {isEdit ? form.email : "Complete all required fields"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-200"
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
              className="text-xs font-black uppercase tracking-widest mb-3 px-1"
              style={{ color: "#7c3aed", opacity: 0.7 }}
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
                label="Occupation"
                value={form.occupation}
                onChange={(v) => set("occupation", v)}
              />
              <div className="sm:col-span-2">
                <FInput
                  label="Address"
                  value={form.address}
                  onChange={(v) => set("address", v)}
                />
              </div>
              <FInput
                label="Status"
                value={form.status}
                onChange={(v) => set("status", v)}
                options={STATUSES}
              />
              <FInput
                label="Registered Date"
                value={form.registeredDate}
                onChange={(v) => set("registeredDate", v)}
                type="date"
              />
            </div>
          </div>

          {/* Children */}
          <div>
            <p
              className="text-xs font-black uppercase tracking-widest mb-3 px-1"
              style={{ color: "#7c3aed", opacity: 0.7 }}
            >
              Linked Children
            </p>
            <div className="flex gap-2 mb-3">
              <input
                value={childInput}
                onChange={(e) => setChildInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addChild()}
                placeholder="Enter Student ID e.g. AFTS/2024/001"
                className="flex-1 px-3 py-2 text-sm rounded-lg border-2 outline-none"
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
              <button
                type="button"
                onClick={addChild}
                className="px-4 py-2 text-sm font-bold text-white rounded-lg"
                style={{ backgroundColor: "#7c3aed" }}
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {linkedChildren.length === 0 ? (
                <p
                  className="text-xs text-gray-400 text-center py-4 border rounded-lg"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  No children linked yet
                </p>
              ) : (
                linkedChildren.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{
                      borderColor: "var(--medium-gray)",
                      backgroundColor: "var(--light-gray)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
                        style={{ backgroundColor: "#7c3aed" }}
                      >
                        {s.firstName[0]}
                        {s.lastName[0]}
                      </div>
                      <div>
                        <p
                          className="text-xs font-bold"
                          style={{ color: "var(--dark-gray)" }}
                        >
                          {s.firstName} {s.lastName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {s.formClass} · {s.course}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-400">
                      {s.studentId}
                    </span>
                  </div>
                ))
              )}
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
            style={{ backgroundColor: "#5b21b6" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#4c1d95")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#5b21b6")
            }
          >
            <Save size={14} /> {isEdit ? "Save Changes" : "Register Parent"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirm ────────────────────────────────────────────────────────
const DeleteConfirm = ({ parent, onConfirm, onClose }) => (
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
        Remove Parent?
      </h3>
      <p className="text-sm text-gray-500 mb-1">
        <strong>
          {parent.title} {parent.firstName} {parent.lastName}
        </strong>
      </p>
      <p className="text-xs text-gray-400 mb-6">
        This will remove the parent account. Their children's records will not
        be affected.
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
          Yes, Remove
        </button>
      </div>
    </div>
  </div>
);

// ─── Profile Drawer ────────────────────────────────────────────────────────
const ProfileDrawer = ({ parent, onEdit, onClose }) => {
  if (!parent) return null;
  const ss = statusStyle(parent.status);
  const fullName = `${parent.title} ${parent.firstName} ${parent.lastName}`;

  return (
    <div
      className="fixed inset-0 z-50 flex"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#5b21b6,#4c1d95)" }}
        >
          <p className="text-white font-black">Parent Profile</p>
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
              className="text-white hover:text-purple-200"
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
              <p className="text-xs text-gray-400">{parent.email}</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: ss.bg, color: ss.color }}
                >
                  {parent.status}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}
                >
                  👨‍👩‍👧 {getChildrenByParentId(parent.id).length} child
                  {getChildrenByParentId(parent.id).length !== 1 ? "ren" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="text-center p-3 rounded-xl"
              style={{ backgroundColor: "var(--light-gray)" }}
            >
              <p className="text-xl font-black" style={{ color: "#7c3aed" }}>
                {getChildrenByParentId(parent.id).length}
              </p>
              <p className="text-xs text-gray-400">Children Enrolled</p>
            </div>
            <div
              className="text-center p-3 rounded-xl"
              style={{ backgroundColor: "var(--light-gray)" }}
            >
              <p
                className="text-xl font-black"
                style={{ color: "var(--success-dark)" }}
              >
                {parent.registeredDate
                  ? new Date(parent.registeredDate).getFullYear()
                  : "—"}
              </p>
              <p className="text-xs text-gray-400">Year Registered</p>
            </div>
          </div>

          {/* Children */}
          <div
            className="bg-white rounded-xl border p-4"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <p
              className="text-xs font-black uppercase tracking-widest mb-3"
              style={{ color: "var(--dark-gray)", opacity: 0.5 }}
            >
              Linked Children
            </p>
            {(() => {
              const kids = getChildrenByParentId(parent.id);
              return kids.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">
                  No children linked
                </p>
              ) : (
                kids.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 mb-3 last:mb-0"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ backgroundColor: "var(--royal-blue)" }}
                    >
                      {s.firstName[0]}
                      {s.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-bold truncate"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {s.firstName} {s.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {s.formClass} · {s.course}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-gray-400 flex-shrink-0">
                      {s.studentId}
                    </span>
                  </div>
                ))
              );
            })()}
          </div>

          {/* Contact info rows */}
          {[
            { icon: Phone, label: "Phone", value: parent.phone },
            { icon: Mail, label: "Email", value: parent.email },
            { icon: Briefcase, label: "Occupation", value: parent.occupation },
            { icon: MapPin, label: "Address", value: parent.address },
            {
              icon: Calendar,
              label: "Registered",
              value: parent.registeredDate
                ? new Date(parent.registeredDate).toLocaleDateString("en-GB", {
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
                style={{ backgroundColor: "#f5f3ff" }}
              >
                <Icon size={13} style={{ color: "#7c3aed" }} />
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

// ─── Main Parents Component ────────────────────────────────────────────────
const Parents = () => {
  const [parents, setParents] = useState(INITIAL_PARENTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFS] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editParent, setEditP] = useState(null);
  const [deleteParent, setDeleteP] = useState(null);
  const [viewParent, setViewP] = useState(null);
  const [showBulk, setShowBulk] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(
    () =>
      parents.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phone.includes(q);
        const matchStatus = filterStatus === "All" || p.status === filterStatus;
        return matchSearch && matchStatus;
      }),
    [parents, search, filterStatus],
  );

  const handleSave = (form) => {
    if (form.id) {
      setParents((pp) => pp.map((p) => (p.id === form.id ? form : p)));
      showToast(`${form.title} ${form.firstName} ${form.lastName} updated`);
    } else {
      setParents((pp) => [{ ...form, id: Date.now() }, ...pp]);
      showToast(`${form.title} ${form.firstName} ${form.lastName} registered`);
    }
    setShowForm(false);
    setEditP(null);
  };

  const handleDelete = () => {
    setParents((pp) => pp.filter((p) => p.id !== deleteParent.id));
    showToast(
      `${deleteParent.firstName} ${deleteParent.lastName} removed`,
      "error",
    );
    setDeleteP(null);
    setSelected((sel) => sel.filter((id) => id !== deleteParent.id));
  };

  const handleBulkDelete = () => {
    setParents((pp) => pp.filter((p) => !selected.includes(p.id)));
    showToast(`${selected.length} parent(s) removed`, "error");
    setSelected([]);
    setShowBulk(false);
  };

  const handleSampleGuide = () => {
    const lines = [
      "============================================",
      "AFSHTS PARENT IMPORT — SAMPLE GUIDE",
      "============================================",
      "",
      "CSV FORMAT (first row must be the header):",
      "title,firstName,lastName,email,phone,relationship,childStudentId",
      "",
      "EXAMPLE ROWS:",
      "Mr,Emmanuel,Asante,e.asante@gmail.com,0244123456,Father,AFSHTS/2025/001",
      "Mrs,Grace,Mensah,g.mensah@gmail.com,0277654321,Mother,AFSHTS/2025/002",
      "Mr,Yaw,Boateng,y.boateng@gmail.com,0200998877,Guardian,AFSHTS/2025/003",
      "",
      "RELATIONSHIP OPTIONS:",
      "  - Father",
      "  - Mother",
      "  - Guardian",
      "  - Other",
      "",
      "TITLE OPTIONS:  Mr  Mrs  Ms  Dr  Rev",
      "",
      "CHILD STUDENT ID FORMAT:  AFSHTS/YEAR/NUMBER",
      "  e.g.  AFSHTS/2025/001",
      "",
      "NOTES:",
      "  - One row per parent-child link.",
      "  - A parent with multiple children needs one row per child.",
      "  - Email must be unique per parent.",
      "  - childStudentId must match an existing student record.",
      "  - Default password is sent to parent email after account creation.",
      "============================================",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "AFSHTS_Parent_Sample_Guide.txt";
    a.click();
    showToast("Parent sample guide downloaded");
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
      "Title,First Name,Last Name,Email,Phone,Occupation,Status,Children Count,Address",
    ];
    filtered.forEach((p) =>
      rows.push(
        `${p.title},${p.firstName},${p.lastName},${p.email},${p.phone},${p.occupation},${p.status},${p.children.length},${p.address}`,
      ),
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "AFTS_Parents.csv";
    a.click();
    showToast("Parent list exported as CSV");
  };

  const toggleSelect = (id) =>
    setSelected((sel) =>
      sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id],
    );
  const toggleAll = () =>
    setSelected((sel) =>
      sel.length === filtered.length ? [] : filtered.map((p) => p.id),
    );
  const allSelected =
    filtered.length > 0 && selected.length === filtered.length;

  const total = parents.length;
  const active = parents.filter((p) => p.status === "Active").length;

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
            Parents & Guardians
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {total} registered · {active} active
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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
            onClick={handleExport}
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
              setEditP(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-sm"
            style={{ backgroundColor: "#5b21b6" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#4c1d95")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#5b21b6")
            }
          >
            <Plus size={15} /> Add Parent
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Parents",
            value: total,
            color: "#5b21b6",
            icon: Users,
          },
          {
            label: "Active",
            value: active,
            color: "var(--success-dark)",
            icon: UserCheck,
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
              placeholder="Search name, email or phone…"
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border-2 outline-none"
              style={{
                borderColor: "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--medium-gray)")
              }
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", "Active", "Inactive"].map((f) => (
              <button
                key={f}
                onClick={() => setFS(f)}
                className="text-xs font-semibold px-3 py-2 rounded-xl transition"
                style={{
                  backgroundColor: filterStatus === f ? "#5b21b6" : "white",
                  color: filterStatus === f ? "white" : "var(--dark-gray)",
                  border: "1px solid var(--medium-gray)",
                }}
              >
                {f}
              </button>
            ))}
          </div>
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
                  backgroundColor: viewMode === mode ? "#5b21b6" : "white",
                  color: viewMode === mode ? "white" : "var(--dark-gray)",
                }}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Showing <strong>{filtered.length}</strong> of <strong>{total}</strong>{" "}
          parents
          {(search || filterStatus !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setFS("All");
              }}
              className="ml-2 font-semibold"
              style={{ color: "var(--accent-red)" }}
            >
              Clear
            </button>
          )}
        </p>
      </div>

      {/* ── TABLE VIEW ─────────────────────────────────────────────────────── */}
      {viewMode === "table" && (
        <div
          className="bg-white rounded-xl border shadow-sm overflow-hidden"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
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
                      style={{ accentColor: "#7c3aed" }}
                    />
                  </th>
                  {[
                    "Parent",
                    "Email",
                    "Phone",
                    "Occupation",
                    "Children",
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
                      colSpan={8}
                      className="px-4 py-12 text-center text-gray-400"
                    >
                      No parents match your search
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const ss = statusStyle(p.status);
                    const isSel = selected.includes(p.id);
                    const fullName = `${p.title} ${p.firstName} ${p.lastName}`;
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-gray-50 transition"
                        style={{
                          backgroundColor: isSel ? "#f5f3ff" : undefined,
                        }}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSel}
                            onChange={() => toggleSelect(p.id)}
                            className="w-4 h-4"
                            style={{ accentColor: "#7c3aed" }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={fullName} size="sm" />
                            <div>
                              <p
                                className="font-semibold"
                                style={{ color: "var(--dark-gray)" }}
                              >
                                {fullName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {p.email}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {p.phone}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {p.occupation || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {getChildrenByParentId(p.id)
                              .slice(0, 2)
                              .map((s) => (
                                <span
                                  key={s.id}
                                  className="text-xs px-1.5 py-0.5 rounded font-mono"
                                  style={{
                                    backgroundColor: "#f5f3ff",
                                    color: "#7c3aed",
                                  }}
                                >
                                  {s.firstName}
                                </span>
                              ))}
                            {getChildrenByParentId(p.id).length > 2 && (
                              <span
                                className="text-xs px-1.5 py-0.5 rounded"
                                style={{
                                  backgroundColor: "#eef2ff",
                                  color: "var(--royal-blue)",
                                }}
                              >
                                +{getChildrenByParentId(p.id).length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded"
                            style={{ backgroundColor: ss.bg, color: ss.color }}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setViewP(p)}
                              title="View"
                              className="p-1.5 rounded-lg hover:bg-purple-50 transition"
                              style={{ color: "#7c3aed" }}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setEditP(p);
                                setShowForm(true);
                              }}
                              title="Edit"
                              className="p-1.5 rounded-lg hover:bg-yellow-50 transition"
                              style={{ color: "var(--warning)" }}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteP(p)}
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

      {/* ── CARDS VIEW ─────────────────────────────────────────────────────── */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No parents match your search
            </div>
          ) : (
            filtered.map((p) => {
              const ss = statusStyle(p.status);
              const isSel = selected.includes(p.id);
              const fullName = `${p.title} ${p.firstName} ${p.lastName}`;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md"
                  style={{
                    borderColor: isSel ? "#7c3aed" : "var(--medium-gray)",
                  }}
                >
                  <div
                    className="h-12 relative"
                    style={{
                      background: "linear-gradient(135deg,#5b21b6,#4c1d95)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggleSelect(p.id)}
                      className="absolute top-2 right-2 w-4 h-4"
                      style={{ accentColor: "white" }}
                    />
                    <div className="absolute -bottom-5 left-4">
                      <Avatar name={fullName} />
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
                          {p.email}
                        </p>
                      </div>
                      <span
                        className="text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ml-2"
                        style={{ backgroundColor: ss.bg, color: ss.color }}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                      <Phone size={10} /> {p.phone}
                    </div>
                    {p.occupation && (
                      <div className="mt-0.5 text-xs text-gray-500 flex items-center gap-1">
                        <Briefcase size={10} /> {p.occupation}
                      </div>
                    )}

                    {/* Children tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {getChildrenByParentId(p.id).map((s) => (
                        <span
                          key={s.id}
                          className="text-xs px-1.5 py-0.5 rounded font-semibold"
                          style={{
                            backgroundColor: "#f5f3ff",
                            color: "#7c3aed",
                          }}
                        >
                          {s.firstName}
                        </span>
                      ))}
                    </div>

                    <div
                      className="flex items-center gap-1 mt-3 pt-3 border-t"
                      style={{ borderColor: "var(--medium-gray)" }}
                    >
                      <button
                        onClick={() => setViewP(p)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg"
                        style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}
                      >
                        <Eye size={12} /> View
                      </button>
                      <button
                        onClick={() => {
                          setEditP(p);
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
                        onClick={() => setDeleteP(p)}
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

      {/* ── BULK ACTIONS ─────────────────────────────────────────────────── */}
      {showBulk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black" style={{ color: "var(--dark-gray)" }}>
                Bulk Actions · {selected.length} parent
                {selected.length > 1 ? "s" : ""}
              </h3>
              <button
                onClick={() => setShowBulk(false)}
                style={{ color: "var(--dark-gray)" }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  handleExport();
                  setShowBulk(false);
                }}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left hover:shadow-sm"
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
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left hover:shadow-sm"
                style={{
                  borderColor: "var(--accent-red)",
                  backgroundColor: "#fff1f2",
                }}
              >
                <Trash2 size={20} style={{ color: "var(--accent-red)" }} />
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--accent-red)" }}
                  >
                    Remove Selected
                  </p>
                  <p className="text-xs text-gray-500">
                    Remove {selected.length} parent account
                    {selected.length > 1 ? "s" : ""}
                  </p>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowBulk(false)}
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

      {/* Modals */}
      {showForm && (
        <ParentFormModal
          parent={editParent}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditP(null);
          }}
        />
      )}
      {deleteParent && (
        <DeleteConfirm
          parent={deleteParent}
          onConfirm={handleDelete}
          onClose={() => setDeleteP(null)}
        />
      )}
      {viewParent && (
        <ProfileDrawer
          parent={viewParent}
          onEdit={() => {
            setEditP(viewParent);
            setViewP(null);
            setShowForm(true);
          }}
          onClose={() => setViewP(null)}
        />
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default Parents;
