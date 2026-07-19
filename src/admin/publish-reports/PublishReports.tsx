// src/admin/publish-reports/PublishReports.jsx
import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Lock,
  Unlock,
  ChevronDown,
  Search,
  AlertTriangle,
  FileText,
  Users,
  BookOpen,
  Filter,
} from "lucide-react";
import { STUDENTS } from "../data/adminData";

// ─── Mock class report status data ───────────────────────────────────────────
const SEMESTERS = ["Semester 1", "Semester 2"];
const YEAR = "2024/2025";

const buildClassData = () => {
  const classMap = {};
  STUDENTS.forEach((s) => {
    if (!s.formClass) return;
    if (!classMap[s.formClass]) {
      classMap[s.formClass] = {
        formClass: s.formClass,
        yearGroup: s.year || "Form 1",
        course: s.course || s.program || "General Science",
        students: [],
        status: "pending", // pending | ready | published
        scoresSubmitted: 0,
        totalScores: 0,
        publishedAt: null,
        publishedBy: null,
      };
    }
    classMap[s.formClass].students.push(s);
  });

  // Mock score submission status
  Object.values(classMap).forEach((cls, i) => {
    const total = cls.students.length * 8; // 8 subjects each
    const submitted = Math.round(
      total * [0.6, 0.85, 1, 0.75, 1, 0.9, 0.55, 1][i % 8],
    );
    cls.totalScores = total;
    cls.scoresSubmitted = submitted;
    cls.status = submitted === total ? "ready" : "pending";
  });

  return Object.values(classMap).sort((a, b) =>
    a.formClass.localeCompare(b.formClass),
  );
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  pending: {
    color: "var(--warning)",
    bg: "#fffbeb",
    label: "Scores Pending",
    icon: Clock,
  },
  ready: {
    color: "var(--royal-blue)",
    bg: "#eef2ff",
    label: "Ready to Publish",
    icon: CheckCircle2,
  },
  published: {
    color: "var(--success-dark)",
    bg: "#f0fdf4",
    label: "Published",
    icon: Send,
  },
};

