// src/admin/profile/Profile.jsx
import React, { useState, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit3,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  Camera,
  CheckCircle2,
  AlertCircle,
  Shield,
  Calendar,
  Key,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ChangePasswordForm from "../../components/common/ChangePasswordForm";

const TITLES = ["Mr", "Mrs", "Miss", "Dr", "Prof", "Rev"];
const POSITIONS = [
  "Headmaster",
  "Assistant Headmaster",
  "Admin Officer",
  "Bursar",
  "Academic Director",
  "System Administrator",
];

const InfoRow = ({ icon: Icon, label, value, color = "var(--royal-blue)" }) => (
  <div
    className="flex items-start gap-3 py-3 border-b"
    style={{ borderColor: "var(--medium-gray)" }}
  >
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: color + "15" }}
    >
      <Icon size={14} style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
      <p
        className="text-sm font-semibold mt-0.5"
        style={{ color: "var(--dark-gray)" }}
      >
        {value || "-"}
      </p>
    </div>
  </div>
);

const Profile = () => {
  const { user } = useAuth();
  const fileRef = useRef();

  // Personal info state
  const [editMode, setEditMode] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [info, setInfo] = useState({
    title: "Mr",
    firstName: user?.name?.split(" ")[0] || "System",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "Administrator",
    staffId: "AFSHTS/ADM/001",
    email: user?.email || "admin@afts.edu.gh",
    phone: "0244000001",
    address: "Uaddara Barracks, Kumasi, Ghana",
    position: "System Administrator",
    department: "Administration",
    joinDate: "2018-09-01",
  });
  const [draft, setDraft] = useState({ ...info });
  const setD = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  // Password state
  const [pwSection, setPwSection] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveInfo = () => {
    setInfo(draft);
    setEditMode(false);
    showToast("Profile updated successfully");
  };

  const handleCancelEdit = () => {
    setDraft({ ...info });
    setEditMode(false);
  };

  const initials = `${info.firstName[0]}${info.lastName[0]}`.toUpperCase();

  const FInput = ({
    label,
    value,
    onChange,
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border-2 outline-none bg-white"
          style={{
            borderColor: "var(--medium-gray)",
            color: "var(--dark-gray)",
          }}
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border-2 outline-none"
          style={{
            borderColor: "var(--medium-gray)",
            color: "var(--dark-gray)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--medium-gray)")}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
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
          <CheckCircle2 size={14} /> {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            My Profile
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {info.staffId} · {info.position}
          </p>
        </div>
        {!editMode ? (
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition"
            style={{ backgroundColor: "#eef2ff", color: "var(--royal-blue)" }}
          >
            <Edit3 size={13} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveInfo}
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl text-white"
              style={{ backgroundColor: "var(--success-dark)" }}
            >
              <Save size={13} /> Save
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border"
              style={{
                borderColor: "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
            >
              <X size={13} /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile card */}
      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        {/* Banner */}
        <div
          className="h-28 relative"
          style={{
            background:
              "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>
        {/* Avatar */}
        <div className="relative px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10">
            <div className="relative flex-shrink-0">
              <div
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-white font-black text-2xl"
                style={{ backgroundColor: "var(--accent-red)" }}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              {editMode && (
                <>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: "var(--royal-blue)" }}
                  >
                    <Camera size={12} />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </>
              )}
            </div>
            <div className="pb-1">
              <h2
                className="text-xl font-black"
                style={{ color: "var(--dark-gray)" }}
              >
                {info.title} {info.firstName} {info.lastName}
              </h2>
              <p className="text-sm text-gray-400">{info.position}</p>
              <div className="flex flex-wrap gap-2 mt-1.5">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "#eef2ff",
                    color: "var(--royal-blue)",
                  }}
                >
                  Administrator
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "#f0fdf4",
                    color: "var(--success-dark)",
                  }}
                >
                  ● Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal info */}
        <div
          className="bg-white rounded-xl border shadow-sm p-5"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <h3
            className="font-black text-sm mb-4"
            style={{ color: "var(--dark-gray)" }}
          >
            Personal Information
          </h3>

          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FInput
                  label="Title"
                  value={draft.title}
                  onChange={(v) => setD("title", v)}
                  options={TITLES}
                />
                <FInput
                  label="First Name"
                  value={draft.firstName}
                  onChange={(v) => setD("firstName", v)}
                  required
                />
              </div>
              <FInput
                label="Last Name"
                value={draft.lastName}
                onChange={(v) => setD("lastName", v)}
                required
              />
              <FInput
                label="Staff ID"
                value={draft.staffId}
                onChange={(v) => setD("staffId", v)}
              />
              <FInput
                label="Email"
                value={draft.email}
                onChange={(v) => setD("email", v)}
                type="email"
              />
              <FInput
                label="Phone"
                value={draft.phone}
                onChange={(v) => setD("phone", v)}
              />
              <FInput
                label="Address"
                value={draft.address}
                onChange={(v) => setD("address", v)}
              />
              <FInput
                label="Position"
                value={draft.position}
                onChange={(v) => setD("position", v)}
                options={POSITIONS}
              />
              <FInput
                label="Join Date"
                value={draft.joinDate}
                onChange={(v) => setD("joinDate", v)}
                type="date"
              />
            </div>
          ) : (
            <div>
              <InfoRow
                icon={User}
                label="Full Name"
                value={`${info.title} ${info.firstName} ${info.lastName}`}
                color="var(--royal-blue)"
              />
              <InfoRow
                icon={Shield}
                label="Staff ID"
                value={info.staffId}
                color="var(--accent-red)"
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={info.email}
                color="#7c3aed"
              />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={info.phone}
                color="var(--success-dark)"
              />
              <InfoRow
                icon={MapPin}
                label="Address"
                value={info.address}
                color="var(--warning)"
              />
              <InfoRow
                icon={Briefcase}
                label="Position"
                value={info.position}
                color="var(--info)"
              />
              <InfoRow
                icon={Calendar}
                label="Joined"
                value={
                  info.joinDate
                    ? new Date(info.joinDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"
                }
                color="var(--royal-blue)"
              />
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Account info */}
          <div
            className="bg-white rounded-xl border shadow-sm p-5"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <h3
              className="font-black text-sm mb-4"
              style={{ color: "var(--dark-gray)" }}
            >
              Account Information
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Account Type",
                  value: "System Administrator",
                  color: "var(--royal-blue)",
                },
                {
                  label: "Portal Access",
                  value: "Admin · Full Access",
                  color: "var(--success-dark)",
                },
                {
                  label: "Last Login",
                  value: "Today, 14:32",
                  color: "var(--dark-gray)",
                },
                {
                  label: "Account Created",
                  value: "September 2018",
                  color: "var(--dark-gray)",
                },
                {
                  label: "Sessions Active",
                  value: "1 active session",
                  color: "var(--success-dark)",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-xs font-bold" style={{ color }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Change password */}
          <div
            className="bg-white rounded-xl border shadow-sm overflow-hidden"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <button
              type="button"
              onClick={() => setPwSection((s) => !s)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
              style={{
                borderBottom: pwSection
                  ? "1px solid var(--medium-gray)"
                  : "none",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#fff1f2" }}
                >
                  <Key size={14} style={{ color: "var(--accent-red)" }} />
                </div>
                <div className="text-left">
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    Change Password
                  </p>
                  <p className="text-xs text-gray-400">
                    Update your account password
                  </p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">
                {pwSection ? "▲" : "▼"}
              </span>
            </button>

            {pwSection && (
              <div className="p-5">
                <ChangePasswordForm submitLabel="Update Password" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
