// src/teacher/score-review/ScoreReview.jsx
import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ChevronDown,
  Search,
  AlertTriangle,
  MessageSquare,
  Send,
  Filter,
} from "lucide-react";
import { TERM_INFO } from "../data/teacherData";

// ─── Mock submitted score batches from subject teachers ───────────────────────
const INITIAL_SUBMISSIONS = [
  {
    id: 1,
    teacher: "Mr. Kwabena Adjei",
    subject: "Core Mathematics",
    formClass: "Form 3 Science A",
    submittedAt: "2025-03-15 09:22",
    status: "pending", // pending | approved | rejected
    rejectionReason: "",
    totalStudents: 42,
    scoresEntered: 42,
    scores: Array.from({ length: 42 }, (_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      studentId: `AFSHTS/2024/${String(i + 1).padStart(3, "0")}`,
      ca: Math.min(30, 10 + Math.round((i * 7) % 20)),
      exam: Math.min(70, 30 + Math.round((i * 11) % 40)),
    })).map((s) => ({
      ...s,
      total: s.ca + s.exam,
      grade:
        s.ca + s.exam >= 80
          ? "A1"
          : s.ca + s.exam >= 70
            ? "B2"
            : s.ca + s.exam >= 65
              ? "B3"
              : s.ca + s.exam >= 60
                ? "C4"
                : s.ca + s.exam >= 55
                  ? "C5"
                  : s.ca + s.exam >= 50
                    ? "C6"
                    : s.ca + s.exam >= 45
                      ? "D7"
                      : s.ca + s.exam >= 40
                        ? "E8"
                        : "F9",
    })),
  },
  {
    id: 2,
    teacher: "Mrs. Ama Eshun",
    subject: "English Language",
    formClass: "Form 3 Science A",
    submittedAt: "2025-03-15 10:45",
    status: "pending",
    rejectionReason: "",
    totalStudents: 42,
    scoresEntered: 42,
    scores: Array.from({ length: 42 }, (_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      studentId: `AFSHTS/2024/${String(i + 1).padStart(3, "0")}`,
      ca: Math.min(30, 12 + Math.round((i * 5) % 18)),
      exam: Math.min(70, 35 + Math.round((i * 9) % 35)),
    })).map((s) => ({
      ...s,
      total: s.ca + s.exam,
      grade:
        s.ca + s.exam >= 80
          ? "A1"
          : s.ca + s.exam >= 70
            ? "B2"
            : s.ca + s.exam >= 65
              ? "B3"
              : s.ca + s.exam >= 60
                ? "C4"
                : s.ca + s.exam >= 55
                  ? "C5"
                  : s.ca + s.exam >= 50
                    ? "C6"
                    : s.ca + s.exam >= 45
                      ? "D7"
                      : s.ca + s.exam >= 40
                        ? "E8"
                        : "F9",
    })),
  },
  {
    id: 3,
    teacher: "Dr. Kofi Osei",
    subject: "Integrated Science",
    formClass: "Form 3 Science A",
    submittedAt: "2025-03-14 14:10",
    status: "approved",
    rejectionReason: "",
    totalStudents: 42,
    scoresEntered: 42,
    scores: [],
  },
  {
    id: 4,
    teacher: "Mr. Yaw Boateng",
    subject: "Social Studies",
    formClass: "Form 3 Science A",
    submittedAt: "2025-03-14 11:30",
    status: "rejected",
    rejectionReason:
      "Several students have identical CA scores. Please review and resubmit.",
    totalStudents: 42,
    scoresEntered: 38,
    scores: [],
  },
  {
    id: 5,
    teacher: "Mrs. Grace Mensah",
    subject: "Elective Mathematics",
    formClass: "Form 3 Science A",
    submittedAt: "2025-03-16 08:05",
    status: "pending",
    rejectionReason: "",
    totalStudents: 42,
    scoresEntered: 42,
    scores: Array.from({ length: 42 }, (_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      studentId: `AFSHTS/2024/${String(i + 1).padStart(3, "0")}`,
      ca: Math.min(30, 8 + Math.round((i * 13) % 22)),
      exam: Math.min(70, 25 + Math.round((i * 17) % 45)),
    })).map((s) => ({
      ...s,
      total: s.ca + s.exam,
      grade:
        s.ca + s.exam >= 80
          ? "A1"
          : s.ca + s.exam >= 70
            ? "B2"
            : s.ca + s.exam >= 65
              ? "B3"
              : s.ca + s.exam >= 60
                ? "C4"
                : s.ca + s.exam >= 55
                  ? "C5"
                  : s.ca + s.exam >= 50
                    ? "C6"
                    : s.ca + s.exam >= 45
                      ? "D7"
                      : s.ca + s.exam >= 40
                        ? "E8"
                        : "F9",
    })),
  },
];

const STATUS_CFG = {
  pending: {
    color: "var(--warning)",
    bg: "#fffbeb",
    label: "Awaiting Review",
    icon: Clock,
  },
  approved: {
    color: "var(--success-dark)",
    bg: "#f0fdf4",
    label: "Approved",
    icon: CheckCircle2,
  },
  rejected: {
    color: "var(--accent-red)",
    bg: "#fff1f2",
    label: "Returned",
    icon: XCircle,
  },
};

