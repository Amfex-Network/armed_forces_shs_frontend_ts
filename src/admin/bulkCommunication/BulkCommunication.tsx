import React, { useEffect, useMemo, useState } from "react";
import {
  MessageSquare,
  Mail,
  Users,
  GraduationCap,
  UserCheck,
  Info,
  Send,
} from "lucide-react";
import { usersApi } from "../../api/users";
import { studentsApi } from "../../api/students";

const BulkCommunication = () => {
  const [counts, setCounts] = useState({ students: 0, parents: 0, teachers: 0 });
  const [msgType, setMsgType] = useState<"sms" | "email">("sms");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    Promise.all([usersApi.list().catch(() => []), studentsApi.list().catch(() => [])])
      .then(([users, students]) => {
        setCounts({
          students: students.length,
          parents: users.filter((u) => u.role === "parent").length,
          teachers: users.filter((u) => u.role === "teacher").length,
        });
      })
      .catch(() => {});
  }, []);

  const groups = [
    { key: "parents", label: "Parents / Guardians", icon: Users, count: counts.parents },
    { key: "students", label: "Students", icon: GraduationCap, count: counts.students },
    { key: "teachers", label: "Teachers / Staff", icon: UserCheck, count: counts.teachers },
  ];

  const toggleGroup = (key: string) =>
    setSelectedGroups((g) =>
      g.includes(key) ? g.filter((x) => x !== key) : [...g, key],
    );

  const recipientCount = useMemo(
    () =>
      selectedGroups.reduce(
        (sum, k) => sum + (groups.find((g) => g.key === k)?.count || 0),
        0,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedGroups, counts],
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black" style={{ color: "var(--dark-gray)" }}>
          Bulk Communication
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Compose an SMS or email announcement to parents, students and staff
        </p>
      </div>

      {/* Not-configured notice */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl border"
        style={{ backgroundColor: "#fffbeb", borderColor: "#fcd34d" }}
      >
        <Info size={16} style={{ color: "var(--warning)" }} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold" style={{ color: "#92400e" }}>
            Delivery is not configured
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#92400e" }}>
            No SMS/email provider has been connected yet, so messages cannot be
            sent. You can prepare the recipient groups and draft below; once a
            provider (e.g. an SMS gateway or SMTP account) is wired to the
            backend, sending will be enabled here.
          </p>
        </div>
      </div>

      {/* Channel */}
      <div className="flex gap-2">
        {[
          { key: "sms", label: "SMS", icon: MessageSquare },
          { key: "email", label: "Email", icon: Mail },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setMsgType(key as "sms" | "email")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 transition"
            style={{
              borderColor: msgType === key ? "var(--royal-blue)" : "var(--medium-gray)",
              backgroundColor: msgType === key ? "#eef2ff" : "white",
              color: msgType === key ? "var(--royal-blue)" : "var(--dark-gray)",
            }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Recipients */}
      <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: "var(--medium-gray)" }}>
        <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: "var(--dark-gray)" }}>
          Recipient Groups
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {groups.map(({ key, label, icon: Icon, count }) => {
            const on = selectedGroups.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleGroup(key)}
                className="flex items-center gap-3 p-4 rounded-xl border-2 text-left transition"
                style={{
                  borderColor: on ? "var(--royal-blue)" : "var(--medium-gray)",
                  backgroundColor: on ? "#eef2ff" : "white",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: on ? "var(--royal-blue)" : "#f3f4f6" }}
                >
                  <Icon size={18} color={on ? "white" : "#6b7280"} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--dark-gray)" }}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-400">{count} recipients</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compose */}
      <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4" style={{ borderColor: "var(--medium-gray)" }}>
        {msgType === "email" && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none"
              style={{ borderColor: "var(--medium-gray)" }}
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            Message {msgType === "sms" && <span className="text-gray-400">({body.length} chars)</span>}
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder="Type your announcement…"
            className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none resize-none"
            style={{ borderColor: "var(--medium-gray)" }}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {recipientCount} recipient{recipientCount === 1 ? "" : "s"} selected
          </p>
          <button
            disabled
            title="Delivery provider not configured"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl opacity-50 cursor-not-allowed"
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            <Send size={14} /> Send (disabled)
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkCommunication;
