// src/student/settings/StudentSettings.jsx
import React, { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  Shield,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import { useNavigate } from "react-router-dom";
import ChangePasswordForm from "../../components/common/ChangePasswordForm";

const Field = ({ label, children }) => (
  <div>
    <label
      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
      style={{ color: "#6b7280" }}
    >
      {label}
    </label>
    {children}
  </div>
);

const Input = ({ type = "text", value, onChange, placeholder, disabled }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className="w-full px-3 py-2.5 text-sm border-2 rounded-xl outline-none transition"
    style={{
      borderColor: "var(--medium-gray)",
      color: "var(--dark-gray)",
      backgroundColor: disabled ? "#f9fafb" : "white",
    }}
    onFocus={(e) => {
      if (!disabled) e.target.style.borderColor = "var(--royal-blue)";
    }}
    onBlur={(e) => (e.target.style.borderColor = "var(--medium-gray)")}
  />
);

const Card = ({
  icon: Icon,
  title,
  desc,
  color = "var(--royal-blue)",
  children,
}) => (
  <div
    className="bg-white rounded-2xl border shadow-sm overflow-hidden"
    style={{ borderColor: "var(--medium-gray)" }}
  >
    <div
      className="flex items-center gap-3 px-5 py-4 border-b"
      style={{
        borderColor: "var(--medium-gray)",
        backgroundColor: "var(--light-gray)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color + "18" }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="font-black text-sm" style={{ color: "var(--dark-gray)" }}>
          {title}
        </p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const Toggle = ({
  label,
  desc,
  checked,
  onChange,
  color = "var(--royal-blue)",
}) => (
  <div
    className="flex items-center justify-between py-3 border-b last:border-0"
    style={{ borderColor: "var(--medium-gray)" }}
  >
    <div className="flex-1 min-w-0 mr-4">
      <p
        className="text-sm font-semibold"
        style={{ color: "var(--dark-gray)" }}
      >
        {label}
      </p>
      {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors"
      style={{ backgroundColor: checked ? color : "#d1d5db" }}
    >
      <span
        className="inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
        style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  </div>
);

export default function StudentSettings() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const show = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Contact
  const [contact, setContact] = useState({
    phone: user?.phone || "",
    address: user?.address || "",
    email: user?.email || "",
  });

  // Password

  // Notifications
  // Choices saved on the account; anything never set defaults to on.
  const saved = (user?.notificationPrefs || {}) as Record<string, boolean>;
  const [notif, setNotif] = useState({
    resultsPublished: saved.resultsPublished ?? true,
    reportCardReady: saved.reportCardReady ?? true,
    attendanceAlert: saved.attendanceAlert ?? true,
    schoolAnnouncement: saved.schoolAnnouncement ?? true,
    emailNotifs: saved.emailNotifs ?? true,
  });

  const { settings } = useSettings();
  const canEdit = settings.selfUpdate?.student !== false;
  const [busy, setBusy] = useState("");

  const handleSaveContact = async () => {
    try {
      setBusy("contact");
      const updated = await updateProfile({
        phone: contact.phone.trim(),
        address: contact.address.trim(),
      });
      setContact((c) => ({
        ...c,
        phone: updated.phone || "",
        address: updated.address || "",
      }));
      show("Contact information saved");
    } catch (err: any) {
      show(err?.message || "Could not save your contact details", "error");
    } finally {
      setBusy("");
    }
  };

  const handleSaveNotif = async () => {
    try {
      setBusy("notif");
      await updateProfile({ notificationPrefs: notif });
      show("Notification preferences saved");
    } catch (err: any) {
      show(err?.message || "Could not save your preferences", "error");
    } finally {
      setBusy("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Student";

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
      <div>
        <h1
          className="text-xl font-black"
          style={{ color: "var(--dark-gray)" }}
        >
          Settings
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile banner */}
      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="h-20"
          style={{
            background:
              "linear-gradient(135deg,var(--royal-blue-dark),var(--royal-blue))",
          }}
        />
        <div className="px-6 pb-5 -mt-8">
          <div className="flex items-end gap-4 mb-3">
            <div
              className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-xl"
              style={{ backgroundColor: "var(--success-dark)" }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="pb-1">
              <p
                className="font-black text-base"
                style={{ color: "var(--dark-gray)" }}
              >
                {displayName}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#eef2ff", color: "var(--royal-blue)" }}
            >
              Student Portal
            </span>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#fff1f2", color: "var(--accent-red)" }}
            >
              AFSHTS
            </span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <Card
        icon={User}
        title="Contact Information"
        desc="Update your personal contact details"
      >
        <div className="space-y-4">
          <Field label="Email Address">
            <Input value={contact.email} disabled />
            <p className="text-xs text-gray-400 mt-1">
              Email can only be changed by the admin.
            </p>
          </Field>
          <Field label="Phone Number">
            <Input
              disabled={!canEdit}
              value={contact.phone}
              onChange={(e) =>
                setContact({ ...contact, phone: e.target.value })
              }
              placeholder="e.g. 0244 123 456"
            />
          </Field>
          <Field label="Home Address">
            <Input
              disabled={!canEdit}
              value={contact.address}
              onChange={(e) =>
                setContact({ ...contact, address: e.target.value })
              }
              placeholder="Your home address"
            />
          </Field>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSaveContact}
              disabled={!canEdit || busy === "contact"}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl"
              style={{ backgroundColor: "var(--royal-blue)" }}
            >
              <Save size={14} />{" "}
              {busy === "contact" ? "Saving…" : "Save Changes"}
            </button>
          </div>
          {!canEdit && (
            <p className="text-xs text-gray-400">
              The school has turned off editing of contact details. Ask the
              school office to update them.
            </p>
          )}
        </div>
      </Card>

      {/* Change Password */}
      <Card
        icon={Lock}
        title="Change Password"
        desc="Keep your account secure"
        color="var(--accent-red)"
      >
        <ChangePasswordForm submitLabel="Update Password" />
      </Card>

      {/* Notifications */}
      <Card
        icon={Bell}
        title="Notifications"
        desc="Choose what alerts you want to receive"
        color="var(--success-dark)"
      >
        <p
          className="text-xs mb-2 p-2.5 rounded-lg"
          style={{ backgroundColor: "#fffbeb", color: "#92400e" }}
        >
          Your choices are saved now. Messages will be sent once the school
          connects an SMS or email service.
        </p>
        <Toggle
          label="Results Published"
          desc="Get notified when your term results are published"
          checked={notif.resultsPublished}
          onChange={(v) => setNotif({ ...notif, resultsPublished: v })}
          color="var(--success-dark)"
        />
        <Toggle
          label="Report Card Ready"
          desc="Get notified when your report card is available to download"
          checked={notif.reportCardReady}
          onChange={(v) => setNotif({ ...notif, reportCardReady: v })}
          color="var(--success-dark)"
        />
        <Toggle
          label="Attendance Alerts"
          desc="Get warned when your attendance drops below the threshold"
          checked={notif.attendanceAlert}
          onChange={(v) => setNotif({ ...notif, attendanceAlert: v })}
          color="var(--success-dark)"
        />
        <Toggle
          label="School Announcements"
          desc="Receive important notices from the administration"
          checked={notif.schoolAnnouncement}
          onChange={(v) => setNotif({ ...notif, schoolAnnouncement: v })}
          color="var(--success-dark)"
        />
        <Toggle
          label="Email Notifications"
          desc="Receive the above notifications via email"
          checked={notif.emailNotifs}
          onChange={(v) => setNotif({ ...notif, emailNotifs: v })}
          color="var(--success-dark)"
        />
        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={handleSaveNotif}
            disabled={busy === "notif"}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl"
            style={{ backgroundColor: "var(--success-dark)" }}
          >
            <Save size={14} />{" "}
            {busy === "notif" ? "Saving…" : "Save Preferences"}
          </button>
        </div>
      </Card>

      {/* Sign Out */}
      <div
        className="bg-white rounded-2xl border shadow-sm p-5"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p
              className="font-black text-sm"
              style={{ color: "var(--dark-gray)" }}
            >
              Sign Out
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Sign out of your student account on this device
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl border-2 transition"
            style={{
              borderColor: "var(--accent-red)",
              color: "var(--accent-red)",
              backgroundColor: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--accent-red)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "var(--accent-red)";
            }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
