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
  Briefcase,
  KeyRound,
  IdCard,
} from "lucide-react";
import { usersApi, type ManagedUser } from "../../api/users";
import { departmentsApi } from "../../api/domains";
import CredentialModal from "../../components/common/CredentialModal";

const TITLES = ["Mr", "Mrs", "Miss", "Dr", "Prof", "Rev", "Capt", "Sgt"];
const STATUSES = ["Active", "Inactive"];
const TEACHER_ROLES = [
  "Subject Teacher",
  "Form Teacher",
  "HOD",
  "Assistant HOD",
  "Exam Coordinator",
  "House Master",
  "Counsellor",
  "WAEC Coordinator",
  "Workshop Instructor",
  "Sports Master",
  "Year Group Head",
];

const EMPTY: Partial<ManagedUser> = {
  title: "Mr",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  staffId: "",
  department: "",
  teacherRole: "Subject Teacher",
  formClass: "",
  status: "Active",
  role: "teacher",
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
      style={{ backgroundColor: "var(--royal-blue)" }}
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

const TeacherFormModal = ({ teacher, onSave, onClose, departments }: any) => {
  const isEdit = !!teacher?.id;
  const [form, setForm] = useState<Partial<ManagedUser>>(teacher || EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const deptOptions = ["", ...departments.map((d: any) => d.name)];

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
                {isEdit ? "Edit Teacher" : "Register New Teacher"}
              </p>
              <p className="text-blue-200 text-xs">
                {isEdit ? form.email : "A temporary password will be generated"}
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
            <FInput
              label="Staff ID"
              value={form.staffId}
              onChange={(v: string) => set("staffId", v)}
            />
            <FInput
              label="Department"
              value={form.department}
              onChange={(v: string) => set("department", v)}
              options={deptOptions}
            />
            <FInput
              label="Role"
              value={form.teacherRole}
              onChange={(v: string) => set("teacherRole", v)}
              options={TEACHER_ROLES}
            />
            <FInput
              label="Form Class (if any)"
              value={form.formClass}
              onChange={(v: string) => set("formClass", v)}
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
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            <Save size={14} /> {isEdit ? "Save Changes" : "Register Teacher"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirm = ({ teacher, onConfirm, onClose }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: "#fff1f2" }}
      >
        <Trash2 size={24} style={{ color: "var(--accent-red)" }} />
      </div>
      <h3 className="font-black text-lg mb-1" style={{ color: "var(--dark-gray)" }}>
        Delete Teacher?
      </h3>
      <p className="text-sm text-gray-500 mb-1">
        <strong>
          {teacher.firstName} {teacher.lastName}
        </strong>{" "}
        · {teacher.email}
      </p>
      <p className="text-xs text-gray-400 mb-6">
        This removes the teacher account. This action cannot be undone.
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

const ProfileDrawer = ({ teacher, onEdit, onClose }: any) => {
  if (!teacher) return null;
  const ss = statusStyle(teacher.status);
  return (
    <div className="fixed inset-0 z-50 flex">
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
              onClick={onEdit}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Edit3 size={12} /> Edit
            </button>
            <button onClick={onClose} className="text-white hover:text-blue-200">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="h-1 flex-shrink-0" style={{ backgroundColor: "var(--accent-red)" }} />
        <div className="flex-1 p-5 space-y-5">
          <div className="flex items-center gap-4">
            <Avatar name={`${teacher.firstName} ${teacher.lastName}`} size="lg" />
            <div>
              <h2 className="font-black text-lg" style={{ color: "var(--dark-gray)" }}>
                {teacher.title} {teacher.firstName} {teacher.lastName}
              </h2>
              <p className="text-xs font-mono text-gray-400">
                {teacher.staffId || "No staff ID"}
              </p>
              <span
                className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: ss.bg, color: ss.color }}
              >
                {teacher.status}
              </span>
            </div>
          </div>
          {[
            { icon: User, label: "Role", value: teacher.teacherRole },
            { icon: Briefcase, label: "Department", value: teacher.department },
            { icon: Mail, label: "Email", value: teacher.email },
            { icon: Phone, label: "Phone", value: teacher.phone },
            { icon: IdCard, label: "Staff ID", value: teacher.staffId },
            { icon: Users, label: "Form Class", value: teacher.formClass },
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
                <p className="text-sm font-semibold" style={{ color: "var(--dark-gray)" }}>
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

const Teacher = () => {
  const [teachers, setTeachers] = useState<ManagedUser[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editTeacher, setEditTeacher] = useState<ManagedUser | null>(null);
  const [deleteTeacher, setDeleteTeacher] = useState<ManagedUser | null>(null);
  const [viewTeacher, setViewTeacher] = useState<ManagedUser | null>(null);
  const [credential, setCredential] = useState<{
    name: string;
    tempPassword?: string;
    userId?: string;
  } | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const load = async () => {
    try {
      setLoading(true);
      const [allUsers, depts] = await Promise.all([
        usersApi.list(),
        departmentsApi.list().catch(() => []),
      ]);
      setTeachers(allUsers.filter((u) => u.role === "teacher"));
      setDepartments(depts);
    } catch (err: any) {
      showToast(err?.message || "Failed to load teachers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deptNames = useMemo(
    () => ["All", ...departments.map((d) => d.name)],
    [departments],
  );

  const filtered = useMemo(
    () =>
      teachers.filter((t) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          t.firstName.toLowerCase().includes(q) ||
          t.lastName.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          (t.staffId || "").toLowerCase().includes(q);
        const matchDept = filterDept === "All" || t.department === filterDept;
        const matchStatus =
          filterStatus === "All" || t.status === filterStatus;
        return matchSearch && matchDept && matchStatus;
      }),
    [teachers, search, filterDept, filterStatus],
  );

  const handleSave = async (form: Partial<ManagedUser>) => {
    try {
      if (form.id) {
        const saved = await usersApi.update(form.id, form);
        setTeachers((ts) => ts.map((t) => (t.id === saved.id ? saved : t)));
        showToast(`${saved.firstName} ${saved.lastName} updated`);
      } else {
        const { user, tempPassword } = await usersApi.create({
          ...form,
          role: "teacher",
        });
        setTeachers((ts) => [user, ...ts]);
        setCredential({
          name: `${user.title || ""} ${user.firstName} ${user.lastName}`.trim(),
          tempPassword,
        });
      }
      setShowForm(false);
      setEditTeacher(null);
    } catch (err: any) {
      showToast(err?.message || "Failed to save teacher", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTeacher) return;
    try {
      await usersApi.remove(deleteTeacher.id as string);
      setTeachers((ts) => ts.filter((t) => t.id !== deleteTeacher.id));
      showToast(`${deleteTeacher.firstName} ${deleteTeacher.lastName} removed`, "error");
    } catch (err: any) {
      showToast(err?.message || "Failed to delete teacher", "error");
    } finally {
      setDeleteTeacher(null);
    }
  };

  const handleResetPassword = (teacher: ManagedUser) => {
    setCredential({
      name: `${teacher.title || ""} ${teacher.firstName} ${teacher.lastName}`.trim(),
      userId: teacher.id as string,
    });
  };

  const total = teachers.length;
  const active = teachers.filter((t) => t.status !== "Inactive").length;

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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--dark-gray)" }}>
            Teachers / Staff
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {total} teachers · {active} active
          </p>
        </div>
        <button
          onClick={() => {
            setEditTeacher(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-sm"
          style={{ backgroundColor: "var(--royal-blue)" }}
        >
          <Plus size={15} /> Add Teacher
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Total Teachers", value: total, color: "var(--royal-blue)", icon: Users },
          { label: "Active", value: active, color: "var(--success-dark)", icon: UserCheck },
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

      <div
        className="bg-white rounded-xl border shadow-sm p-4 flex flex-col sm:flex-row gap-3"
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
            placeholder="Search name, email or staff ID…"
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border-2 outline-none"
            style={{ borderColor: "var(--medium-gray)", color: "var(--dark-gray)" }}
          />
        </div>
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border-2 outline-none bg-white"
          style={{ borderColor: "var(--medium-gray)", color: "var(--dark-gray)" }}
        >
          {deptNames.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border-2 outline-none bg-white"
          style={{ borderColor: "var(--medium-gray)", color: "var(--dark-gray)" }}
        >
          {["All", ...STATUSES].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div
        className="bg-white rounded-xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead
              className="border-b"
              style={{
                backgroundColor: "var(--light-gray)",
                borderColor: "var(--medium-gray)",
              }}
            >
              <tr>
                {["Teacher", "Staff ID", "Department", "Role", "Status", "Actions"].map(
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
            <tbody className="divide-y" style={{ borderColor: "var(--medium-gray)" }}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    {loading
                      ? "Loading teachers…"
                      : teachers.length === 0
                        ? "No teachers yet - click Add Teacher to register one"
                        : "No teachers match your search"}
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const ss = statusStyle(t.status);
                  return (
                    <tr key={t.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={`${t.firstName} ${t.lastName}`} size="sm" />
                          <p className="font-semibold" style={{ color: "var(--dark-gray)" }}>
                            {t.title} {t.firstName} {t.lastName}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {t.staffId || "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {t.department || "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {t.teacherRole || "-"}
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
                            onClick={() => setViewTeacher(t)}
                            title="View profile"
                            className="p-1.5 rounded-lg hover:bg-blue-50 transition"
                            style={{ color: "var(--royal-blue)" }}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleResetPassword(t)}
                            title="Reset password"
                            className="p-1.5 rounded-lg hover:bg-blue-50 transition"
                            style={{ color: "var(--royal-blue)" }}
                          >
                            <KeyRound size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setEditTeacher(t);
                              setShowForm(true);
                            }}
                            title="Edit"
                            className="p-1.5 rounded-lg hover:bg-yellow-50 transition"
                            style={{ color: "var(--warning)" }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTeacher(t)}
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
        <TeacherFormModal
          teacher={editTeacher}
          departments={departments}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditTeacher(null);
          }}
        />
      )}
      {deleteTeacher && (
        <DeleteConfirm
          teacher={deleteTeacher}
          onConfirm={handleDelete}
          onClose={() => setDeleteTeacher(null)}
        />
      )}
      {viewTeacher && (
        <ProfileDrawer
          teacher={viewTeacher}
          onEdit={() => {
            setEditTeacher(viewTeacher);
            setViewTeacher(null);
            setShowForm(true);
          }}
          onClose={() => setViewTeacher(null)}
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
    </div>
  );
};

export default Teacher;
