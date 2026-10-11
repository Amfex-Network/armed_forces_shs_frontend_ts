// src/admin/settings/Settings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { transitionLabel } from "../../utils/transition";
import { useSettings } from "../../context/SettingsContext";
import type { AppSettings } from "../../api/settings";
import { studentsApi } from "../../api/students";
import { usersApi } from "../../api/users";
import { scoresApi } from "../../api/scores";
import { downloadCsv } from "../../utils/csv";
import {
  downloadPeopleExport,
  TEACHER_COLUMNS,
  PARENT_COLUMNS,
} from "../../utils/peopleSheets";
import {
  Save,
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
} from "lucide-react";

// Toggle Switch
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

// Section Card
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

// Field
const Field = ({
  label,
  description = "",
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) => (
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

const InputField = ({
  value,
  onChange,
  placeholder = "",
  type = "text",
}: any) => (
  <input
    type={type}
    value={value ?? ""}
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

// Settings
const REGIONS = [
  "",
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Bono",
  "Ahafo",
  "Bono East",
  "Oti",
  "North East",
  "Savannah",
  "Western North",
];

const SCHOOL_FIELDS: {
  key: keyof AppSettings;
  label: string;
  placeholder?: string;
}[] = [
  { key: "schoolName", label: "School Name" },
  { key: "shortName", label: "Short Name", placeholder: "e.g. AFSHTS" },
  { key: "motto", label: "Motto" },
  {
    key: "schoolType",
    label: "School Type",
    placeholder: "e.g. Senior High Technical School",
  },
  { key: "waecCode", label: "WAEC Centre Code" },
  { key: "district", label: "District" },
  { key: "address", label: "Address" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "website", label: "Website" },
];

type Access = {
  portalAccess: { teacher: boolean; student: boolean; parent: boolean };
  selfUpdate: { student: boolean; parent: boolean };
};

const stamp = () => new Date().toISOString().slice(0, 10);

const Settings = () => {
  const navigate = useNavigate();
  const { settings, save } = useSettings();

  const schoolFrom = (st: AppSettings) =>
    Object.fromEntries(
      [...SCHOOL_FIELDS.map((f) => f.key), "region"].map((k) => [
        k,
        (st[k as keyof AppSettings] as string) || "",
      ]),
    ) as Record<string, string>;
  const accessFrom = (st: AppSettings): Access => ({
    portalAccess: {
      teacher: st.portalAccess?.teacher !== false,
      student: st.portalAccess?.student !== false,
      parent: st.portalAccess?.parent !== false,
    },
    selfUpdate: {
      student: st.selfUpdate?.student !== false,
      parent: st.selfUpdate?.parent !== false,
    },
  });

  const [school, setSchool] = useState<Record<string, string>>(() =>
    schoolFrom(settings),
  );
  const [access, setAccess] = useState<Access>(() => accessFrom(settings));
  // A section follows the saved settings until it is edited, so saving one
  // section never wipes unsaved changes in another.
  const [edited, setEdited] = useState({ school: false, access: false });
  const editSchool: typeof setSchool = (v) => {
    setEdited((e) => ({ ...e, school: true }));
    setSchool(v);
  };
  const editAccess: typeof setAccess = (v) => {
    setEdited((e) => ({ ...e, access: true }));
    setAccess(v);
  };
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null,
  );

  useEffect(() => {
    if (!edited.school) setSchool(schoolFrom(settings));
    if (!edited.access) setAccess(accessFrom(settings));
  }, [settings, edited]);

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const run = async (key: string, task: () => Promise<void>, ok: string) => {
    try {
      setBusy(key);
      await task();
      showToast(ok);
    } catch (err: any) {
      showToast(err?.message || "Something went wrong", "error");
    } finally {
      setBusy("");
    }
  };

  const saveSchool = () => {
    if (!school.schoolName?.trim()) {
      showToast("School name cannot be empty", "error");
      return;
    }
    const payload = Object.fromEntries(
      Object.entries(school).map(([k, v]) => [k, v.trim()]),
    );
    run(
      "school",
      async () => {
        await save(payload);
        setEdited((e) => ({ ...e, school: false }));
      },
      "School information saved",
    );
  };

  const saveAccess = () =>
    run(
      "access",
      async () => {
        await save(access);
        setEdited((e) => ({ ...e, access: false }));
      },
      "Portal access saved",
    );

  const exportStudents = () =>
    run(
      "students",
      async () => {
        const list = await studentsApi.list();
        downloadCsv(`AFSHTS_Students_${stamp()}.csv`, [
          [
            "Student ID",
            "First Name",
            "Last Name",
            "Gender",
            "Course",
            "Form Class",
            "Year Group",
            "Transition",
            "Status",
            "Email",
          ],
          ...list.map((x) => [
            x.studentId,
            x.firstName,
            x.lastName,
            x.gender,
            x.course,
            x.formClass,
            x.yearGroup,
            transitionLabel(x.track),
            x.status,
            x.email,
          ]),
        ]);
      },
      "Students exported",
    );

  const exportStaff = (role: "teacher" | "parent") =>
    run(
      role,
      async () => {
        const all = await usersApi.list();
        const people = all.filter((u) => u.role === role);
        if (role === "teacher") {
          downloadPeopleExport(
            `AFSHTS_Teachers_${stamp()}.xlsx`,
            TEACHER_COLUMNS,
            people,
          );
        } else {
          const students = await studentsApi.list();
          downloadPeopleExport(
            `AFSHTS_Parents_${stamp()}.xlsx`,
            PARENT_COLUMNS,
            people.map((p) => ({
              ...p,
              children: students
                .filter((x) => x.parentId === p.id)
                .map((x) => x.studentId),
            })),
          );
        }
      },
      role === "teacher" ? "Teachers exported" : "Parents exported",
    );

  const exportResults = () =>
    run(
      "results",
      async () => {
        const scores = await scoresApi.list();
        const rows = scores.map((sc) => {
          const st = typeof sc.student === "object" ? sc.student : null;
          return [
            st?.studentId || "",
            st ? `${st.lastName || ""} ${st.firstName || ""}`.trim() : "",
            st?.formClass || sc.formClass || "",
            sc.subject,
            sc.academicYear,
            sc.term,
            sc.classScore,
            sc.examScore,
            sc.total,
            sc.grade,
          ];
        });
        downloadCsv(`AFSHTS_Results_${stamp()}.csv`, [
          [
            "Index No.",
            "Student",
            "Class",
            "Subject",
            "Academic Year",
            "Term",
            "CA (30)",
            "Exam (70)",
            "Total",
            "Grade",
          ],
          ...rows,
        ]);
      },
      "Results exported",
    );

  const btn = (key: string, label: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      disabled={!!busy}
      className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl disabled:opacity-60"
      style={{ backgroundColor: "var(--royal-blue)" }}
    >
      <Save size={14} /> {busy === key ? "Working…" : label}
    </button>
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2"
          style={{
            backgroundColor:
              toast.type === "error"
                ? "var(--accent-red)"
                : "var(--success-dark)",
          }}
          role="status"
        >
          {toast.type === "error" ? (
            <AlertCircle size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}
          {toast.msg}
        </div>
      )}

      <div>
        <h1
          className="text-xl font-black"
          style={{ color: "var(--dark-gray)" }}
        >
          Settings
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          System-wide configuration for{" "}
          {settings.shortName || settings.schoolName}
        </p>
      </div>

      {/* School Information */}
      <SectionCard
        icon={School}
        title="School Information"
        description="Shown on report cards and across the portals"
      >
        <div className="space-y-1">
          {SCHOOL_FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              <InputField
                value={school[f.key]}
                onChange={(v: string) =>
                  editSchool((x) => ({ ...x, [f.key]: v }))
                }
                placeholder={f.placeholder}
              />
            </Field>
          ))}
          <Field label="Region">
            <SelectField
              value={school.region}
              onChange={(v: string) => editSchool((x) => ({ ...x, region: v }))}
              options={REGIONS.map((r) => ({
                value: r,
                label: r || "- Select -",
              }))}
            />
          </Field>
        </div>
        <div className="flex justify-end pt-3">
          {btn("school", "Save School Information", saveSchool)}
        </div>
      </SectionCard>

      {/* Portal Access */}
      <SectionCard
        icon={Users}
        title="Portal Access"
        description="Open or close portals, enforced on every sign-in and request"
        color="#7c3aed"
      >
        <ToggleSwitch
          label="Teacher Portal"
          description="Teachers can sign in to enter scores, attendance and remarks"
          checked={access.portalAccess.teacher}
          onChange={(v: boolean) =>
            editAccess((a) => ({
              ...a,
              portalAccess: { ...a.portalAccess, teacher: v },
            }))
          }
          color="#7c3aed"
        />
        <ToggleSwitch
          label="Student Portal"
          description="Students can sign in to see published results"
          checked={access.portalAccess.student}
          onChange={(v: boolean) =>
            editAccess((a) => ({
              ...a,
              portalAccess: { ...a.portalAccess, student: v },
            }))
          }
          color="#7c3aed"
        />
        <ToggleSwitch
          label="Parent Portal"
          description="Parents can sign in to see their children's published results"
          checked={access.portalAccess.parent}
          onChange={(v: boolean) =>
            editAccess((a) => ({
              ...a,
              portalAccess: { ...a.portalAccess, parent: v },
            }))
          }
          color="#7c3aed"
        />
        <ToggleSwitch
          label="Students May Edit Their Contact Details"
          description="Phone and address on the student's own profile"
          checked={access.selfUpdate.student}
          onChange={(v: boolean) =>
            editAccess((a) => ({
              ...a,
              selfUpdate: { ...a.selfUpdate, student: v },
            }))
          }
          color="#7c3aed"
        />
        <ToggleSwitch
          label="Parents May Edit Their Contact Details"
          description="Phone and address on the parent's own profile"
          checked={access.selfUpdate.parent}
          onChange={(v: boolean) =>
            editAccess((a) => ({
              ...a,
              selfUpdate: { ...a.selfUpdate, parent: v },
            }))
          }
          color="#7c3aed"
        />
        <p className="text-xs text-gray-400 mt-3">
          The admin portal is always open so the school can never lock itself
          out. Closing a portal signs its users out at once. Results also need
          to be published (Publish Reports) before students and parents see
          them.
        </p>
        <div className="flex justify-end pt-3">
          {btn("access", "Save Portal Access", saveAccess)}
        </div>
      </SectionCard>

      {/* Security */}
      <SectionCard
        icon={Shield}
        title="Security Settings"
        description="Protections enforced on every account and request"
        color="var(--accent-red)"
      >
        <p className="text-xs text-gray-500 mb-2">
          These protections are built in and always enforced by the server.
        </p>
        <ul className="divide-y" style={{ borderColor: "var(--medium-gray)" }}>
          <li className="py-2.5">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--dark-gray)" }}
            >
              Passwords
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              At least 10 characters with uppercase, lowercase and a number;
              checked on the server.
            </p>
          </li>
          <li className="py-2.5">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--dark-gray)" }}
            >
              Temporary passwords
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              New and reset accounts get a random 12-character one-time password
              that must be changed at first sign-in.
            </p>
          </li>
          <li className="py-2.5">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--dark-gray)" }}
            >
              Failed sign-ins
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              After 10 failed attempts an account is locked for 15 minutes,
              whatever device or network they come from.
            </p>
          </li>
          <li className="py-2.5">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--dark-gray)" }}
            >
              Sessions
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Stored only in a secure HttpOnly cookie (not readable by page
              scripts) and expire after the configured lifetime.
            </p>
          </li>
          <li className="py-2.5">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--dark-gray)" }}
            >
              Instant revocation
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Deactivating a user, changing their role, resetting or changing a
              password, or signing out ends their sessions immediately.
            </p>
          </li>
          <li className="py-2.5">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--dark-gray)" }}
            >
              Access control
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Every request is checked on the server: teachers see only their
              assigned classes, parents only their linked children, students
              only themselves.
            </p>
          </li>
          <li className="py-2.5">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--dark-gray)" }}
            >
              Request protection
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Cross-site request forgery checks, input sanitising, request size
              limits, rate limiting and secure HTTP headers.
            </p>
          </li>
          <li className="py-2.5">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--dark-gray)" }}
            >
              Audit trail
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Sign-ins, every change, and refused attempts are recorded in Audit
              Logs.
            </p>
          </li>
        </ul>
      </SectionCard>

      {/* Regional */}
      <SectionCard
        icon={Globe}
        title="Regional Format"
        description="Fixed for Ghana"
        color="var(--success-dark)"
      >
        <ul
          className="text-sm divide-y"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          {[
            ["Dates", "Day/Month/Year (e.g. 8 October 2026)"],
            ["Time zone", "Africa/Accra (GMT)"],
            ["Currency", "Ghana Cedi (GHS)"],
            ["Language", "English"],
          ].map(([k, v]) => (
            <li key={k} className="py-2.5 flex justify-between gap-3">
              <span className="text-gray-500">{k}</span>
              <span
                className="font-semibold"
                style={{ color: "var(--dark-gray)" }}
              >
                {v}
              </span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Notifications */}
      <SectionCard
        icon={Bell}
        title="Notifications"
        description="SMS and email alerts"
        color="var(--warning)"
      >
        <div
          className="flex items-start gap-3 p-3 rounded-xl text-sm"
          style={{ backgroundColor: "#fffbeb", color: "#92400e" }}
        >
          <Info size={16} className="flex-shrink-0 mt-0.5" />
          <p>
            No SMS or email service is connected yet, so the system does not
            send messages. Students and parents can already choose which alerts
            they want on their Settings page; those choices are kept for when a
            provider (for example Hubtel, Arkesel or mNotify) is connected.
          </p>
        </div>
      </SectionCard>

      {/* Data export */}
      <SectionCard
        icon={Database}
        title="Data Export"
        description="Download school records for safekeeping or reporting"
        color="var(--info)"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              key: "students",
              label: "All Students (CSV)",
              go: exportStudents,
            },
            {
              key: "teacher",
              label: "All Teachers (Excel)",
              go: () => exportStaff("teacher"),
            },
            {
              key: "parent",
              label: "All Parents (Excel)",
              go: () => exportStaff("parent"),
            },
            { key: "results", label: "All Results (CSV)", go: exportResults },
            {
              key: "audit",
              label: "Audit Logs",
              go: () => navigate("/dashboard/auditLogs"),
            },
          ].map((x) => (
            <button
              key={x.key}
              type="button"
              disabled={!!busy}
              onClick={x.go}
              className="flex items-center gap-2 p-3 rounded-xl border-2 text-left text-sm font-semibold disabled:opacity-60"
              style={{
                borderColor: "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
            >
              <Upload size={14} style={{ transform: "rotate(180deg)" }} />
              {busy === x.key ? "Preparing…" : x.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Full database backups are made on the database host (enable daily
          backups there), not from this page. Exports contain personal data:
          store them securely.
        </p>
      </SectionCard>
    </div>
  );
};

export default Settings;
