// src/admin/settings/Settings.jsx
import React, { useState } from "react";
import {
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  School,
  Globe,
  Shield,
  Bell,
  Users,
  Database,
  Upload,
  Info,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";

// ─── Toggle Switch ────────────────────────────────────────────────────────────
const ToggleSwitch = ({
  checked,
  onChange,
  label,
  description,
  color = "var(--royal-blue)",
}) => (
  <div
    className="flex items-center justify-between py-3 border-b"
    style={{ borderColor: "var(--medium-gray)" }}
  >
    <div className="flex-1 min-w-0 mr-4">
      <p
        className="text-sm font-semibold"
        style={{ color: "var(--dark-gray)" }}
      >
        {label}
      </p>
      {description && (
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      )}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200"
      style={{ backgroundColor: checked ? color : "#d1d5db" }}
    >
      <span
        className="inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({
  icon: Icon,
  title,
  description,
  color = "var(--royal-blue)",
  children,
}) => (
  <div
    className="bg-white rounded-xl border shadow-sm overflow-hidden"
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
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({ label, description, children }) => (
  <div
    className="py-3 border-b last:border-0"
    style={{ borderColor: "var(--medium-gray)" }}
  >
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--dark-gray)" }}
        >
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0 w-full sm:w-auto sm:min-w-[200px]">
        {children}
      </div>
    </div>
  </div>
);

const InputField = ({ value, onChange, placeholder, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-3 py-2 text-sm rounded-lg border-2 outline-none"
    style={{ borderColor: "var(--medium-gray)", color: "var(--dark-gray)" }}
    onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
    onBlur={(e) => (e.target.style.borderColor = "var(--medium-gray)")}
  />
);

const SelectField = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2 text-sm rounded-lg border-2 outline-none bg-white"
    style={{ borderColor: "var(--medium-gray)", color: "var(--dark-gray)" }}
    onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
    onBlur={(e) => (e.target.style.borderColor = "var(--medium-gray)")}
  >
    {options.map((o) => (
      <option key={o.value || o} value={o.value || o}>
        {o.label || o}
      </option>
    ))}
  </select>
);