const GRADE_COLOR = {
  A1: "#16a34a",
  B2: "#2563eb",
  B3: "#3b82f6",
  C4: "#ca8a04",
  C5: "#ea580c",
  C6: "#f97316",
  D7: "#dc2626",
  E8: "#b91c1c",
  F9: "#7f1d1d",
};

// ─── Reject Modal ─────────────────────────────────────────────────────────────
const RejectModal = ({ submission, onConfirm, onCancel }) => {
  const [reason, setReason] = useState("");
  const presets = [
    "Missing scores for some students",
    "Several students have identical CA scores — please review",
    "CA scores exceed the maximum of 30",
    "Exam scores exceed the maximum of 70",
    "Suspected transcription error — please verify against scripts",
    "Other",
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div
          className="px-6 py-4"
          style={{
            background:
              "linear-gradient(135deg,var(--accent-red-dark),var(--accent-red))",
          }}
        >
          <p className="text-white font-black">Return for Correction</p>
          <p className="text-red-200 text-xs mt-0.5">
            {submission.teacher} · {submission.subject}
          </p>
        </div>
        <div className="h-1" style={{ backgroundColor: "var(--royal-blue)" }} />
        <div className="p-5 space-y-4">
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--dark-gray)" }}
            >
              Reason for Returning{" "}
              <span style={{ color: "var(--accent-red)" }}>*</span>
            </label>
            <div className="space-y-1.5 mb-3">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setReason(p)}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg border transition"
                  style={{
                    borderColor:
                      reason === p ? "var(--accent-red)" : "var(--medium-gray)",
                    backgroundColor: reason === p ? "#fff1f2" : "white",
                    color:
                      reason === p ? "var(--accent-red)" : "var(--dark-gray)",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              placeholder="Add more details (optional)…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-sm border-2 rounded-xl outline-none resize-none"
              style={{ borderColor: "var(--medium-gray)" }}
            />
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
              The subject teacher will be notified and can resubmit after making
              corrections.
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
              onClick={() => {
                if (reason.trim()) onConfirm(reason);
              }}
              disabled={!reason.trim()}
              className="flex-1 py-2.5 text-sm font-black text-white rounded-xl"
              style={{
                backgroundColor: reason.trim()
                  ? "var(--accent-red)"
                  : "#9ca3af",
              }}
            >
              Return to Teacher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const ScoreReview = () => {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [filterStatus, setFS] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = useMemo(
    () =>
      submissions.filter((s) => {
        const matchSearch =
          !search ||
          s.teacher.toLowerCase().includes(search.toLowerCase()) ||
          s.subject.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "all" || s.status === filterStatus;
        return matchSearch && matchStatus;
      }),
    [submissions, search, filterStatus],
  );

  const handleApprove = (id) => {
    setSubmissions((ss) =>
      ss.map((s) => (s.id === id ? { ...s, status: "approved" } : s)),
    );
    const sub = submissions.find((s) => s.id === id);
    showToast(`${sub.subject} scores approved`);
    setExpanded(null);
  };

  const handleReject = (id, reason) => {
    setSubmissions((ss) =>
      ss.map((s) =>
        s.id === id ? { ...s, status: "rejected", rejectionReason: reason } : s,
      ),
    );
    const sub = submissions.find((s) => s.id === id);
    showToast(`${sub.subject} returned to ${sub.teacher}`, "warning");
    setRejectModal(null);
    setExpanded(null);
  };

  const counts = {
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

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
      <div>
        <h1
          className="text-xl font-black"
          style={{ color: "var(--dark-gray)" }}
        >
          Score Review
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Review and approve scores submitted by subject teachers
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Awaiting Review",
            value: counts.pending,
            color: "var(--warning)",
            bg: "#fffbeb",
            icon: Clock,
          },
          {
            label: "Approved",
            value: counts.approved,
            color: "var(--success-dark)",
            bg: "#f0fdf4",
            icon: CheckCircle2,
          },
          {
            label: "Returned",
            value: counts.rejected,
            color: "var(--accent-red)",
            bg: "#fff1f2",
            icon: XCircle,
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
            placeholder="Search teacher or subject..."
            className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border-2 outline-none"
            style={{ borderColor: "var(--medium-gray)" }}
          />
        </div>
        {["all", "pending", "approved", "rejected"].map((f) => (
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
            {f === "all" ? "All" : STATUS_CFG[f]?.label || f}
          </button>
        ))}
      </div>

      {/* Submission list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div
            className="bg-white rounded-2xl border p-10 text-center"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <p className="text-sm font-bold text-gray-400">
              No submissions match your filter
            </p>
          </div>
        ) : (
          filtered.map((sub) => {
            const sc = STATUS_CFG[sub.status];
            const Icon = sc.icon;
            const isOpen = expanded === sub.id;

            // grade distribution for preview
            const gradeCounts = sub.scores.reduce((acc, s) => {
              acc[s.grade] = (acc[s.grade] || 0) + 1;
              return acc;
            }, {});

            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{
                  borderColor:
                    sub.status === "pending"
                      ? "var(--warning)"
                      : "var(--medium-gray)",
                  borderWidth: sub.status === "pending" ? 2 : 1,
                }}
              >
                {/* Card header */}
                <div
                  className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setExpanded(isOpen ? null : sub.id)}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                    style={{ backgroundColor: "var(--royal-blue)" }}
                  >
                    {sub.teacher.split(" ").pop()?.[0]}
                    {sub.teacher.split(" ").pop()?.[1]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className="font-black text-sm"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {sub.subject}
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                        style={{ backgroundColor: sc.bg, color: sc.color }}
                      >
                        <Icon size={10} /> {sc.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {sub.teacher} · {sub.formClass} · {sub.scoresEntered}/
                      {sub.totalStudents} scores · Submitted {sub.submittedAt}
                    </p>
                    {sub.status === "rejected" && sub.rejectionReason && (
                      <p
                        className="text-xs mt-1 font-semibold"
                        style={{ color: "var(--accent-red)" }}
                      >
                        Returned: {sub.rejectionReason}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    {sub.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(sub.id);
                          }}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg text-white"
                          style={{ backgroundColor: "var(--success-dark)" }}
                        >
                          <CheckCircle2 size={12} /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRejectModal(sub);
                          }}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg text-white"
                          style={{ backgroundColor: "var(--accent-red)" }}
                        >
                          <XCircle size={12} /> Return
                        </button>
                      </>
                    )}
                    <ChevronDown
                      size={16}
                      className="text-gray-400 transition-transform"
                      style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                    />
                  </div>
                </div>

                {/* Expanded score table */}
                {isOpen && sub.scores.length > 0 && (
                  <div
                    className="border-t px-5 pb-5 pt-4"
                    style={{
                      borderColor: "var(--medium-gray)",
                      backgroundColor: "var(--light-gray)",
                    }}
                  >
                    {/* Grade distribution */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <p
                        className="text-xs font-bold uppercase tracking-wider w-full"
                        style={{ color: "var(--dark-gray)", opacity: 0.5 }}
                      >
                        Grade Distribution
                      </p>
                      {Object.entries(gradeCounts)
                        .sort()
                        .map(([grade, count]) => (
                          <span
                            key={grade}
                            className="text-xs font-black px-2.5 py-1 rounded-lg"
                            style={{
                              backgroundColor: GRADE_COLOR[grade] + "20",
                              color: GRADE_COLOR[grade],
                            }}
                          >
                            {grade}: {count}
                          </span>
                        ))}
                    </div>

                    {/* Score table */}
                    <div
                      className="bg-white rounded-xl border overflow-x-auto max-h-72 overflow-y-auto"
                      style={{ borderColor: "var(--medium-gray)" }}
                    >
                      <table className="w-full text-sm min-w-[500px]">
                        <thead
                          className="sticky top-0 border-b"
                          style={{
                            backgroundColor: "var(--light-gray)",
                            borderColor: "var(--medium-gray)",
                          }}
                        >
                          <tr>
                            {[
                              "Student",
                              "ID",
                              "CA (30)",
                              "Exam (70)",
                              "Total",
                              "Grade",
                            ].map((h) => (
                              <th
                                key={h}
                                className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-gray-500"
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
                          {sub.scores.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50">
                              <td
                                className="px-3 py-2 font-semibold text-sm"
                                style={{ color: "var(--dark-gray)" }}
                              >
                                {s.name}
                              </td>
                              <td className="px-3 py-2 font-mono text-xs text-gray-500">
                                {s.studentId}
                              </td>
                              <td
                                className="px-3 py-2 font-bold"
                                style={{ color: "var(--dark-gray)" }}
                              >
                                {s.ca}
                              </td>
                              <td
                                className="px-3 py-2 font-bold"
                                style={{ color: "var(--dark-gray)" }}
                              >
                                {s.exam}
                              </td>
                              <td
                                className="px-3 py-2 font-black"
                                style={{ color: "var(--royal-blue)" }}
                              >
                                {s.total}
                              </td>
                              <td className="px-3 py-2">
                                <span
                                  className="text-xs font-black px-2 py-0.5 rounded"
                                  style={{
                                    backgroundColor:
                                      GRADE_COLOR[s.grade] + "20",
                                    color: GRADE_COLOR[s.grade],
                                  }}
                                >
                                  {s.grade}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Bottom approve/reject */}
                    {sub.status === "pending" && (
                      <div className="flex gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setRejectModal(sub)}
                          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl border-2"
                          style={{
                            borderColor: "var(--accent-red)",
                            color: "var(--accent-red)",
                          }}
                        >
                          <XCircle size={14} /> Return for Correction
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(sub.id)}
                          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl"
                          style={{ backgroundColor: "var(--success-dark)" }}
                        >
                          <CheckCircle2 size={14} /> Approve Scores
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {rejectModal && (
        <RejectModal
          submission={rejectModal}
          onConfirm={(reason) => handleReject(rejectModal.id, reason)}
          onCancel={() => setRejectModal(null)}
        />
      )}
    </div>
  );
};

export default ScoreReview;
