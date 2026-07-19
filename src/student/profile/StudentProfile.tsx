// src/student/profile/StudentProfile.jsx
import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Calendar,
  Users,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { TERM_INFO } from "../data/studentData";

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

const StudentProfile = () => {
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
            {user?.studentId} · {user?.formClass}
          </p>
        </div>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition"
            style={{ backgroundColor: "#eef2ff", color: "var(--royal-blue)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#dbeafe")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#eef2ff")
            }
          >
            <Edit3 size={13} /> Edit Contact
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl text-white transition"
              style={{ backgroundColor: "var(--success-dark)" }}
            >
              <Save size={13} /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition"
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
        {/* Avatar banner */}
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
              style={{ backgroundColor: "var(--success-dark)" }}
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
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-sm text-gray-400">{user?.studentId}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              {
                label: user?.formClass,
                bg: "#eef2ff",
                color: "var(--royal-blue)",
              },
              {
                label: user?.program,
                bg: "#f0fdf4",
                color: "var(--success-dark)",
              },
              {
                label: `Track ${user?.track}`,
                bg: "#fffbeb",
                color: "#92400e",
              },
              {
                label: user?.houseName,
                bg: "#fff1f2",
                color: "var(--accent-red)",
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
            className="font-black text-sm mb-2"
            style={{ color: "var(--dark-gray)" }}
          >
            Personal Information
          </h3>
          <InfoRow
            icon={User}
            label="Full Name"
            value={`${user?.firstName} ${user?.lastName}`}
            color="var(--royal-blue)"
          />
          <InfoRow
            icon={Calendar}
            label="Date of Birth"
            value={
              user?.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—"
            }
            color="var(--info)"
          />
          <InfoRow
            icon={User}
            label="Gender"
            value={user?.gender}
            color="#7c3aed"
          />
          <InfoRow
            icon={MapPin}
            label="Address"
            value={editMode ? undefined : contact.address}
            color="var(--warning)"
          />
          {editMode && (
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
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border-2 outline-none"
                style={{
                  borderColor: "var(--royal-blue)",
                  color: "var(--dark-gray)",
                }}
              />
            </div>
          )}
          <InfoRow
            icon={Phone}
            label="Phone"
            value={editMode ? undefined : contact.phone || "Not provided"}
            color="var(--success-dark)"
          />
          {editMode && (
            <div
              className="py-3 border-b"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <label className="text-xs text-gray-400 uppercase tracking-wider">
                Phone
              </label>
              <input
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                placeholder="e.g. 0244123456"
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border-2 outline-none"
                style={{
                  borderColor: "var(--royal-blue)",
                  color: "var(--dark-gray)",
                }}
              />
            </div>
          )}
          <InfoRow
            icon={Mail}
            label="Email"
            value={user?.email}
            color="var(--accent-red)"
          />
        </div>

        <div className="space-y-5">
          {/* Academic info */}
          <div
            className="bg-white rounded-xl border shadow-sm p-5"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <h3
              className="font-black text-sm mb-2"
              style={{ color: "var(--dark-gray)" }}
            >
              Academic Information
            </h3>
            <InfoRow
              icon={BookOpen}
              label="Student ID"
              value={user?.studentId}
              color="var(--royal-blue)"
            />
            <InfoRow
              icon={BookOpen}
              label="Class / Form"
              value={user?.formClass}
              color="var(--info)"
            />
            <InfoRow
              icon={BookOpen}
              label="Course"
              value={user?.course || user?.program}
              color="#7c3aed"
            />
            <InfoRow
              icon={BookOpen}
              label="Year Group"
              value={user?.year || user?.yearGroup || "Form 1"}
              color="var(--warning)"
            />
            <InfoRow
              icon={BookOpen}
              label="Year Group"
              value={user?.year}
              color="var(--success-dark)"
            />
            <InfoRow
              icon={BookOpen}
              label="House"
              value={user?.houseName}
              color="var(--accent-red)"
            />
            <InfoRow
              icon={Calendar}
              label="Academic Year"
              value={TERM_INFO.academicYear}
              color="var(--royal-blue)"
            />
          </div>

          {/* Parent / Guardian info */}
          <div
            className="bg-white rounded-xl border shadow-sm p-5"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <h3
              className="font-black text-sm mb-2"
              style={{ color: "var(--dark-gray)" }}
            >
              Parent / Guardian
            </h3>
            <InfoRow
              icon={Users}
              label="Name"
              value={user?.parentName}
              color="var(--royal-blue)"
            />
            <InfoRow
              icon={Phone}
              label="Phone"
              value={user?.parentPhone}
              color="var(--success-dark)"
            />
            <InfoRow
              icon={Mail}
              label="Email"
              value={user?.parentEmail}
              color="var(--info)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