// ─── Confirm modal ────────────────────────────────────────────────────────────
const ConfirmModal = ({ classes, semester, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <div
        className="px-6 py-5"
        style={{
          background: "linear-gradient(135deg,var(--success-dark),#15803d)",
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          <Send size={22} color="white" />
        </div>
        <p className="text-white font-black text-center text-lg">
          Publish Reports
        </p>
        <p className="text-green-200 text-xs text-center mt-1">
          {YEAR} · {semester}
        </p>
      </div>
      <div className="h-1" style={{ backgroundColor: "var(--accent-red)" }} />

      <div className="p-5 space-y-4">
        <div
          className="p-3 rounded-xl border"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
          }}
        >
          <p
            className="text-sm font-bold mb-2"
            style={{ color: "var(--dark-gray)" }}
          >
            Publishing {classes.length} class{classes.length > 1 ? "es" : ""}:
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {classes.map((c) => (
              <div
                key={c.formClass}
                className="flex items-center justify-between text-xs"
              >
                <span style={{ color: "var(--dark-gray)" }}>{c.formClass}</span>
                <span className="text-gray-400">
                  {c.students.length} students
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex items-start gap-2 p-3 rounded-xl border"
          style={{ borderColor: "#fcd34d", backgroundColor: "#fffbeb" }}
        >
          <AlertTriangle
            size={14}
            style={{ color: "#b45309", flexShrink: 0, marginTop: 2 }}
          />
          <p className="text-xs" style={{ color: "#92400e" }}>
            Once published, students and parents will immediately see these
            reports in their portals. This action is logged in the audit trail.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl border"
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
            className="flex-1 py-2.5 text-sm font-black text-white rounded-xl flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--success-dark)" }}
          >
            <Send size={14} /> Publish Now
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const PublishReports = () => {
  const [semester, setSemester] = useState("Semester 1");
  const [classes, setClasses] = useState(buildClassData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFS] = useState("all");
  const [selected, setSelected] = useState([]);
  const [confirmData, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [expandClass, setExpand] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = useMemo(
    () =>
      classes.filter((c) => {
        const matchSearch =
          !search || c.formClass.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "all" || c.status === filterStatus;
        return matchSearch && matchStatus;
      }),
    [classes, search, filterStatus],
  );

  const allSelected =
    filtered.length > 0 &&
    filtered.every((c) => selected.includes(c.formClass));
  const toggleAll = () =>
    setSelected(allSelected ? [] : filtered.map((c) => c.formClass));
  const toggleOne = (fc) =>
    setSelected((s) =>
      s.includes(fc) ? s.filter((x) => x !== fc) : [...s, fc],
    );

  const readyClasses = classes.filter((c) => c.status === "ready");
  const pendingCount = classes.filter((c) => c.status === "pending").length;
  const publishedCount = classes.filter((c) => c.status === "published").length;

  const handlePublish = (classesToPublish) => {
    const now = new Date().toLocaleString();
    setClasses((cs) =>
      cs.map((c) =>
        classesToPublish.find((x) => x.formClass === c.formClass)
          ? {
              ...c,
              status: "published",
              publishedAt: now,
              publishedBy: "Admin",
            }
          : c,
      ),
    );
    setSelected([]);
    setConfirm(null);
    showToast(
      `${classesToPublish.length} class${classesToPublish.length > 1 ? "es" : ""} published successfully`,
    );
  };

  const handleUnpublish = (formClass) => {
    setClasses((cs) =>
      cs.map((c) =>
        c.formClass === formClass
          ? { ...c, status: "ready", publishedAt: null, publishedBy: null }
          : c,
      ),
    );
    showToast(`${formClass} unpublished`, "warning");
  };

  const selectedClasses = classes.filter(
    (c) => selected.includes(c.formClass) && c.status === "ready",
  );
  const completePct = (c) =>
    Math.round((c.scoresSubmitted / c.totalScores) * 100);

  return (
    <div className="space-y-5">
      {toast && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2"
          style={{
            backgroundColor:
              toast.type === "warning"
                ? "var(--warning)"
                : "var(--success-dark)",
          }}
        >
          <CheckCircle2 size={14} /> {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            Publish Terminal Reports
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Review and publish approved reports to students and parents
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Semester selector */}
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border-2 outline-none bg-white font-semibold"
            style={{
              borderColor: "var(--royal-blue)",
              color: "var(--royal-blue)",
            }}
          >
            {SEMESTERS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {selectedClasses.length > 0 && (
            <button
              type="button"
              onClick={() =>
                setConfirm({ classes: selectedClasses, isAll: false })
              }
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl"
              style={{ backgroundColor: "var(--success-dark)" }}
            >
              <Send size={14} /> Publish Selected ({selectedClasses.length})
            </button>
          )}

          {readyClasses.length > 0 && selectedClasses.length === 0 && (
            <button
              type="button"
              onClick={() => setConfirm({ classes: readyClasses, isAll: true })}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl"
              style={{ backgroundColor: "var(--success-dark)" }}
            >
              <Send size={14} /> Publish All Ready ({readyClasses.length})
            </button>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Scores Pending",
            value: pendingCount,
            color: "var(--warning)",
            bg: "#fffbeb",
            icon: Clock,
          },
          {
            label: "Ready to Publish",
            value: readyClasses.length,
            color: "var(--royal-blue)",
            bg: "#eef2ff",
            icon: FileText,
          },
          {
            label: "Published",
            value: publishedCount,
            color: "var(--success-dark)",
            bg: "#f0fdf4",
            icon: CheckCircle2,
          },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div
            key={label}
            className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: bg }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p
                className="text-2xl font-black"
                style={{ color: "var(--dark-gray)" }}
              >
                {value}
              </p>
              <p className="text-xs text-gray-400 leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-40">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search class..."
            className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border-2 outline-none"
            style={{ borderColor: "var(--medium-gray)" }}
          />
        </div>
        {["all", "pending", "ready", "published"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFS(f)}
            className="text-xs font-semibold px-3 py-2 rounded-xl capitalize"
            style={{
              backgroundColor:
                filterStatus === f ? "var(--royal-blue)" : "white",
              color: filterStatus === f ? "white" : "var(--dark-gray)",
              border: "1px solid var(--medium-gray)",
            }}
          >
            {f === "all" ? "All Classes" : STATUS[f]?.label || f}
          </button>
        ))}
      </div>

      {/* Class table */}
      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        {/* Table header */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
          }}
        >
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="rounded"
          />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 flex-1">
            Class — {filtered.length} classes
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 w-28 hidden sm:block">
            Score Completion
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 w-28 hidden sm:block">
            Students
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 w-28">
            Status
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 w-20">
            Action
          </p>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--medium-gray)" }}>
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-10">
              No classes match your filter
            </p>
          ) : (
            filtered.map((cls) => {
              const sc = STATUS[cls.status];
              const Icon = sc.icon;
              const pct = completePct(cls);
              const isExpand = expandClass === cls.formClass;

              return (
                <div key={cls.formClass}>
                  <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition">
                    <input
                      type="checkbox"
                      checked={selected.includes(cls.formClass)}
                      onChange={() => toggleOne(cls.formClass)}
                      className="rounded"
                      disabled={cls.status !== "ready"}
                    />

                    {/* Class info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className="font-black text-sm"
                          style={{ color: "var(--dark-gray)" }}
                        >
                          {cls.formClass}
                        </p>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: "#eef2ff",
                            color: "var(--royal-blue)",
                          }}
                        >
                          {cls.yearGroup}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{cls.course}</p>
                      {cls.publishedAt && (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--success-dark)" }}
                        >
                          Published {cls.publishedAt} by {cls.publishedBy}
                        </p>
                      )}
                    </div>

                    {/* Score completion bar */}
                    <div className="w-28 hidden sm:block">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">
                          {cls.scoresSubmitted}/{cls.totalScores}
                        </span>
                        <span
                          className="font-bold"
                          style={{
                            color:
                              pct === 100
                                ? "var(--success-dark)"
                                : pct > 75
                                  ? "var(--warning)"
                                  : "var(--accent-red)",
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: "var(--medium-gray)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor:
                              pct === 100
                                ? "var(--success-dark)"
                                : pct > 75
                                  ? "var(--warning)"
                                  : "var(--accent-red)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Students count */}
                    <div className="w-28 hidden sm:flex items-center gap-1.5">
                      <Users size={13} className="text-gray-400" />
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {cls.students.length}
                      </span>
                    </div>

                    {/* Status badge */}
                    <div className="w-28">
                      <span
                        className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg"
                        style={{ backgroundColor: sc.bg, color: sc.color }}
                      >
                        <Icon size={11} /> {sc.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="w-20 flex items-center gap-1">
                      {cls.status === "ready" && (
                        <button
                          type="button"
                          onClick={() =>
                            setConfirm({ classes: [cls], isAll: false })
                          }
                          className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg text-white"
                          style={{ backgroundColor: "var(--success-dark)" }}
                        >
                          <Send size={11} /> Publish
                        </button>
                      )}
                      {cls.status === "published" && (
                        <button
                          type="button"
                          onClick={() => handleUnpublish(cls.formClass)}
                          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border"
                          style={{
                            borderColor: "var(--warning)",
                            color: "var(--warning)",
                          }}
                        >
                          <Lock size={11} /> Unpublish
                        </button>
                      )}
                      {cls.status === "pending" && (
                        <span className="text-xs text-gray-400">
                          Awaiting scores
                        </span>
                      )}
                      {/* Expand */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpand(isExpand ? null : cls.formClass)
                        }
                        className="p-1 rounded text-gray-400 hover:text-gray-600"
                      >
                        <ChevronDown
                          size={14}
                          style={{
                            transform: isExpand ? "rotate(180deg)" : "none",
                          }}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expanded — student list */}
                  {isExpand && (
                    <div
                      className="px-4 pb-4 pt-2 border-t"
                      style={{
                        borderColor: "var(--medium-gray)",
                        backgroundColor: "var(--light-gray)",
                      }}
                    >
                      <p
                        className="text-xs font-bold uppercase tracking-wider mb-2"
                        style={{ color: "var(--dark-gray)", opacity: 0.5 }}
                      >
                        Students in {cls.formClass}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {cls.students.map((s) => (
                          <div
                            key={s.id}
                            className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border text-xs"
                            style={{ borderColor: "var(--medium-gray)" }}
                          >
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{
                                backgroundColor: "var(--royal-blue)",
                                fontSize: 9,
                              }}
                            >
                              {s.firstName?.[0]}
                              {s.lastName?.[0]}
                            </div>
                            <span
                              className="truncate"
                              style={{ color: "var(--dark-gray)" }}
                            >
                              {s.firstName} {s.lastName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {confirmData && (
        <ConfirmModal
          classes={confirmData.classes}
          semester={semester}
          isAll={confirmData.isAll}
          onConfirm={() => handlePublish(confirmData.classes)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default PublishReports;
