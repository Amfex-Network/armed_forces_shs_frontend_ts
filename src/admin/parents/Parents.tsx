import React, { useEffect, useMemo, useState } from "react";
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
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  User,
  GraduationCap,
  Link2,
  Unlink,
  KeyRound,
} from "lucide-react";
import { usersApi, type ManagedUser } from "../../api/users";
import { studentsApi, type Student } from "../../api/students";

const TITLES = ["Mr", "Mrs", "Miss", "Dr", "Prof", "Rev"];
const STATUSES = ["Active", "Inactive"];

const EMPTY: Partial<ManagedUser> = {
  title: "Mr",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  status: "Active",
  role: "parent",
};

const statusStyle = (s?: string) =>
  ({
    Active: { bg: "#f0fdf4", color: "var(--success-dark)" },
    Inactive: { bg: "#fff1f2", color: "var(--accent-red)" },
  })[s || "Active"] || { bg: "#f3f4f6", color: "#6b7280" };

const Avatar = ({ name, size = "md" }: { name: string; size?: string }) => {
  const ini = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const sz =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "lg"
        ? "w-16 h-16 text-2xl"
        : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center text-white font-black flex-shrink-0`}
      style={{ backgroundColor: "#7c3aed" }}
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
}: any) => (
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
      >
        {options.map((o: string) => (
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
      />
    )}
    {error && (
      <span className="text-xs" style={{ color: "var(--accent-red)" }}>
        {error}
      </span>
    )}
  </div>
);

const ParentFormModal = ({ parent, onSave, onClose }: any) => {
  const isEdit = !!parent?.id;
  const [form, setForm] = useState<Partial<ManagedUser>>(parent || EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName?.trim()) e.firstName = "Required";
    if (!form.lastName?.trim()) e.lastName = "Required";
    if (!form.email?.trim()) e.email = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
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
                {isEdit ? form.email : "A temporary password will be generated"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-purple-200">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FInput
              label="Title"
              value={form.title}
              onChange={(v: string) => set("title", v)}
              options={TITLES}
            />
            <FInput
              label="Status"
              value={form.status}
              onChange={(v: string) => set("status", v)}
              options={STATUSES}
            />
            <FInput
              label="First Name"
              value={form.firstName}
              onChange={(v: string) => set("firstName", v)}
              required
              error={errors.firstName}
            />
            <FInput
              label="Last Name"
              value={form.lastName}
              onChange={(v: string) => set("lastName", v)}
              required
              error={errors.lastName}
            />
            <FInput
              label="Email"
              value={form.email}
              onChange={(v: string) => set("email", v)}
              type="email"
              required
              error={errors.email}
            />
            <FInput
              label="Phone"
              value={form.phone}
              onChange={(v: string) => set("phone", v)}
            />
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
            style={{ backgroundColor: "#7c3aed" }}
          >
            <Save size={14} /> {isEdit ? "Save Changes" : "Register Parent"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirm = ({ parent, onConfirm, onClose }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: "#fff1f2" }}
      >
        <Trash2 size={24} style={{ color: "var(--accent-red)" }} />
      </div>
      <h3 className="font-black text-lg mb-1" style={{ color: "var(--dark-gray)" }}>
        Delete Parent?
      </h3>
      <p className="text-sm text-gray-500 mb-1">
        <strong>
          {parent.firstName} {parent.lastName}
        </strong>{" "}
        · {parent.email}
      </p>
      <p className="text-xs text-gray-400 mb-6">
        This removes the parent account. Any linked children will be unlinked.
        This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onClose}
          className="px-5 py-2 text-sm font-semibold rounded-xl border"
          style={{ borderColor: "var(--medium-gray)", color: "var(--dark-gray)" }}
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

const ChildrenDrawer = ({
  parent,
  students,
  onClose,
  onLink,
  onUnlink,
}: {
  parent: ManagedUser;
  students: Student[];
  onClose: () => void;
  onLink: (studentId: string) => void;
  onUnlink: (studentId: string) => void;
}) => {
  const [pick, setPick] = useState("");
  const linked = students.filter((s) => s.parentId === parent.id);
  const available = students.filter((s) => !s.parentId);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto flex flex-col shadow-2xl">
        <div
          className="px-5 py-4 flex items-center justify-between flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#7c3aed,#5b21b6)" }}
        >
          <p className="text-white font-black">Parent & Children</p>
          <button onClick={onClose} className="text-white hover:text-purple-200">
            <X size={18} />
          </button>
        </div>
        <div className="h-1 flex-shrink-0" style={{ backgroundColor: "var(--accent-red)" }} />

        <div className="flex-1 p-5 space-y-5">
          <div className="flex items-center gap-4">
            <Avatar name={`${parent.firstName} ${parent.lastName}`} size="lg" />
            <div>
              <h2 className="font-black text-lg" style={{ color: "var(--dark-gray)" }}>
                {parent.title} {parent.firstName} {parent.lastName}
              </h2>
              <p className="text-xs text-gray-400">{parent.email}</p>
              <p className="text-xs text-gray-400">{parent.phone || "No phone"}</p>
            </div>
          </div>

          <div>
            <p
              className="text-xs font-black uppercase tracking-wider mb-2"
              style={{ color: "var(--dark-gray)" }}
            >
              Linked Children ({linked.length})
            </p>
            {linked.length === 0 ? (
              <p className="text-sm text-gray-400 py-3">
                No children linked to this parent yet.
              </p>
            ) : (
              <div className="space-y-2">
                {linked.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 rounded-xl border"
                    style={{
                      borderColor: "var(--medium-gray)",
                      backgroundColor: "var(--light-gray)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ backgroundColor: "var(--royal-blue)" }}
                    >
                      {s.firstName?.[0]}
                      {s.lastName?.[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-bold truncate"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {s.firstName} {s.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {s.studentId} · {s.formClass}
                      </p>
                    </div>
                    <button
                      onClick={() => onUnlink(s.id as string)}
                      title="Unlink"
                      className="p-1.5 rounded-lg hover:bg-red-50 flex-shrink-0"
                      style={{ color: "var(--accent-red)" }}
                    >
                      <Unlink size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p
              className="text-xs font-black uppercase tracking-wider mb-2"
              style={{ color: "var(--dark-gray)" }}
            >
              Link a Child
            </p>
            <div className="flex gap-2">
              <select
                value={pick}
                onChange={(e) => setPick(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-lg border-2 outline-none bg-white"
                style={{
                  borderColor: "var(--medium-gray)",
                  color: "var(--dark-gray)",
                }}
              >
                <option value="">
                  {available.length === 0
                    ? "No unlinked students"
                    : "Select a student…"}
                </option>
                {available.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} · {s.studentId}
                  </option>
                ))}
              </select>
              <button
                disabled={!pick}
                onClick={() => {
                  if (pick) {
                    onLink(pick);
                    setPick("");
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white rounded-lg disabled:opacity-50"
                style={{ backgroundColor: "#7c3aed" }}
              >
                <Link2 size={14} /> Link
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Only students not already linked to a parent are shown.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Parents = () => {
  const [parents, setParents] = useState<ManagedUser[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editParent, setEditParent] = useState<ManagedUser | null>(null);
  const [deleteParent, setDeleteParent] = useState<ManagedUser | null>(null);
  const [viewParent, setViewParent] = useState<ManagedUser | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const load = async () => {
    try {
      setLoading(true);
      const [allUsers, studentList] = await Promise.all([
        usersApi.list(),
        studentsApi.list().catch(() => []),
      ]);
      setParents(allUsers.filter((u) => u.role === "parent"));
      setStudents(studentList);
    } catch (err: any) {
      showToast(err?.message || "Failed to load parents", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      parents.filter((p) => {
        const q = search.toLowerCase();
        return (
          !q ||
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          (p.phone || "").toLowerCase().includes(q)
        );
      }),
    [parents, search],
  );

  const childCount = (parentId?: string) =>
    students.filter((s) => s.parentId === parentId).length;

  const handleSave = async (form: Partial<ManagedUser>) => {
    try {
      if (form.id) {
        const saved = await usersApi.update(form.id, form);
        setParents((ps) => ps.map((p) => (p.id === saved.id ? saved : p)));
        showToast(`${saved.firstName} ${saved.lastName} updated`);
      } else {
        const { user, tempPassword } = await usersApi.create({
          ...form,
          role: "parent",
        });
        setParents((ps) => [user, ...ps]);
        showToast(
          `${user.firstName} registered · Temp password: ${tempPassword}`,
        );
      }
      setShowForm(false);
      setEditParent(null);
    } catch (err: any) {
      showToast(err?.message || "Failed to save parent", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteParent) return;
    try {
      const kids = students.filter((s) => s.parentId === deleteParent.id);
      await Promise.all(
        kids.map((s) => studentsApi.update(s.id as string, { parentId: null })),
      );
      await usersApi.remove(deleteParent.id as string);
      setParents((ps) => ps.filter((p) => p.id !== deleteParent.id));
      setStudents((ss) =>
        ss.map((s) =>
          s.parentId === deleteParent.id ? { ...s, parentId: null } : s,
        ),
      );
      showToast(`${deleteParent.firstName} ${deleteParent.lastName} removed`, "error");
    } catch (err: any) {
      showToast(err?.message || "Failed to delete parent", "error");
    } finally {
      setDeleteParent(null);
    }
  };

  const handleResetPassword = async (parent: ManagedUser) => {
    try {
      const tempPassword = await usersApi.resetPassword(parent.id as string);
      showToast(`New temp password for ${parent.firstName}: ${tempPassword}`);
    } catch (err: any) {
      showToast(err?.message || "Failed to reset password", "error");
    }
  };

  const linkChild = async (studentId: string, parentId: string) => {
    try {
      await studentsApi.update(studentId, { parentId });
      setStudents((ss) =>
        ss.map((s) => (s.id === studentId ? { ...s, parentId } : s)),
      );
      showToast("Child linked");
    } catch (err: any) {
      showToast(err?.message || "Failed to link child", "error");
    }
  };

  const unlinkChild = async (studentId: string) => {
    try {
      await studentsApi.update(studentId, { parentId: null });
      setStudents((ss) =>
        ss.map((s) => (s.id === studentId ? { ...s, parentId: null } : s)),
      );
      showToast("Child unlinked", "error");
    } catch (err: any) {
      showToast(err?.message || "Failed to unlink child", "error");
    }
  };

  const total = parents.length;
  const active = parents.filter((p) => p.status !== "Inactive").length;
  const linkedChildren = students.filter((s) => !!s.parentId).length;

  return (
    <div className="space-y-5">
      {toast && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2 max-w-md"
          style={{
            backgroundColor:
              toast.type === "error"
                ? "var(--accent-red)"
                : "var(--success-dark)",
          }}
        >
          {toast.type === "error" ? (
            <AlertCircle size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--dark-gray)" }}>
            Parents / Guardians
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {total} parents · {linkedChildren} children linked
          </p>
        </div>
        <button
          onClick={() => {
            setEditParent(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-sm"
          style={{ backgroundColor: "#7c3aed" }}
        >
          <Plus size={15} /> Add Parent
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Parents", value: total, color: "#7c3aed", icon: Users },
          {
            label: "Active",
            value: active,
            color: "var(--success-dark)",
            icon: UserCheck,
          },
          {
            label: "Children Linked",
            value: linkedChildren,
            color: "var(--royal-blue)",
            icon: GraduationCap,
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
              <p className="text-xl font-black" style={{ color: "var(--dark-gray)" }}>
                {value}
              </p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div
        className="bg-white rounded-xl border shadow-sm p-4"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or phone…"
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border-2 outline-none"
            style={{ borderColor: "var(--medium-gray)", color: "var(--dark-gray)" }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead
              className="border-b"
              style={{
                backgroundColor: "var(--light-gray)",
                borderColor: "var(--medium-gray)",
              }}
            >
              <tr>
                {["Parent", "Email", "Phone", "Children", "Status", "Actions"].map(
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    {loading
                      ? "Loading parents…"
                      : parents.length === 0
                        ? "No parents yet — click Add Parent to register one"
                        : "No parents match your search"}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const ss = statusStyle(p.status);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={`${p.firstName} ${p.lastName}`}
                            size="sm"
                          />
                          <p
                            className="font-semibold"
                            style={{ color: "var(--dark-gray)" }}
                          >
                            {p.title} {p.firstName} {p.lastName}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {p.email}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {p.phone || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}
                        >
                          {childCount(p.id)}
                        </span>
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
                            onClick={() => setViewParent(p)}
                            title="Manage children"
                            className="p-1.5 rounded-lg hover:bg-purple-50 transition"
                            style={{ color: "#7c3aed" }}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleResetPassword(p)}
                            title="Reset password"
                            className="p-1.5 rounded-lg hover:bg-blue-50 transition"
                            style={{ color: "var(--royal-blue)" }}
                          >
                            <KeyRound size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setEditParent(p);
                              setShowForm(true);
                            }}
                            title="Edit"
                            className="p-1.5 rounded-lg hover:bg-yellow-50 transition"
                            style={{ color: "var(--warning)" }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteParent(p)}
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

      {showForm && (
        <ParentFormModal
          parent={editParent}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditParent(null);
          }}
        />
      )}
      {deleteParent && (
        <DeleteConfirm
          parent={deleteParent}
          onConfirm={handleDelete}
          onClose={() => setDeleteParent(null)}
        />
      )}
      {viewParent && (
        <ChildrenDrawer
          parent={viewParent}
          students={students}
          onClose={() => setViewParent(null)}
          onLink={(sid) => linkChild(sid, viewParent.id as string)}
          onUnlink={(sid) => unlinkChild(sid)}
        />
      )}
    </div>
  );
};

export default Parents;
