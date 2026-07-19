// src/teacher/profile/TeacherProfile.jsx
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
  Award,
  Calendar,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { TERM_INFO } from "../data/teacherData";

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

const TeacherProfile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [contact, setContact] = useState({
    phone: user?.phone || "",
    address: user?.address || "Uaddara Barracks, Kumasi",
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            My Profile
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {user?.staffId} · {user?.department} Department
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
          style={{
            background:
              "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
          }}
        >
          <div className="absolute -bottom-8 left-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl uppercase shadow-lg border-4 border-white"
              style={{ backgroundColor: "var(--accent-red)" }}
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
          <p className="text-sm text-gray-400">{user?.staffId}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              {
                label: user?.subject,
                bg: "#eef2ff",
                color: "var(--royal-blue)",
              },
              {
                label: user?.department + " Dept",
                bg: "#f5f3ff",
                color: "#7c3aed",
              },
              {
                label: user?.qualification,
                bg: "#f0fdf4",
                color: "var(--success-dark)",
              },
              {
                label: user?.employmentType,
                bg: "#fffbeb",
                color: "var(--warning)",
              },
            ]
              .filter((t) => t.label)
              .map((t) => (
                <span
                  key={t.label}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: t.bg, color: t.color }}
                >
                  {t.label}
                </span>
              ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal info */}
        <div
          className="bg-white rounded-xl border shadow-sm p-5"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <h3
            className="font-black text-sm mb-3"
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
          <InfoRow
            icon={BookOpen}
            label="Subject Taught"
            value={user?.subject}
            color="var(--info)"
          />
          <InfoRow
            icon={Briefcase}
            label="Department"
            value={user?.department}
            color="#7c3aed"
          />
          <InfoRow
            icon={Award}
            label="Qualification"
            value={user?.qualification}
            color="var(--warning)"
          />
          <InfoRow
            icon={User}
            label="Employment Type"
            value={user?.employmentType}
            color="var(--success-dark)"
          />

          {/* Editable fields */}
          {editMode ? (
            <>
              <div
                className="py-3 border-b"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Phone
                </label>
                <input
                  value={draft.phone}
                  onChange={(e) =>
                    setDraft({ ...draft, phone: e.target.value })
                  }
                  placeholder="e.g. 0244123456"
                  className="w-full mt-1 px-3 py-2 text-sm rounded-lg border-2 outline-none"
                  style={{
                    borderColor: "var(--royal-blue)",
                    color: "var(--dark-gray)",
                  }}
                />
              </div>
              <div
                className="py-3 border-b"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Address
                </label>
                <input
                  value={draft.address}
                  onChange={(e) =>
                    setDraft({ ...draft, address: e.target.value })
                  }
                  placeholder="Your address"
                  className="w-full mt-1 px-3 py-2 text-sm rounded-lg border-2 outline-none"
                  style={{
                    borderColor: "var(--royal-blue)",
                    color: "var(--dark-gray)",
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <InfoRow
                icon={Phone}
                label="Phone"
                value={contact.phone || "Not provided"}
                color="var(--success-dark)"
              />
              <InfoRow
                icon={MapPin}
                label="Address"
                value={contact.address || "Not provided"}
                color="var(--warning)"
              />
            </>
          )}
        </div>

        {/* Academic info */}
        <div className="space-y-5">
          <div
            className="bg-white rounded-xl border shadow-sm p-5"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <h3
              className="font-black text-sm mb-3"
              style={{ color: "var(--dark-gray)" }}
            >
              School Information
            </h3>
            <InfoRow
              icon={BookOpen}
              label="Staff ID"
              value={user?.staffId}
              color="var(--royal-blue)"
            />
            <InfoRow
              icon={BookOpen}
              label="Year Group"
              value={user?.yearGroup || "All Year Groups"}
              color="var(--warning)"
            />
            <InfoRow
              icon={BookOpen}
              label="Max Periods"
              value={`${user?.maxPeriods || 30} per week`}
              color="var(--info)"
            />
            <InfoRow
              icon={BookOpen}
              label="Current Periods"
              value={`${user?.currentPeriods || 0} this week`}
              color="var(--success-dark)"
            />
            {user?.formClass && (
              <InfoRow
                icon={User}
                label="Form Class"
                value={user.formClass}
                color="#7c3aed"
              />
            )}
          </div>

          {/* Current term */}
          <div
            className="bg-white rounded-xl border shadow-sm p-5"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <h3
              className="font-black text-sm mb-3"
              style={{ color: "var(--dark-gray)" }}
            >
              Current Term
            </h3>
            <div
              className="rounded-xl p-4 text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
              }}
            >
              <p className="text-blue-200 text-xs">{TERM_INFO.academicYear}</p>
              <p className="font-black text-lg">{TERM_INFO.term}</p>
              <p className="text-blue-200 text-xs mt-1">
                Week {TERM_INFO.weeksGone} of {TERM_INFO.weeksTotal}
              </p>
              <div
                className="mt-2 h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round((TERM_INFO.weeksGone / TERM_INFO.weeksTotal) * 100)}%`,
                    backgroundColor: "#facc15",
                  }}
                />
              </div>
              <p className="text-yellow-300 text-xs mt-1 font-bold">
                {TERM_INFO.startDate} → {TERM_INFO.endDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
