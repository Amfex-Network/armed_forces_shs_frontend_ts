// src/admin/audit-logs/AuditLogs.jsx
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  User,
  Shield,
  BookOpen,
  MessageSquare,
  Settings,
  Users,
  FileText,
  Calendar,
  ChevronDown,
  Trash2,
} from "lucide-react";

// ─── Mock audit log data ──────────────────────────────────────────────────────
const INITIAL_LOGS = [
  // Admin actions
  {
    id: 1,
    timestamp: "2025-03-17 14:32:10",
    user: "System Administrator",
    role: "admin",
    action: "LOGIN",
    module: "Auth",
    details: "Admin logged in from 192.168.1.10",
    status: "success",
    ip: "192.168.1.10",
  },
  {
    id: 2,
    timestamp: "2025-03-17 14:35:22",
    user: "System Administrator",
    role: "admin",
    action: "STUDENT_ADDED",
    module: "Students",
    details: "New student registered: Kwabena Acheampong (AFSHTS/2025/001)",
    status: "success",
    ip: "192.168.1.10",
  },
  {
    id: 3,
    timestamp: "2025-03-17 14:40:05",
    user: "System Administrator",
    role: "admin",
    action: "STUDENT_EDITED",
    module: "Students",
    details:
      "Student record updated: Adwoa Mensah (AFSHTS/2025/002) — class changed to Form 1 Science A",
    status: "success",
    ip: "192.168.1.10",
  },
  {
    id: 4,
    timestamp: "2025-03-17 14:45:18",
    user: "System Administrator",
    role: "admin",
    action: "PARENT_ADDED",
    module: "Parents",
    details: "New parent registered: Mr Emmanuel Asante (e.asante@gmail.com)",
    status: "success",
    ip: "192.168.1.10",
  },
  {
    id: 5,
    timestamp: "2025-03-17 14:50:33",
    user: "System Administrator",
    role: "admin",
    action: "SMS_SENT",
    module: "Communication",
    details:
      "Bulk SMS sent to All Parents (45 recipients) — Subject: Semester 1 Exam Notice",
    status: "success",
    ip: "192.168.1.10",
  },
  {
    id: 6,
    timestamp: "2025-03-17 15:00:12",
    user: "System Administrator",
    role: "admin",
    action: "REPORT_GENERATED",
    module: "Reports",
    details: "Report card generated for Form 3 Science A (42 students)",
    status: "success",
    ip: "192.168.1.10",
  },
  {
    id: 7,
    timestamp: "2025-03-17 15:10:44",
    user: "System Administrator",
    role: "admin",
    action: "TEACHER_ADDED",
    module: "Teachers",
    details:
      "New teacher added: Dr Yaa Agyemang (AFSHTS/TCH/015) — Mathematics dept",
    status: "success",
    ip: "192.168.1.10",
  },
  {
    id: 8,
    timestamp: "2025-03-17 15:20:09",
    user: "System Administrator",
    role: "admin",
    action: "GRADING_UPDATED",
    module: "Settings",
    details: "Grading configuration updated — pass score changed from 45 to 50",
    status: "success",
    ip: "192.168.1.10",
  },
  {
    id: 9,
    timestamp: "2025-03-17 15:30:55",
    user: "System Administrator",
    role: "admin",
    action: "EVENT_ADDED",
    module: "Calendar",
    details: "Calendar event added: Semester 1 Exams Begin (2025-03-24)",
    status: "success",
    ip: "192.168.1.10",
  },
  {
    id: 10,
    timestamp: "2025-03-17 15:45:22",
    user: "System Administrator",
    role: "admin",
    action: "LOGOUT",
    module: "Auth",
    details: "Admin logged out",
    status: "success",
    ip: "192.168.1.10",
  },

  // Teacher actions
  {
    id: 11,
    timestamp: "2025-03-17 08:05:33",
    user: "Capt Kwabena Adjei",
    role: "teacher",
    action: "LOGIN",
    module: "Auth",
    details: "Teacher logged in as Subject Teacher + Form Teacher",
    status: "success",
    ip: "192.168.1.22",
  },
  {
    id: 12,
    timestamp: "2025-03-17 08:15:44",
    user: "Capt Kwabena Adjei",
    role: "teacher",
    action: "SCORES_ENTERED",
    module: "Scores",
    details:
      "CA scores entered for Form 3 Science A — Core Mathematics (42 students)",
    status: "success",
    ip: "192.168.1.22",
  },
  {
    id: 13,
    timestamp: "2025-03-17 08:45:11",
    user: "Capt Kwabena Adjei",
    role: "teacher",
    action: "SCORES_SAVED",
    module: "Scores",
    details:
      "Exam scores saved for Form 2 Science A — Core Mathematics (40 students)",
    status: "success",
    ip: "192.168.1.22",
  },
  {
    id: 14,
    timestamp: "2025-03-17 09:10:05",
    user: "Mrs Ama Eshun",
    role: "teacher",
    action: "LOGIN",
    module: "Auth",
    details: "Teacher logged in as Subject Teacher",
    status: "success",
    ip: "192.168.1.25",
  },
  {
    id: 15,
    timestamp: "2025-03-17 09:20:18",
    user: "Mrs Ama Eshun",
    role: "teacher",
    action: "SCORES_ENTERED",
    module: "Scores",
    details:
      "CA scores entered for Form 2 Arts A — English Language (35 students)",
    status: "success",
    ip: "192.168.1.25",
  },
  {
    id: 16,
    timestamp: "2025-03-17 09:55:40",
    user: "Dr Kofi Osei",
    role: "teacher",
    action: "LOGIN",
    module: "Auth",
    details: "Teacher logged in as Subject Teacher + HOD",
    status: "success",
    ip: "192.168.1.30",
  },
  {
    id: 17,
    timestamp: "2025-03-17 10:05:22",
    user: "Dr Kofi Osei",
    role: "teacher",
    action: "SCORES_SAVED",
    module: "Scores",
    details:
      "Exam scores saved for Form 3 Science B — Integrated Science (41 students)",
    status: "success",
    ip: "192.168.1.30",
  },
  {
    id: 18,
    timestamp: "2025-03-17 10:30:14",
    user: "Capt Kwabena Adjei",
    role: "teacher",
    action: "ATTENDANCE_MARKED",
    module: "Attendance",
    details:
      "Attendance marked for Form 3 Science A — Monday March 17 (42 students)",
    status: "success",
    ip: "192.168.1.22",
  },
  {
    id: 19,
    timestamp: "2025-03-17 11:00:33",
    user: "Mrs Abena Mensah",
    role: "teacher",
    action: "LOGIN",
    module: "Auth",
    details: "Teacher logged in as Subject Teacher + Form Teacher",
    status: "success",
    ip: "192.168.1.31",
  },
  {
    id: 20,
    timestamp: "2025-03-17 11:15:09",
    user: "Mrs Abena Mensah",
    role: "teacher",
    action: "REPORT_VIEWED",
    module: "Reports",
    details: "Report card viewed for Abena Frimpong (AFSHTS/2023/001)",
    status: "success",
    ip: "192.168.1.31",
  },

  // Student actions
  {
    id: 21,
    timestamp: "2025-03-17 07:30:55",
    user: "Kofi Asante",
    role: "student",
    action: "LOGIN",
    module: "Auth",
    details: "Student logged in — AFSHTS/2024/001",
    status: "success",
    ip: "192.168.1.50",
  },
  {
    id: 22,
    timestamp: "2025-03-17 07:35:22",
    user: "Kofi Asante",
    role: "student",
    action: "RESULTS_VIEWED",
    module: "Results",
    details: "Semester 1 results viewed by student",
    status: "success",
    ip: "192.168.1.50",
  },
  {
    id: 23,
    timestamp: "2025-03-17 07:40:11",
    user: "Kofi Asante",
    role: "student",
    action: "REPORT_PRINTED",
    module: "Reports",
    details: "Report card printed/saved as PDF",
    status: "success",
    ip: "192.168.1.50",
  },
  {
    id: 24,
    timestamp: "2025-03-17 07:45:33",
    user: "Akosua Bonsu",
    role: "student",
    action: "LOGIN",
    module: "Auth",
    details: "Student logged in — AFSHTS/2024/010",
    status: "success",
    ip: "192.168.1.55",
  },
  {
    id: 25,
    timestamp: "2025-03-17 07:50:44",
    user: "Akosua Bonsu",
    role: "student",
    action: "PROFILE_UPDATED",
    module: "Profile",
    details: "Student contact information updated — phone number changed",
    status: "success",
    ip: "192.168.1.55",
  },

  // Parent actions
  {
    id: 26,
    timestamp: "2025-03-17 19:00:12",
    user: "Mr Emmanuel Asante",
    role: "parent",
    action: "LOGIN",
    module: "Auth",
    details: "Parent logged in — parent@afts.edu.gh",
    status: "success",
    ip: "192.168.2.10",
  },
  {
    id: 27,
    timestamp: "2025-03-17 19:05:33",
    user: "Mr Emmanuel Asante",
    role: "parent",
    action: "RESULTS_VIEWED",
    module: "Results",
    details: "Child results viewed — Kofi Asante (AFSHTS/2024/001)",
    status: "success",
    ip: "192.168.2.10",
  },
  {
    id: 28,
    timestamp: "2025-03-17 19:10:18",
    user: "Mr Emmanuel Asante",
    role: "parent",
    action: "REPORT_VIEWED",
    module: "Reports",
    details: "Child report card viewed — Kofi Asante (AFSHTS/2024/001)",
    status: "success",
    ip: "192.168.2.10",
  },
  {
    id: 29,
    timestamp: "2025-03-17 19:15:44",
    user: "Mrs Grace Mensah",
    role: "parent",
    action: "LOGIN",
    module: "Auth",
    details: "Parent logged in — grace@afts.edu.gh",
    status: "success",
    ip: "192.168.2.15",
  },
  {
    id: 30,
    timestamp: "2025-03-17 19:20:55",
    user: "Mrs Grace Mensah",
    role: "parent",
    action: "ATTENDANCE_VIEWED",
    module: "Attendance",
    details: "Child attendance viewed — Yaw Mensah (AFSHTS/2024/003)",
    status: "success",
    ip: "192.168.2.15",
  },

  // Failed/warning actions
  {
    id: 31,
    timestamp: "2025-03-17 13:00:44",
    user: "Unknown",
    role: "unknown",
    action: "LOGIN_FAILED",
    module: "Auth",
    details:
      "Failed login attempt — email: unknown@test.com — invalid credentials",
    status: "failed",
    ip: "192.168.5.99",
  },
  {
    id: 32,
    timestamp: "2025-03-17 13:05:22",
    user: "Unknown",
    role: "unknown",
    action: "LOGIN_FAILED",
    module: "Auth",
    details:
      "Failed login attempt — email: admin@afts.edu.gh — wrong password (attempt 2/3)",
    status: "failed",
    ip: "192.168.5.99",
  },
  {
    id: 33,
    timestamp: "2025-03-16 16:30:11",
    user: "System Administrator",
    role: "admin",
    action: "STUDENT_DELETED",
    module: "Students",
    details: "Student record deleted: Ekow Asare (AFSHTS/2024/009)",
    status: "warning",
    ip: "192.168.1.10",
  },
  {
    id: 34,
    timestamp: "2025-03-16 10:15:44",
    user: "Capt Kwabena Adjei",
    role: "teacher",
    action: "SCORES_FAILED",
    module: "Scores",
    details:
      "Score entry failed — invalid CA score (35/30) for student AFSHTS/2025/003",
    status: "failed",
    ip: "192.168.1.22",
  },
  {
    id: 35,
    timestamp: "2025-03-15 09:00:33",
    user: "System Administrator",
    role: "admin",
    action: "EMAIL_SENT",
    module: "Communication",
    details:
      "Bulk email sent to All Teachers (15 recipients) — Subject: Staff Meeting Notice",
    status: "success",
    ip: "192.168.1.10",
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const ACTION_CONFIG = {
  LOGIN: {
    label: "Login",
    color: "var(--royal-blue)",
    bg: "#eef2ff",
    icon: User,
  },
  LOGOUT: { label: "Logout", color: "#6b7280", bg: "#f3f4f6", icon: User },
  LOGIN_FAILED: {
    label: "Login Failed",
    color: "var(--accent-red)",
    bg: "#fff1f2",
    icon: Shield,
  },
  STUDENT_ADDED: {
    label: "Student Added",
    color: "var(--success-dark)",
    bg: "#f0fdf4",
    icon: Users,
  },
  STUDENT_EDITED: {
    label: "Student Edited",
    color: "var(--warning)",
    bg: "#fffbeb",
    icon: Users,
  },
  STUDENT_DELETED: {
    label: "Student Deleted",
    color: "var(--accent-red)",
    bg: "#fff1f2",
    icon: Users,
  },
  PARENT_ADDED: {
    label: "Parent Added",
    color: "var(--success-dark)",
    bg: "#f0fdf4",
    icon: Users,
  },
  TEACHER_ADDED: {
    label: "Teacher Added",
    color: "var(--success-dark)",
    bg: "#f0fdf4",
    icon: Users,
  },
  SCORES_ENTERED: {
    label: "Scores Entered",
    color: "var(--royal-blue)",
    bg: "#eef2ff",
    icon: BookOpen,
  },
  SCORES_SAVED: {
    label: "Scores Saved",
    color: "var(--success-dark)",
    bg: "#f0fdf4",
    icon: BookOpen,
  },
  SCORES_FAILED: {
    label: "Score Error",
    color: "var(--accent-red)",
    bg: "#fff1f2",
    icon: BookOpen,
  },
  ATTENDANCE_MARKED: {
    label: "Attendance Marked",
    color: "var(--royal-blue)",
    bg: "#eef2ff",
    icon: Calendar,
  },
  ATTENDANCE_VIEWED: {
    label: "Attendance Viewed",
    color: "#7c3aed",
    bg: "#f5f3ff",
    icon: Calendar,
  },
  RESULTS_VIEWED: {
    label: "Results Viewed",
    color: "#7c3aed",
    bg: "#f5f3ff",
    icon: FileText,
  },
  REPORT_GENERATED: {
    label: "Report Generated",
    color: "var(--success-dark)",
    bg: "#f0fdf4",
    icon: FileText,
  },
  REPORT_VIEWED: {
    label: "Report Viewed",
    color: "#7c3aed",
    bg: "#f5f3ff",
    icon: FileText,
  },
  REPORT_PRINTED: {
    label: "Report Printed",
    color: "var(--success-dark)",
    bg: "#f0fdf4",
    icon: FileText,
  },
  SMS_SENT: {
    label: "SMS Sent",
    color: "var(--success-dark)",
    bg: "#f0fdf4",
    icon: MessageSquare,
  },
  EMAIL_SENT: {
    label: "Email Sent",
    color: "var(--success-dark)",
    bg: "#f0fdf4",
    icon: MessageSquare,
  },
  PROFILE_UPDATED: {
    label: "Profile Updated",
    color: "var(--warning)",
    bg: "#fffbeb",
    icon: User,
  },
  GRADING_UPDATED: {
    label: "Grading Updated",
    color: "var(--warning)",
    bg: "#fffbeb",
    icon: Settings,
  },
  EVENT_ADDED: {
    label: "Event Added",
    color: "var(--royal-blue)",
    bg: "#eef2ff",
    icon: Calendar,
  },
};

const ROLE_STYLE = {
  admin: { bg: "#eef2ff", color: "var(--royal-blue)" },
  teacher: { bg: "#f0fdf4", color: "var(--success-dark)" },
  student: { bg: "#f5f3ff", color: "#7c3aed" },
  parent: { bg: "#fffbeb", color: "var(--warning)" },
  unknown: { bg: "#f3f4f6", color: "#6b7280" },
};

const MODULES = [
  "All",
  "Auth",
  "Students",
  "Teachers",
  "Parents",
  "Scores",
  "Attendance",
  "Reports",
  "Communication",
  "Calendar",
  "Settings",
  "Profile",
];
const ROLES = ["All", "admin", "teacher", "student", "parent"];

// ─── AuditLogs ────────────────────────────────────────────────────────────────
const AuditLogs = () => {
  const [search, setSearch] = useState("");
  const [filterModule, setFModule] = useState("All");
  const [filterRole, setFRole] = useState("All");
  const [filterDate, setFDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewLog, setViewLog] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const filtered = useMemo(
    () =>
      INITIAL_LOGS.filter((log) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          log.user.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          log.module.toLowerCase().includes(q);
        const matchModule =
          filterModule === "All" || log.module === filterModule;
        const matchRole = filterRole === "All" || log.role === filterRole;
        const matchDate = !filterDate || log.timestamp.startsWith(filterDate);
        return matchSearch && matchModule && matchRole && matchDate;
      }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    [search, filterModule, filterRole, filterDate],
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const activeFilters =
    [filterModule, filterRole].filter((f) => f !== "All").length +
    (filterDate ? 1 : 0);

  const handleExport = () => {
    const rows = ["Timestamp,User,Role,Action,Module,Status,IP,Details"];
    filtered.forEach((l) =>
      rows.push(
        `"${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.module}","${l.status}","${l.ip}","${l.details}"`,
      ),
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `AFTS_AuditLogs_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const stats = {
    total: INITIAL_LOGS.length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            Audit Logs
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            System activity log · {INITIAL_LOGS.length} total entries
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-sm"
          style={{ backgroundColor: "var(--royal-blue)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--royal-blue-dark)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--royal-blue)")
          }
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4" style={{ maxWidth: 220 }}>
        {[
          {
            label: "Total Events",
            value: stats.total,
            color: "var(--royal-blue)",
            icon: Clock,
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
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search user, action, details or IP…"
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
            Filters
            {activeFilters > 0 && (
              <span
                className="w-4 h-4 rounded-full text-white text-xs flex items-center justify-center"
                style={{ backgroundColor: "var(--royal-blue)" }}
              >
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Filter dropdowns */}
        {showFilters && (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {[
              {
                label: "Module",
                value: filterModule,
                set: (v) => {
                  setFModule(v);
                  setPage(1);
                },
                opts: MODULES,
              },
              {
                label: "Role",
                value: filterRole,
                set: (v) => {
                  setFRole(v);
                  setPage(1);
                },
                opts: ROLES,
              },
              {
                label: "Date",
                value: filterDate,
                set: (v) => {
                  setFDate(v);
                  setPage(1);
                },
                type: "date",
              },
            ].map(({ label, value, set, opts, type }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                {type === "date" ? (
                  <input
                    type="date"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 outline-none"
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
                ) : (
                  <select
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 outline-none bg-white capitalize"
                    style={{
                      borderColor: "var(--medium-gray)",
                      color: "var(--dark-gray)",
                    }}
                  >
                    {opts.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <strong>
              {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–
              {Math.min(page * PER_PAGE, filtered.length)}
            </strong>{" "}
            of <strong>{filtered.length}</strong> entries
          </p>
          {(search || activeFilters > 0) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFModule("All");
                setFStatus("All");
                setFRole("All");
                setFDate("");
                setPage(1);
              }}
              className="text-xs font-semibold"
              style={{ color: "var(--accent-red)" }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Log table */}
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
                {["Timestamp", "User / Role", "Action", "Module", ""].map(
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
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    No logs match your search or filter
                  </td>
                </tr>
              ) : (
                paginated.map((log) => {
                  const ac = ACTION_CONFIG[log.action] || {
                    label: log.action,
                    color: "#6b7280",
                    bg: "#f3f4f6",
                    icon: Info,
                  };
                  const rs = ROLE_STYLE[log.role] || ROLE_STYLE.unknown;
                  const ActionIcon = ac.icon;

                  return (
                    <tr key={log.id} className="hover:bg-gray-50 transition">
                      {/* Timestamp */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p
                          className="text-xs font-semibold"
                          style={{ color: "var(--dark-gray)" }}
                        >
                          {log.timestamp.split(" ")[0]}
                        </p>
                        <p className="text-xs text-gray-400">
                          {log.timestamp.split(" ")[1]}
                        </p>
                      </td>

                      {/* User + Role */}
                      <td className="px-4 py-3">
                        <p
                          className="text-xs font-semibold"
                          style={{ color: "var(--dark-gray)" }}
                        >
                          {log.user}
                        </p>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full font-semibold capitalize"
                          style={{ backgroundColor: rs.bg, color: rs.color }}
                        >
                          {log.role}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: ac.bg }}
                          >
                            <ActionIcon size={11} style={{ color: ac.color }} />
                          </div>
                          <span
                            className="text-xs font-semibold whitespace-nowrap"
                            style={{ color: ac.color }}
                          >
                            {ac.label}
                          </span>
                        </div>
                      </td>

                      {/* Module */}
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded font-semibold"
                          style={{
                            backgroundColor: "var(--light-gray)",
                            color: "var(--dark-gray)",
                          }}
                        >
                          {log.module}
                        </span>
                      </td>

                      {/* View */}
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setViewLog(log)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 transition"
                          style={{ color: "var(--royal-blue)" }}
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-3 border-t"
            style={{
              borderColor: "var(--medium-gray)",
              backgroundColor: "var(--light-gray)",
            }}
          >
            <p className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border transition disabled:opacity-40"
                style={{
                  borderColor: "var(--medium-gray)",
                  color: "var(--dark-gray)",
                }}
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className="w-8 h-8 text-xs font-semibold rounded-lg transition"
                    style={{
                      backgroundColor:
                        page === p ? "var(--royal-blue)" : "white",
                      color: page === p ? "white" : "var(--dark-gray)",
                      border: "1px solid var(--medium-gray)",
                    }}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border transition disabled:opacity-40"
                style={{
                  borderColor: "var(--medium-gray)",
                  color: "var(--dark-gray)",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {viewLog &&
        (() => {
          const ac = ACTION_CONFIG[viewLog.action] || {
            label: viewLog.action,
            color: "#6b7280",
            bg: "#f3f4f6",
            icon: Info,
          };
          const rs = ROLE_STYLE[viewLog.role] || ROLE_STYLE.unknown;
          const ActionIcon = ac.icon;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
                  }}
                >
                  <div className="flex items-center gap-3 text-white">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                    >
                      <ActionIcon size={16} />
                    </div>
                    <div>
                      <p className="font-black">{ac.label}</p>
                      <p className="text-blue-200 text-xs">
                        {viewLog.module} · {viewLog.timestamp}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewLog(null)}
                    className="text-white hover:text-blue-200"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div
                  className="h-1"
                  style={{ backgroundColor: "var(--royal-blue)" }}
                />
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "User", value: viewLog.user },
                      {
                        label: "Role",
                        value: viewLog.role,
                        badge: true,
                        style: rs,
                      },
                      { label: "Module", value: viewLog.module },
                      { label: "Timestamp", value: viewLog.timestamp },
                    ].map(({ label, value, badge, style: bStyle }) => (
                      <div
                        key={label}
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: "var(--light-gray)" }}
                      >
                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                        {badge && bStyle ? (
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
                            style={{
                              backgroundColor: bStyle.bg,
                              color: bStyle.color,
                            }}
                          >
                            {value}
                          </span>
                        ) : (
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "var(--dark-gray)" }}
                          >
                            {value}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-400">
                      Event Details
                    </p>
                    <div
                      className="p-4 rounded-xl text-sm leading-relaxed"
                      style={{
                        backgroundColor: "var(--light-gray)",
                        color: "var(--dark-gray)",
                        border: `2px solid ${ac.color}20`,
                      }}
                    >
                      {viewLog.details}
                    </div>
                  </div>
                </div>
                <div
                  className="flex justify-end px-5 py-3 border-t"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  <button
                    type="button"
                    onClick={() => setViewLog(null)}
                    className="px-4 py-2 text-sm font-semibold rounded-xl border"
                    style={{
                      borderColor: "var(--medium-gray)",
                      color: "var(--dark-gray)",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default AuditLogs;
