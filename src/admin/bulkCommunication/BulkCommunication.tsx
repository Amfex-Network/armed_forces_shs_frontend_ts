// src/admin/bulkCommunication/BulkCommunication.jsx
import React, { useState, useMemo } from "react";
import {
  Send,
  MessageSquare,
  Mail,
  Users,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  ChevronDown,
  X,
  Plus,
  Eye,
  Trash2,
  Phone,
  GraduationCap,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import {
  FaUsers,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUserFriends,
} from "react-icons/fa";
import { STUDENTS, PARENTS } from "../data/adminData";

// ─── Mock teacher list ────────────────────────────────────────────────────────
const TEACHERS = [
  {
    id: 1,
    name: "Capt Kwabena Adjei",
    phone: "0244123456",
    email: "k.adjei@afts.edu.gh",
    department: "Mathematics",
    yearGroup: "form1",
  },
  {
    id: 2,
    name: "Mrs Ama Eshun",
    phone: "0277654321",
    email: "a.eshun@afts.edu.gh",
    department: "English",
    yearGroup: "form1",
  },
  {
    id: 3,
    name: "Dr Kofi Osei",
    phone: "0200112233",
    email: "k.osei@afts.edu.gh",
    department: "Science",
    yearGroup: "form3",
  },
  {
    id: 4,
    name: "Sgt Efua Frimpong",
    phone: "0244987654",
    email: "e.frimpong@afts.edu.gh",
    department: "Technical",
    yearGroup: "form1",
  },
  {
    id: 5,
    name: "Mr Nana Boateng",
    phone: "0207654321",
    email: "n.boateng@afts.edu.gh",
    department: "Social Studies",
    yearGroup: "form1",
  },
  {
    id: 6,
    name: "Mrs Abena Mensah",
    phone: "0244555666",
    email: "a.mensah@afts.edu.gh",
    department: "Science",
    yearGroup: "form3",
  },
  {
    id: 7,
    name: "Lt Kwame Asare",
    phone: "0277112233",
    email: "k.asare@afts.edu.gh",
    department: "Science",
    yearGroup: "form1",
  },
  {
    id: 8,
    name: "Mr Yaw Tawiah",
    phone: "0244321654",
    email: "y.tawiah@afts.edu.gh",
    department: "Science",
    yearGroup: "form3",
  },
  {
    id: 9,
    name: "Mrs Akua Bonsu",
    phone: "0207111222",
    email: "a.bonsu@afts.edu.gh",
    department: "Business",
    yearGroup: "form1",
  },
  {
    id: 10,
    name: "Dr Yaa Agyemang",
    phone: "0244567890",
    email: "y.agyemang@afts.edu.gh",
    department: "Mathematics",
    yearGroup: "form1",
  },
];

// ─── Message history ──────────────────────────────────────────────────────────
const INITIAL_HISTORY = [
  {
    id: 1,
    date: "2025-03-10",
    type: "sms",
    subject: "Semester 1 Exam Notice",
    recipients: "All Parents (45)",
    status: "sent",
    count: 45,
    body: "Dear Parent/Guardian, Semester 1 End of Term Examinations begin March 24, 2025. Ensure your ward is adequately prepared. — AFSHTS Admin",
  },
  {
    id: 2,
    date: "2025-03-08",
    type: "email",
    subject: "Fee Reminder — Semester 2",
    recipients: "All Parents (45)",
    status: "sent",
    count: 45,
    body: "Dear Parent/Guardian, Semester 2 fees are due by April 14, 2025. Please clear all outstanding balances. Contact the bursar for payment plans.",
  },
  {
    id: 3,
    date: "2025-02-28",
    type: "sms",
    subject: "Semester 1 Reports Available",
    recipients: "All Parents (45)",
    status: "sent",
    count: 45,
    body: "Dear Parent/Guardian, Semester 1 report cards are now available on the parent portal. Log in to view your ward's performance.",
  },
  {
    id: 4,
    date: "2025-02-21",
    type: "sms",
    subject: "Inter-House Sports Day",
    recipients: "All Students (48)",
    status: "sent",
    count: 48,
    body: "Attention students: Inter-House Sports Day is on Friday February 21. Report to the school field by 7:30 AM in your house colours.",
  },
  {
    id: 5,
    date: "2025-01-20",
    type: "email",
    subject: "Staff Meeting Notice",
    recipients: "All Teachers (15)",
    status: "sent",
    count: 15,
    body: "Dear Staff, The HOD meeting and term review is scheduled for Monday March 17 at 10:00 AM in the Conference Room. Attendance is mandatory.",
  },
  {
    id: 6,
    date: "2025-01-15",
    type: "sms",
    subject: "Semester 2 Resumption",
    recipients: "Semester 2 Parents",
    status: "sent",
    count: 22,
    body: "Dear Parent/Guardian, Semester 2 resumes on April 14, 2025. Students should report to school by 7:00 AM. Contact us for queries.",
  },
];

const TEMPLATES = [
  {
    id: 1,
    name: "Exam Notice",
    body: "Dear Parent/Guardian, {term} End of Term Examinations begin {date}. Ensure your ward is adequately prepared. — AFSHTS Admin",
  },
  {
    id: 2,
    name: "Fee Reminder",
    body: "Dear Parent/Guardian, {term} fees are due by {date}. Please clear all outstanding balances. Contact the bursar office for assistance.",
  },
  {
    id: 3,
    name: "Report Card Ready",
    body: "Dear Parent/Guardian, {term} report cards are now available on the parent portal. Log in with your credentials to view your ward's performance.",
  },
  {
    id: 4,
    name: "Resumption Notice",
    body: "Dear Parent/Guardian, Track {track} resumes on {date}. Students should report to school by 7:00 AM in full school uniform.",
  },
  {
    id: 5,
    name: "General Announcement",
    body: "Dear Parent/Guardian, this is an important announcement from Armed Forces SHTS. {message} For enquiries, contact the school office.",
  },
  {
    id: 6,
    name: "Staff Meeting",
    body: "Dear Staff, you are reminded of the {meeting} scheduled for {date} at {time} in {venue}. Please ensure attendance.",
  },
];

const RECIPIENT_GROUPS = [
  {
    value: "all_parents",
    label: "All Parents",
    Icon: FaUsers,
    count: PARENTS.length,
  },
  {
    value: "all_students",
    label: "All Students",
    Icon: FaGraduationCap,
    count: STUDENTS.length,
  },
  {
    value: "all_teachers",
    label: "All Teachers",
    Icon: FaChalkboardTeacher,
    count: TEACHERS.length,
  },
  {
    value: "track_a_parents",
    label: "Semester 1 Parents",
    Icon: FaUserFriends,
    count: Math.round(PARENTS.length / 2),
  },
  {
    value: "track_b_parents",
    label: "Semester 2 Parents",
    Icon: FaUserFriends,
    count: Math.round(PARENTS.length / 2),
  },
  {
    value: "form1_parents",
    label: "Form 1 Parents",
    icon: "1️⃣",
    count: STUDENTS.filter((s) => s.year === "Form 1").length,
  },
  {
    value: "form2_parents",
    label: "Form 2 Parents",
    icon: "2️⃣",
    count: STUDENTS.filter((s) => s.year === "Form 2").length,
  },
  {
    value: "form3_parents",
    label: "Form 3 Parents",
    icon: "3️⃣",
    count: STUDENTS.filter((s) => s.year === "Form 3").length,
  },
  {
    value: "science_parents",
    label: "Science Parents",
    icon: "🔬",
    count: STUDENTS.filter((s) => s.program === "General Science").length,
  },
  {
    value: "arts_parents",
    label: "Arts Parents",
    icon: "🎨",
    count: STUDENTS.filter((s) => s.program === "General Arts").length,
  },
];

const STATUS_STYLE = {
  sent: {
    bg: "#f0fdf4",
    color: "var(--success-dark)",
    icon: CheckCircle2,
    label: "Sent",
  },
  failed: {
    bg: "#fff1f2",
    color: "var(--accent-red)",
    icon: AlertCircle,
    label: "Failed",
  },
  pending: {
    bg: "#fffbeb",
    color: "var(--warning)",
    icon: Clock,
    label: "Pending",
  },
};

// ─── BulkCommunication ────────────────────────────────────────────────────────
const BulkCommunication = () => {
  const [activeTab, setActiveTab] = useState("compose");
  const [msgType, setMsgType] = useState("sms"); // 'sms' | 'email'
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selectedGroups, setGroups] = useState([]);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [searchHistory, setSearchHist] = useState("");
  const [previewOpen, setPreview] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const totalRecipients = selectedGroups.reduce((sum, gv) => {
    const g = RECIPIENT_GROUPS.find((rg) => rg.value === gv);
    return sum + (g?.count || 0);
  }, 0);

  const toggleGroup = (val) =>
    setGroups((gs) =>
      gs.includes(val) ? gs.filter((g) => g !== val) : [...gs, val],
    );

  const applyTemplate = (tpl) => {
    setBody(tpl.body);
    setSubject(tpl.name);
    setShowTemplates(false);
    showToast(`Template "${tpl.name}" applied`);
  };

  const validate = () => {
    const e = {};
    if (selectedGroups.length === 0)
      e.groups = "Select at least one recipient group";
    if (msgType === "email" && !subject.trim())
      e.subject = "Subject is required for email";
    if (!body.trim()) e.body = "Message body is required";
    if (body.length > (msgType === "sms" ? 320 : 5000))
      e.body = `Message too long for ${msgType}`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSending(false);
    setSent(true);

    const groupLabels = selectedGroups
      .map((gv) => RECIPIENT_GROUPS.find((rg) => rg.value === gv)?.label)
      .join(", ");
    const newMsg = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      type: msgType,
      subject: subject || "No Subject",
      recipients: `${groupLabels} (${totalRecipients})`,
      status: "sent",
      count: totalRecipients,
      body,
    };
    setHistory((h) => [newMsg, ...h]);
    showToast(
      `${msgType.toUpperCase()} sent to ${totalRecipients} recipient${totalRecipients !== 1 ? "s" : ""}`,
    );

    setTimeout(() => {
      setSent(false);
      setSubject("");
      setBody("");
      setGroups([]);
      setErrors({});
    }, 3000);
  };

  const handleReset = () => {
    setSubject("");
    setBody("");
    setGroups([]);
    setSent(false);
    setErrors({});
  };

  const handleDeleteHistory = (id) => {
    setHistory((h) => h.filter((m) => m.id !== id));
    showToast("Message removed from history", "error");
  };

  const filteredHistory = useMemo(
    () =>
      history.filter(
        (m) =>
          !searchHistory ||
          m.subject.toLowerCase().includes(searchHistory.toLowerCase()) ||
          m.recipients.toLowerCase().includes(searchHistory.toLowerCase()),
      ),
    [history, searchHistory],
  );

  const smsCount = history.filter((h) => h.type === "sms").length;
  const emailCount = history.filter((h) => h.type === "email").length;
  const totalSent = history.reduce((s, h) => s + h.count, 0);
  const smsLeft = msgType === "sms" ? 160 - body.length : null;

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2"
          style={{
            backgroundColor:
              toast.type === "error"
                ? "var(--accent-red)"
                : "var(--success-dark)",
            animation: "fadeIn .2s ease",
          }}
        >
          {toast.type === "error" ? (
            <AlertCircle size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}{" "}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            Bulk Communication
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Send SMS or Email to parents, students and teachers
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Sent",
            value: totalSent,
            color: "var(--royal-blue)",
            icon: Send,
          },
          {
            label: "SMS Messages",
            value: smsCount,
            color: "var(--success-dark)",
            icon: MessageSquare,
          },
          {
            label: "Email Messages",
            value: emailCount,
            color: "#7c3aed",
            icon: Mail,
          },
          {
            label: "Total Recipients",
            value: PARENTS.length + STUDENTS.length + TEACHERS.length,
            color: "var(--warning)",
            icon: Users,
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

      {/* Tabs */}
      <div
        className="flex border-b"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        {[
          { id: "compose", label: "Compose Message", icon: Send },
          { id: "history", label: "Sent History", icon: Clock },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className="px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2"
            style={{
              borderColor:
                activeTab === t.id ? "var(--royal-blue)" : "transparent",
              color:
                activeTab === t.id ? "var(--royal-blue)" : "var(--dark-gray)",
            }}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── COMPOSE TAB ───────────────────────────────────────────────────── */}
      {activeTab === "compose" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Compose form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Message type toggle */}
            <div
              className="bg-white rounded-xl border shadow-sm p-4"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <p
                className="text-xs font-black uppercase tracking-widest mb-3"
                style={{ color: "var(--dark-gray)", opacity: 0.5 }}
              >
                Message Type
              </p>
              <div className="flex gap-3">
                {[
                  {
                    type: "sms",
                    label: "SMS",
                    icon: MessageSquare,
                    desc: "160 chars · sent to phone numbers",
                  },
                  {
                    type: "email",
                    label: "Email",
                    icon: Mail,
                    desc: "Longer · sent to email addresses",
                  },
                ].map((m) => (
                  <button
                    key={m.type}
                    type="button"
                    onClick={() => {
                      setMsgType(m.type);
                      setErrors({});
                    }}
                    className="flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left"
                    style={{
                      borderColor:
                        msgType === m.type
                          ? "var(--royal-blue)"
                          : "var(--medium-gray)",
                      backgroundColor: msgType === m.type ? "#eef2ff" : "white",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor:
                          msgType === m.type
                            ? "var(--royal-blue)"
                            : "var(--light-gray)",
                      }}
                    >
                      <m.icon
                        size={18}
                        style={{
                          color:
                            msgType === m.type ? "white" : "var(--dark-gray)",
                        }}
                      />
                    </div>
                    <div>
                      <p
                        className="font-bold text-sm"
                        style={{
                          color:
                            msgType === m.type
                              ? "var(--royal-blue)"
                              : "var(--dark-gray)",
                        }}
                      >
                        {m.label}
                      </p>
                      <p className="text-xs text-gray-400">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject (email only) */}
            {msgType === "email" && (
              <div>
                <label
                  className="text-xs font-bold uppercase tracking-wider block mb-1.5"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Subject <span style={{ color: "var(--accent-red)" }}>*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setErrors((e) => ({ ...e, subject: "" }));
                  }}
                  placeholder="e.g. Semester 1 Exam Schedule — AFSHTS"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border-2 outline-none"
                  style={{
                    borderColor: errors.subject
                      ? "var(--accent-red)"
                      : "var(--medium-gray)",
                    color: "var(--dark-gray)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--royal-blue)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.subject
                      ? "var(--accent-red)"
                      : "var(--medium-gray)")
                  }
                />
                {errors.subject && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--accent-red)" }}
                  >
                    {errors.subject}
                  </p>
                )}
              </div>
            )}

            {/* Message body */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Message <span style={{ color: "var(--accent-red)" }}>*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowTemplates((t) => !t)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition"
                  style={{
                    backgroundColor: "#eef2ff",
                    color: "var(--royal-blue)",
                  }}
                >
                  <BookOpen size={11} /> Templates
                </button>
              </div>

              {/* Templates dropdown */}
              {showTemplates && (
                <div
                  className="mb-3 bg-white rounded-xl border shadow-md overflow-hidden"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  <div
                    className="px-3 py-2 border-b flex items-center justify-between"
                    style={{
                      borderColor: "var(--medium-gray)",
                      backgroundColor: "var(--light-gray)",
                    }}
                  >
                    <p
                      className="text-xs font-black uppercase"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      Message Templates
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowTemplates(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => applyTemplate(tpl)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b"
                      style={{ borderColor: "var(--medium-gray)" }}
                    >
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {tpl.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {tpl.body.slice(0, 80)}…
                      </p>
                    </button>
                  ))}
                </div>
              )}

              <textarea
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  setErrors((er) => ({ ...er, body: "" }));
                }}
                rows={msgType === "sms" ? 4 : 7}
                placeholder={
                  msgType === "sms"
                    ? "Dear Parent/Guardian, …"
                    : "Type your email message here…\n\nYou can include multiple paragraphs, links, and detailed information."
                }
                className="w-full px-4 py-3 text-sm rounded-xl border-2 outline-none resize-none"
                style={{
                  borderColor: errors.body
                    ? "var(--accent-red)"
                    : "var(--medium-gray)",
                  color: "var(--dark-gray)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--royal-blue)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.body
                    ? "var(--accent-red)"
                    : "var(--medium-gray)")
                }
              />
              <div className="flex items-center justify-between mt-1">
                <div>
                  {errors.body && (
                    <p
                      className="text-xs"
                      style={{ color: "var(--accent-red)" }}
                    >
                      {errors.body}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {body.length} chars
                  {msgType === "sms" && (
                    <span
                      style={{
                        color:
                          body.length > 160
                            ? "var(--accent-red)"
                            : body.length > 140
                              ? "var(--warning)"
                              : "inherit",
                      }}
                    >
                      {" "}
                      ·{" "}
                      {body.length > 160
                        ? `${Math.ceil(body.length / 160)} SMS parts`
                        : `${160 - body.length} left`}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition"
                style={{
                  borderColor: "var(--medium-gray)",
                  color: "var(--dark-gray)",
                  backgroundColor: "white",
                }}
              >
                <RotateCcw size={13} /> Reset
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={sending || sent}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white rounded-xl transition disabled:opacity-60"
                style={{
                  backgroundColor: sent
                    ? "var(--success-dark)"
                    : "var(--royal-blue)",
                }}
                onMouseEnter={(e) => {
                  if (!sending && !sent)
                    e.currentTarget.style.backgroundColor =
                      "var(--royal-blue-dark)";
                }}
                onMouseLeave={(e) => {
                  if (!sending && !sent)
                    e.currentTarget.style.backgroundColor = "var(--royal-blue)";
                }}
              >
                {sending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Sending…
                  </>
                ) : sent ? (
                  <>
                    <CheckCircle2 size={15} /> Sent Successfully!
                  </>
                ) : (
                  <>
                    <Send size={15} /> Send to{" "}
                    {totalRecipients > 0
                      ? `${totalRecipients} Recipients`
                      : "Selected Recipients"}
                  </>
                )}
              </button>
            </div>

            {errors.groups && (
              <p
                className="text-xs flex items-center gap-1"
                style={{ color: "var(--accent-red)" }}
              >
                <AlertCircle size={12} /> {errors.groups}
              </p>
            )}
          </div>

          {/* Right — Recipient selector */}
          <div className="space-y-4">
            <div
              className="bg-white rounded-xl border shadow-sm overflow-hidden"
              style={{
                borderColor: errors.groups
                  ? "var(--accent-red)"
                  : "var(--medium-gray)",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{
                  borderColor: "var(--medium-gray)",
                  backgroundColor: "var(--light-gray)",
                }}
              >
                <h3
                  className="font-semibold text-sm"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Recipients
                </h3>
                {selectedGroups.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setGroups([])}
                    className="text-xs font-semibold"
                    style={{ color: "var(--accent-red)" }}
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="p-2 space-y-1">
                {RECIPIENT_GROUPS.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => toggleGroup(g.value)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-left"
                    style={{
                      backgroundColor: selectedGroups.includes(g.value)
                        ? "#eef2ff"
                        : "white",
                      border: `1px solid ${selectedGroups.includes(g.value) ? "var(--royal-blue)" : "transparent"}`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{g.icon}</span>
                      <span
                        className="text-xs font-semibold"
                        style={{
                          color: selectedGroups.includes(g.value)
                            ? "var(--royal-blue)"
                            : "var(--dark-gray)",
                        }}
                      >
                        {g.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: selectedGroups.includes(g.value)
                            ? "var(--royal-blue)"
                            : "var(--medium-gray)",
                          color: selectedGroups.includes(g.value)
                            ? "white"
                            : "#6b7280",
                        }}
                      >
                        {g.count}
                      </span>
                      {selectedGroups.includes(g.value) && (
                        <CheckCircle2
                          size={14}
                          style={{ color: "var(--royal-blue)" }}
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {selectedGroups.length > 0 && (
              <div
                className="bg-white rounded-xl border shadow-sm p-4"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <p
                  className="text-xs font-black uppercase tracking-widest mb-3"
                  style={{ color: "var(--dark-gray)", opacity: 0.5 }}
                >
                  Send Summary
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Groups selected</span>
                    <span
                      className="font-bold"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {selectedGroups.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total recipients</span>
                    <span
                      className="font-black"
                      style={{ color: "var(--royal-blue)" }}
                    >
                      {totalRecipients}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Message type</span>
                    <span
                      className="font-bold uppercase text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor:
                          msgType === "sms" ? "#f0fdf4" : "#f5f3ff",
                        color:
                          msgType === "sms" ? "var(--success-dark)" : "#7c3aed",
                      }}
                    >
                      {msgType}
                    </span>
                  </div>
                  {msgType === "sms" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">SMS parts</span>
                      <span
                        className="font-bold"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {Math.ceil(body.length / 160) || 1}
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className="mt-3 p-2.5 rounded-xl"
                  style={{ backgroundColor: "#eef2ff" }}
                >
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--royal-blue)" }}
                  >
                    📤 Ready to send {msgType.toUpperCase()} to{" "}
                    {totalRecipients} recipient
                    {totalRecipients !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── HISTORY TAB ───────────────────────────────────────────────────── */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={searchHistory}
                onChange={(e) => setSearchHist(e.target.value)}
                placeholder="Search by subject or recipients…"
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
            <p className="text-xs text-gray-400 self-center">
              {filteredHistory.length} message
              {filteredHistory.length !== 1 ? "s" : ""} in history
            </p>
          </div>

          {filteredHistory.length === 0 ? (
            <div
              className="text-center py-12 bg-white rounded-xl border"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <Send size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-400">No messages sent yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((msg) => {
                const ss = STATUS_STYLE[msg.status];
                const StatusIcon = ss.icon;
                return (
                  <div
                    key={msg.id}
                    className="bg-white rounded-xl border shadow-sm overflow-hidden"
                    style={{ borderColor: "var(--medium-gray)" }}
                  >
                    <div className="flex items-start justify-between p-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Type icon */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor:
                              msg.type === "sms" ? "#f0fdf4" : "#f5f3ff",
                          }}
                        >
                          {msg.type === "sms" ? (
                            <MessageSquare
                              size={16}
                              style={{ color: "var(--success-dark)" }}
                            />
                          ) : (
                            <Mail size={16} style={{ color: "#7c3aed" }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p
                              className="font-bold text-sm"
                              style={{ color: "var(--dark-gray)" }}
                            >
                              {msg.subject}
                            </p>
                            <span
                              className="text-xs px-1.5 py-0.5 rounded-full font-semibold uppercase"
                              style={{
                                backgroundColor: ss.bg,
                                color: ss.color,
                              }}
                            >
                              {ss.label}
                            </span>
                            <span
                              className="text-xs px-1.5 py-0.5 rounded font-semibold uppercase"
                              style={{
                                backgroundColor:
                                  msg.type === "sms" ? "#f0fdf4" : "#f5f3ff",
                                color:
                                  msg.type === "sms"
                                    ? "var(--success-dark)"
                                    : "#7c3aed",
                              }}
                            >
                              {msg.type}
                            </span>
                          </div>
                          <div className="flex items-center flex-wrap gap-3 mt-1">
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Users size={10} /> {msg.recipients}
                            </p>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={10} />{" "}
                              {new Date(msg.date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          {/* Preview */}
                          <p className="text-xs text-gray-400 mt-1.5 truncate">
                            {msg.body}
                          </p>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                        <button
                          type="button"
                          onClick={() => setPreview(msg)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 transition"
                          style={{ color: "var(--royal-blue)" }}
                          title="View full message"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("compose");
                            setBody(msg.body);
                            setSubject(msg.subject);
                            setMsgType(msg.type);
                          }}
                          className="p-1.5 rounded-lg hover:bg-yellow-50 transition text-xs"
                          style={{ color: "var(--warning)" }}
                          title="Resend"
                        >
                          Resend
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteHistory(msg.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition"
                          style={{ color: "var(--accent-red)" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Preview modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{
                borderColor: "var(--medium-gray)",
                backgroundColor: "var(--light-gray)",
              }}
            >
              <h3 className="font-black" style={{ color: "var(--dark-gray)" }}>
                Message Preview
              </h3>
              <button
                type="button"
                onClick={() => setPreview(null)}
                style={{ color: "var(--dark-gray)" }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: "Type", value: previewOpen.type.toUpperCase() },
                  {
                    label: "Date",
                    value: new Date(previewOpen.date).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "long", year: "numeric" },
                    ),
                  },
                  { label: "Recipients", value: previewOpen.recipients },
                  { label: "Status", value: previewOpen.status.toUpperCase() },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "var(--light-gray)" }}
                  >
                    <p className="text-gray-400">{label}</p>
                    <p
                      className="font-bold mt-0.5"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              {previewOpen.subject && (
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-1"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    Subject
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {previewOpen.subject}
                  </p>
                </div>
              )}
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--dark-gray)" }}
                >
                  Message Body
                </p>
                <div
                  className="p-4 rounded-xl text-sm leading-relaxed"
                  style={{
                    backgroundColor: "var(--light-gray)",
                    color: "var(--dark-gray)",
                  }}
                >
                  {previewOpen.body}
                </div>
              </div>
            </div>
            <div
              className="flex justify-end gap-2 px-5 py-3 border-t"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="px-4 py-2 text-sm font-semibold rounded-xl border"
                style={{
                  borderColor: "var(--medium-gray)",
                  color: "var(--dark-gray)",
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("compose");
                  setBody(previewOpen.body);
                  setSubject(previewOpen.subject);
                  setMsgType(previewOpen.type);
                  setPreview(null);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl"
                style={{ backgroundColor: "var(--royal-blue)" }}
              >
                <Send size={13} /> Resend
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default BulkCommunication;
