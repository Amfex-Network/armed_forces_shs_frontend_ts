// src/admin/audit-logs/AuditLogs.jsx
import React, { useState, useMemo, useEffect } from "react";
import { auditApi, type AuditEntry } from "../../api/audit";
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
import { downloadCsv } from "../../utils/csv";

// Config
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

const ROLES = ["All", "admin", "teacher", "student", "parent"];

// AuditLogs
const AuditLogs = () => {
  const [search, setSearch] = useState("");
  const [filterModule, setFModule] = useState("All");
  const [filterRole, setFRole] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewLog, setViewLog] = useState(null);
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [allTotal, setAllTotal] = useState(0);
  const [modules, setModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [query, setQuery] = useState("");
  const PER_PAGE = 15;

  // Search is sent to the server once typing pauses.
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filters = useMemo(
    () => ({
      q: query,
      module: filterModule,
      role: filterRole,
      from: dateFrom,
      to: dateTo,
    }),
    [query, filterModule, filterRole, dateFrom, dateTo],
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    auditApi
      .list({ ...filters, limit: PER_PAGE, skip: (page - 1) * PER_PAGE })
      .then((res) => {
        if (!alive) return;
        setLogs(res.items);
        setTotal(res.total);
        setModules(res.modules);
        const unfiltered =
          !filters.q &&
          filters.module === "All" &&
          filters.role === "All" &&
          !filters.from &&
          !filters.to;
        if (unfiltered) setAllTotal(res.total);
      })
      .catch((err) => {
        if (!alive) return;
        setLogs([]);
        setTotal(0);
        setError(err?.message || "Could not load the audit logs.");
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [filters, page]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const paginated = logs;

  const activeFilters =
    [filterModule, filterRole].filter((f) => f !== "All").length +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0);

  const handleExport = async () => {
    setExporting(true);
    setError("");
    let all: AuditEntry[];
    try {
      all = (await auditApi.listAll(filters)).items;
    } catch (err) {
      setError(err?.message || "Could not export the audit logs.");
      setExporting(false);
      return;
    }
    const rows: unknown[][] = [
      [
        "Timestamp",
        "User",
        "Role",
        "Action",
        "Module",
        "Status",
        "IP",
        "Details",
      ],
    ];
    all.forEach((l) =>
      rows.push([
        l.timestamp,
        l.user,
        l.role,
        l.action,
        l.module,
        l.status,
        l.ip,
        l.details,
      ]),
    );
    const range =
      dateFrom || dateTo
        ? `_${dateFrom || "start"}_to_${dateTo || "today"}`
        : `_${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(`AFSHTS_AuditLogs${range}.csv`, rows);
    setExporting(false);
  };

  const stats = {
    total: allTotal,
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
            System activity log · {allTotal} total entries
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting || total === 0}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-sm disabled:opacity-60"
          style={{ backgroundColor: "var(--royal-blue)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--royal-blue-dark)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--royal-blue)")
          }
        >
          <Download size={14} />{" "}
          {exporting
            ? "Preparing…"
            : activeFilters > 0 || query
              ? `Export ${total} filtered`
              : "Export"}
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
              onChange={(e) => setSearch(e.target.value)}
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
          <div className="flex items-center gap-2">
            {[
              { label: "From", value: dateFrom, set: setDateFrom, max: dateTo },
              { label: "To", value: dateTo, set: setDateTo, min: dateFrom },
            ].map(({ label, value, set, min, max }) => (
              <label
                key={label}
                className="flex items-center gap-1.5 text-xs text-gray-500"
              >
                {label}
                <input
                  type="date"
                  value={value}
                  min={min || undefined}
                  max={max || undefined}
                  onChange={(e) => set(e.target.value)}
                  className="px-2 py-2 text-sm rounded-xl border-2 outline-none"
                  style={{
                    borderColor: value
                      ? "var(--royal-blue)"
                      : "var(--medium-gray)",
                    color: "var(--dark-gray)",
                  }}
                />
              </label>
            ))}
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
            className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            {[
              {
                label: "Module",
                value: filterModule,
                set: setFModule,
                opts: ["All", ...modules],
              },
              {
                label: "Role",
                value: filterRole,
                set: setFRole,
                opts: ROLES,
              },
            ].map(({ label, value, set, opts }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
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
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <strong>
              {Math.min((page - 1) * PER_PAGE + 1, total)}-
              {Math.min(page * PER_PAGE, total)}
            </strong>{" "}
            of <strong>{total}</strong> entries
          </p>
          {(search || activeFilters > 0) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFModule("All");
                setFRole("All");
                setDateFrom("");
                setDateTo("");
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
                    {loading
                      ? "Loading…"
                      : error || "No logs match your search or filter"}
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