// ─── Settings ────────────────────────────────────────────────────────────────
const Settings = () => {
  // ── School Info ──────────────────────────────────────────────────────────
  const [school, setSchool] = useState({
    name: "Armed Forces Senior High Technical School",
    shortName: "AFSHTS",
    motto: "Service With Humanity",
    address: "Uaddara Barracks, Kumasi, Ghana",
    phone: "+233 32 200 0001",
    email: "info@afts.edu.gh",
    website: "www.afts.edu.gh",
    region: "Ashanti Region",
    type: "Senior High Technical School",
    waecCode: "GH0042",
  });
  const setS = (k, v) => setSchool((s) => ({ ...s, [k]: v }));

  // ── System Preferences ────────────────────────────────────────────────────
  const [prefs, setPrefs] = useState({
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24hr",
    timezone: "Africa/Accra",
    language: "English",
    currency: "GHS (₵)",
    theme: "light",
  });
  const setP = (k, v) => setPrefs((p) => ({ ...p, [k]: v }));

  // ── Security ──────────────────────────────────────────────────────────────
  const [security, setSecurity] = useState({
    sessionTimeout: 30,
    maxLoginAttempts: 3,
    passwordMinLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChar: false,
    twoFactor: false,
    lockAfterFail: true,
  });
  const setSec = (k, v) => setSecurity((s) => ({ ...s, [k]: v }));

  // ── Notifications ─────────────────────────────────────────────────────────
  const [notif, setNotif] = useState({
    emailAlerts: true,
    smsAlerts: true,
    lowAttendanceAlert: true,
    attendanceThreshold: 95,
    scoreSubmissionAlert: true,
    parentLoginAlert: false,
    systemErrorAlert: true,
    weeklyReportEmail: true,
  });
  const setN = (k, v) => setNotif((n) => ({ ...n, [k]: v }));

  // ── Portal Access ─────────────────────────────────────────────────────────
  const [portals, setPortals] = useState({
    adminPortal: true,
    teacherPortal: true,
    studentPortal: true,
    parentPortal: true,
    studentSelfUpdate: true,
    parentSelfUpdate: true,
    resultVisibility: true,
    reportCardDownload: true,
  });
  const setPo = (k, v) => setPortals((p) => ({ ...p, [k]: v }));

  // ── Toast / Save ──────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const [savedSections, setSavedSec] = useState({});

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (section) => {
    setSavedSec((s) => ({ ...s, [section]: true }));
    showToast(`${section} settings saved successfully`);
    setTimeout(() => setSavedSec((s) => ({ ...s, [section]: false })), 2000);
  };

  const SaveButton = ({ section }) => (
    <div className="flex justify-end pt-2">
      <button
        type="button"
        onClick={() => handleSave(section)}
        className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl transition"
        style={{
          backgroundColor: savedSections[section]
            ? "var(--success-dark)"
            : "var(--royal-blue)",
        }}
        onMouseEnter={(e) => {
          if (!savedSections[section])
            e.currentTarget.style.backgroundColor = "var(--royal-blue-dark)";
        }}
        onMouseLeave={(e) => {
          if (!savedSections[section])
            e.currentTarget.style.backgroundColor = "var(--royal-blue)";
        }}
      >
        {savedSections[section] ? (
          <>
            <CheckCircle2 size={14} /> Saved!
          </>
        ) : (
          <>
            <Save size={14} /> Save {section}
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2"
          style={{
            backgroundColor: "var(--success-dark)",
            animation: "fadeIn .2s ease",
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
          System-wide configuration for Armed Forces SHTS
        </p>
      </div>

      {/* ── School Information ─────────────────────────────────────────── */}
      <SectionCard
        icon={School}
        title="School Information"
        description="Basic school details used across all portals and reports"
        color="var(--royal-blue)"
      >
        <div className="space-y-1">
          <Field
            label="Full School Name"
            description="Appears on report cards and official documents"
          >
            <InputField
              value={school.name}
              onChange={(v) => setS("name", v)}
              placeholder="School name"
            />
          </Field>
          <Field label="Short Name / Acronym">
            <InputField
              value={school.shortName}
              onChange={(v) => setS("shortName", v)}
              placeholder="e.g. AFSHTS"
            />
          </Field>
          <Field label="School Motto">
            <InputField
              value={school.motto}
              onChange={(v) => setS("motto", v)}
              placeholder="School motto"
            />
          </Field>
          <Field label="Physical Address">
            <InputField
              value={school.address}
              onChange={(v) => setS("address", v)}
              placeholder="Address"
            />
          </Field>
          <Field label="Phone Number">
            <InputField
              value={school.phone}
              onChange={(v) => setS("phone", v)}
              placeholder="+233 ..."
            />
          </Field>
          <Field label="Official Email">
            <InputField
              value={school.email}
              onChange={(v) => setS("email", v)}
              placeholder="info@school.edu.gh"
              type="email"
            />
          </Field>
          <Field label="Website">
            <InputField
              value={school.website}
              onChange={(v) => setS("website", v)}
              placeholder="www.school.edu.gh"
            />
          </Field>
          <Field label="Region">
            <SelectField
              value={school.region}
              onChange={(v) => setS("region", v)}
              options={[
                "Ashanti Region",
                "Greater Accra Region",
                "Central Region",
                "Western Region",
                "Eastern Region",
                "Northern Region",
                "Volta Region",
                "Brong-Ahafo Region",
                "Upper East Region",
                "Upper West Region",
              ]}
            />
          </Field>
          <Field label="WAEC Centre Code">
            <InputField
              value={school.waecCode}
              onChange={(v) => setS("waecCode", v)}
              placeholder="e.g. GH0042"
            />
          </Field>
        </div>
        <SaveButton section="School Info" />
      </SectionCard>

      {/* ── System Preferences ────────────────────────────────────────── */}
      <SectionCard
        icon={Globe}
        title="System Preferences"
        description="Display and localisation settings"
        color="#7c3aed"
      >
        <div className="space-y-1">
          <Field label="Date Format">
            <SelectField
              value={prefs.dateFormat}
              onChange={(v) => setP("dateFormat", v)}
              options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
            />
          </Field>
          <Field label="Time Format">
            <SelectField
              value={prefs.timeFormat}
              onChange={(v) => setP("timeFormat", v)}
              options={["24hr", "12hr (AM/PM)"]}
            />
          </Field>
          <Field label="Timezone">
            <SelectField
              value={prefs.timezone}
              onChange={(v) => setP("timezone", v)}
              options={[
                "Africa/Accra",
                "Africa/Lagos",
                "Europe/London",
                "America/New_York",
              ]}
            />
          </Field>
          <Field label="Language">
            <SelectField
              value={prefs.language}
              onChange={(v) => setP("language", v)}
              options={["English", "French"]}
            />
          </Field>
          <Field label="Currency">
            <SelectField
              value={prefs.currency}
              onChange={(v) => setP("currency", v)}
              options={["GHS (₵)", "USD ($)", "GBP (£)"]}
            />
          </Field>
        </div>
        <SaveButton section="Preferences" />
      </SectionCard>

      {/* ── Security ──────────────────────────────────────────────────── */}
      <SectionCard
        icon={Shield}
        title="Security Settings"
        description="Password policy, session management and access control"
        color="var(--accent-red)"
      >
        <div className="space-y-1">
          <Field
            label="Session Timeout"
            description="Auto-logout after inactivity (minutes)"
          >
            <SelectField
              value={String(security.sessionTimeout)}
              onChange={(v) => setSec("sessionTimeout", parseInt(v))}
              options={["15", "30", "60", "120"].map((v) => ({
                value: v,
                label: `${v} minutes`,
              }))}
            />
          </Field>
          <Field
            label="Max Login Attempts"
            description="Lock account after this many failed attempts"
          >
            <SelectField
              value={String(security.maxLoginAttempts)}
              onChange={(v) => setSec("maxLoginAttempts", parseInt(v))}
              options={["3", "5", "10"].map((v) => ({
                value: v,
                label: `${v} attempts`,
              }))}
            />
          </Field>
          <Field label="Minimum Password Length">
            <SelectField
              value={String(security.passwordMinLength)}
              onChange={(v) => setSec("passwordMinLength", parseInt(v))}
              options={["6", "8", "10", "12"].map((v) => ({
                value: v,
                label: `${v} characters`,
              }))}
            />
          </Field>
        </div>
        <div className="mt-3 space-y-0">
          <ToggleSwitch
            label="Require Uppercase Letter"
            description="Passwords must contain at least one uppercase letter"
            checked={security.requireUppercase}
            onChange={(v) => setSec("requireUppercase", v)}
            color="var(--accent-red)"
          />
          <ToggleSwitch
            label="Require Numbers"
            description="Passwords must contain at least one number"
            checked={security.requireNumbers}
            onChange={(v) => setSec("requireNumbers", v)}
            color="var(--accent-red)"
          />
          <ToggleSwitch
            label="Require Special Characters"
            description="Passwords must contain !@#$% etc."
            checked={security.requireSpecialChar}
            onChange={(v) => setSec("requireSpecialChar", v)}
            color="var(--accent-red)"
          />
          <ToggleSwitch
            label="Lock Account on Failed Login"
            description="Temporarily lock after max failed attempts"
            checked={security.lockAfterFail}
            onChange={(v) => setSec("lockAfterFail", v)}
            color="var(--accent-red)"
          />
          <ToggleSwitch
            label="Two-Factor Authentication"
            description="Require OTP code on login (SMS to registered phone)"
            checked={security.twoFactor}
            onChange={(v) => setSec("twoFactor", v)}
            color="var(--accent-red)"
          />
        </div>
        <SaveButton section="Security" />
      </SectionCard>

      {/* ── Notifications ─────────────────────────────────────────────── */}
      <SectionCard
        icon={Bell}
        title="Notification Settings"
        description="Configure automated alerts and notification triggers"
        color="var(--success-dark)"
      >
        <div className="space-y-0">
          <ToggleSwitch
            label="Email Alerts"
            description="Receive important system alerts via email"
            checked={notif.emailAlerts}
            onChange={(v) => setN("emailAlerts", v)}
          />
          <ToggleSwitch
            label="SMS Alerts"
            description="Receive critical alerts via SMS"
            checked={notif.smsAlerts}
            onChange={(v) => setN("smsAlerts", v)}
          />
          <ToggleSwitch
            label="Low Attendance Alert"
            description="Alert when student attendance drops below threshold"
            checked={notif.lowAttendanceAlert}
            onChange={(v) => setN("lowAttendanceAlert", v)}
          />
        </div>
        {notif.lowAttendanceAlert && (
          <div
            className="py-3 border-b"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Attendance Alert Threshold
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Alert when attendance falls below this percentage
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="99"
                  value={notif.attendanceThreshold}
                  onChange={(e) =>
                    setN("attendanceThreshold", parseInt(e.target.value) || 95)
                  }
                  className="w-20 px-3 py-2 text-sm rounded-lg border-2 outline-none text-center font-bold"
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
                <span className="text-sm font-bold text-gray-400">%</span>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-0">
          <ToggleSwitch
            label="Score Submission Alert"
            description="Notify admin when teachers submit scores"
            checked={notif.scoreSubmissionAlert}
            onChange={(v) => setN("scoreSubmissionAlert", v)}
          />
          <ToggleSwitch
            label="Parent Login Notification"
            description="Alert when parent logs into portal"
            checked={notif.parentLoginAlert}
            onChange={(v) => setN("parentLoginAlert", v)}
          />
          <ToggleSwitch
            label="System Error Alerts"
            description="Get notified of system errors and failures"
            checked={notif.systemErrorAlert}
            onChange={(v) => setN("systemErrorAlert", v)}
          />
          <ToggleSwitch
            label="Weekly Summary Email"
            description="Receive weekly activity digest every Monday"
            checked={notif.weeklyReportEmail}
            onChange={(v) => setN("weeklyReportEmail", v)}
          />
        </div>
        <SaveButton section="Notifications" />
      </SectionCard>

      {/* ── Portal Access ─────────────────────────────────────────────── */}
      <SectionCard
        icon={Users}
        title="Portal Access Control"
        description="Enable or disable portals and user permissions"
        color="#0369a1"
      >
        <div className="space-y-0">
          <ToggleSwitch
            label="Admin Portal"
            description="System administrator access"
            checked={portals.adminPortal}
            onChange={(v) => setPo("adminPortal", v)}
            color="#0369a1"
          />
          <ToggleSwitch
            label="Teacher Portal"
            description="Allow teachers to log in and enter scores"
            checked={portals.teacherPortal}
            onChange={(v) => setPo("teacherPortal", v)}
            color="#0369a1"
          />
          <ToggleSwitch
            label="Student Portal"
            description="Allow students to view results and report cards"
            checked={portals.studentPortal}
            onChange={(v) => setPo("studentPortal", v)}
            color="#0369a1"
          />
          <ToggleSwitch
            label="Parent Portal"
            description="Allow parents to view children's academic records"
            checked={portals.parentPortal}
            onChange={(v) => setPo("parentPortal", v)}
            color="#0369a1"
          />
          <ToggleSwitch
            label="Students Can Update Profile"
            description="Allow students to edit their contact information"
            checked={portals.studentSelfUpdate}
            onChange={(v) => setPo("studentSelfUpdate", v)}
            color="#0369a1"
          />
          <ToggleSwitch
            label="Parents Can Update Profile"
            description="Allow parents to edit their contact information"
            checked={portals.parentSelfUpdate}
            onChange={(v) => setPo("parentSelfUpdate", v)}
            color="#0369a1"
          />
          <ToggleSwitch
            label="Results Visible to Students"
            description="Show term results in the student portal"
            checked={portals.resultVisibility}
            onChange={(v) => setPo("resultVisibility", v)}
            color="#0369a1"
          />
          <ToggleSwitch
            label="Report Card Download"
            description="Allow students and parents to print/save report cards"
            checked={portals.reportCardDownload}
            onChange={(v) => setPo("reportCardDownload", v)}
            color="#0369a1"
          />
        </div>
        <SaveButton section="Portal Access" />
      </SectionCard>

      {/* ── Data & Backup ─────────────────────────────────────────────── */}
      <SectionCard
        icon={Database}
        title="Data & Backup"
        description="Export data and manage system records"
        color="var(--dark-gray)"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              label: "Export All Students",
              desc: "Download full student database as CSV",
              color: "var(--royal-blue)",
            },
            {
              label: "Export All Parents",
              desc: "Download parent records as CSV",
              color: "#7c3aed",
            },
            {
              label: "Export All Teachers",
              desc: "Download teacher records as CSV",
              color: "var(--success-dark)",
            },
            {
              label: "Export All Results",
              desc: "Download term results as CSV",
              color: "var(--warning)",
            },
            {
              label: "Backup Full Database",
              desc: "Generate full system backup file",
              color: "var(--info)",
            },
            {
              label: "Export Audit Logs",
              desc: "Download all activity logs as CSV",
              color: "var(--dark-gray)",
            },
          ].map(({ label, desc, color }) => (
            <button
              key={label}
              type="button"
              className="flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm"
              style={{
                borderColor: color + "30",
                backgroundColor: color + "06",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = color + "30")
              }
              onClick={() => {
                const a = document.createElement("a");
                a.href = "#";
                a.download = `${label.replace(/\s+/g, "_")}.csv`;
                alert(`${label} — export would start here in the live system`);
              }}
            >
              <Database
                size={16}
                style={{ color, flexShrink: 0, marginTop: 2 }}
              />
              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Danger zone */}
        <div
          className="mt-5 p-4 rounded-xl border-2"
          style={{ borderColor: "#fecaca", backgroundColor: "#fff1f2" }}
        >
          <p
            className="text-sm font-black mb-1"
            style={{ color: "var(--accent-red)" }}
          >
            Danger Zone
          </p>
          <p className="text-xs text-gray-500 mb-3">
            These actions are irreversible. Proceed only when necessary.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                confirm("Clear all term data? This cannot be undone.") &&
                alert("Data cleared (demo only)")
              }
              className="px-4 py-2 text-xs font-bold rounded-xl border-2 transition"
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
              Clear Current Term Data
            </button>
            <button
              type="button"
              onClick={() =>
                confirm("Reset entire system? All data will be lost.") &&
                alert("System reset (demo only)")
              }
              className="px-4 py-2 text-xs font-bold rounded-xl border-2 transition"
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
              Factory Reset System
            </button>
          </div>
        </div>
      </SectionCard>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default Settings;
