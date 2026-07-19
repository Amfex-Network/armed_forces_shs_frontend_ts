// src/parent/profile/ParentProfile.jsx
import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  BookOpen,
  Edit3,
  Save,
  X,
  Users,
} from "lucide-react";
import { CHILDREN_DATA } from "../data/parentData";
import { useAuth } from "../../context/AuthContext";
import { useActiveChild } from "../ParentDashboardLayout";
import { getPerformanceBand } from "../data/parentData";

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
        {value || "—"}
      </p>
    </div>
  </div>
);

const ParentProfile = () => {
  const { user } = useAuth();
  const { childIds } = useActiveChild();

  const [editMode, setEditMode] = useState(false);
  const [contact, setContact] = useState({
    phone: user?.phone || "",
    address: user?.address || "",
    occupation: user?.occupation || "",
  });
  const [draft, setDraft] = useState({ ...contact });

  const handleSave = () => {
    setContact(draft);
    setEditMode(false);
  };
  const handleCancel = () => {
    setDraft({ ...contact });
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            My Profile
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Parent / Guardian Account
          </p>
        </div>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition"
            style={{ backgroundColor: "#eef2ff", color: "var(--royal-blue)" }}
          >
            <Edit3 size={13} /> Edit Contact
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl text-white"
              style={{ backgroundColor: "var(--success-dark)" }}
            >
              <Save size={13} /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl"
              style={{
                backgroundColor: "var(--medium-gray)",
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
        <div
          className="h-24 relative"
          style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
        >
          <div className="absolute -bottom-8 left-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl uppercase shadow-lg border-4 border-white"
              style={{ backgroundColor: "#7c3aed" }}
            >
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
          </div>
        </div>
        <div className="pt-12 px-6 pb-6">
          <h2
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            {user?.title} {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-sm text-gray-400">Parent / Guardian</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}
            >
              {childIds.length} child{childIds.length > 1 ? "ren" : ""} enrolled
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parent info */}
        <div
          className="bg-white rounded-xl border shadow-sm p-5"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <h3
            className="font-black text-sm mb-2"
            style={{ color: "var(--dark-gray)" }}
          >
            Personal Information
          </h3>

          <InfoRow
            icon={User}
            label="Full Name"
            value={`${user?.title} ${user?.firstName} ${user?.lastName}`}
            color="var(--royal-blue)"
          />
          <InfoRow
            icon={Mail}
            label="Email"
            value={user?.email}
            color="var(--accent-red)"
          />

          {/* Editable fields */}
          {["phone", "address", "occupation"].map((field) =>
            editMode ? (
              <div
                key={field}
                className="py-3 border-b"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <label className="text-xs text-gray-400 uppercase tracking-wider capitalize">
                  {field}
                </label>
                <input
                  value={draft[field]}
                  onChange={(e) =>
                    setDraft({ ...draft, [field]: e.target.value })
                  }
                  placeholder={
                    field === "phone"
                      ? "e.g. 0244123456"
                      : field === "address"
                        ? "Your address"
                        : "Your occupation"
                  }
                  className="w-full mt-1 px-3 py-2 text-sm rounded-lg border-2 outline-none"
                  style={{
                    borderColor: "var(--royal-blue)",
                    color: "var(--dark-gray)",
                  }}
                />
              </div>
            ) : (
              <InfoRow
                key={field}
                icon={
                  field === "phone"
                    ? Phone
                    : field === "address"
                      ? MapPin
                      : Briefcase
                }
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={contact[field] || "Not provided"}
                color={
                  field === "phone"
                    ? "var(--success-dark)"
                    : field === "address"
                      ? "var(--warning)"
                      : "var(--info)"
                }
              />
            ),
          )}
        </div>

        {/* Children summary */}
        <div className="space-y-4">
          <div
            className="bg-white rounded-xl border shadow-sm p-5"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <h3
              className="font-black text-sm mb-3 flex items-center gap-2"
              style={{ color: "var(--dark-gray)" }}
            >
              <Users size={14} style={{ color: "#7c3aed" }} /> My Children
            </h3>
            <div className="space-y-3">
              {childIds.map((id) => {
                const child = CHILDREN_DATA[id];
                if (!child) return null;
                const results = child.results.current;
                const total = results.subjects.reduce(
                  (s, sub) => s + sub.total,
                  0,
                );
                const maxS = results.subjects.length * 100;
                const pct = ((total / maxS) * 100).toFixed(1);
                const band = getPerformanceBand(parseFloat(pct));
                const attPct = Math.round(
                  (child.attendance.summary.present /
                    child.attendance.summary.totalDays) *
                    100,
                );
                return (
                  <div
                    key={id}
                    className="p-4 rounded-xl border"
                    style={{
                      borderColor: "var(--medium-gray)",
                      backgroundColor: "var(--light-gray)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                        style={{ backgroundColor: "var(--royal-blue)" }}
                      >
                        {child.firstName[0]}
                        {child.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-sm font-black"
                          style={{ color: "var(--dark-gray)" }}
                        >
                          {child.firstName} {child.lastName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {child.studentId} · {child.formClass}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-white">
                        <p
                          className="text-sm font-black"
                          style={{ color: band.color }}
                        >
                          {pct}%
                        </p>
                        <p className="text-xs text-gray-400">Score</p>
                      </div>
                      <div className="p-2 rounded-lg bg-white">
                        <p
                          className="text-sm font-black"
                          style={{ color: "var(--warning)" }}
                        >
                          {results.position}/{results.totalStudents}
                        </p>
                        <p className="text-xs text-gray-400">Position</p>
                      </div>
                      <div className="p-2 rounded-lg bg-white">
                        <p
                          className="text-sm font-black"
                          style={{
                            color:
                              attPct >= 95
                                ? "var(--success-dark)"
                                : "var(--accent-red)",
                          }}
                        >
                          {attPct}%
                        </p>
                        <p className="text-xs text-gray-400">Attend.</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
