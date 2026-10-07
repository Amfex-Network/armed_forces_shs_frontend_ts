import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  CalendarCheck,
  MessageSquare,
  FileText,
  CalendarDays,
  BookOpen,
  Users,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import { classesApi } from "../../api/domains";
import { studentsApi } from "../../api/students";

const TOOLS = [
  {
    to: "/teacher/scores",
    label: "Score Entry",
    desc: "Enter CA & exam marks",
    icon: ClipboardList,
  },
  {
    to: "/teacher/attendance",
    label: "Attendance",
    desc: "Mark daily attendance",
    icon: CalendarCheck,
  },
  {
    to: "/teacher/comments",
    label: "Comments",
    desc: "Write student remarks",
    icon: MessageSquare,
  },
  {
    to: "/teacher/reports",
    label: "Report Cards",
    desc: "Preview & print reports",
    icon: FileText,
  },
  {
    to: "/teacher/timetable",
    label: "Timetable",
    desc: "Manage class schedule",
    icon: CalendarDays,
  },
  {
    to: "/teacher/scoreReview",
    label: "Score Review",
    desc: "Check entry progress",
    icon: BookOpen,
  },
];

const TeacherHome = () => {
  const { user, activeRole } = useAuth();
  const { settings } = useSettings();
  const [classCount, setClassCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    Promise.all([
      classesApi.list().catch(() => []),
      studentsApi.list().catch(() => []),
    ]).then(([cls, studs]) => {
      setClassCount(cls.filter((c) => c.teaching || c.form).length);
      setStudentCount(studs.length);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))",
        }}
      >
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <div className="w-48 h-48 rounded-full bg-white absolute -right-12 -top-12" />
        </div>
        <div className="relative z-10">
          <p className="text-blue-200 text-sm">Welcome back,</p>
          <h2 className="text-xl sm:text-2xl font-black">
            {user?.title} {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-blue-200 text-xs mt-1">
            {activeRole || "Teacher"}
            {user?.department ? ` · ${user.department} Dept` : ""}
            {user?.formClass ? ` · ${user.formClass}` : ""}
          </p>
          <div
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            {settings.currentAcademicYear} · {settings.currentTerm}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            label: "Classes",
            value: classCount,
            color: "var(--royal-blue)",
            icon: BookOpen,
          },
          {
            label: "Students",
            value: studentCount,
            color: "var(--success-dark)",
            icon: Users,
          },
        ].map(({ label, value, color, icon: Icon }) => (
          <div
            key={label}
            className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: color + "18" }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <p
                className="text-2xl font-black"
                style={{ color: "var(--dark-gray)" }}
              >
                {value}
              </p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tools */}
      <div>
        <p
          className="text-xs font-black uppercase tracking-wider mb-3"
          style={{ color: "var(--dark-gray)" }}
        >
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOOLS.map(({ to, label, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition"
              style={{ borderColor: "var(--medium-gray)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#eef2ff" }}
              >
                <Icon size={18} style={{ color: "var(--royal-blue)" }} />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {label}
                </p>
                <p className="text-xs text-gray-400 truncate">{desc}</p>
              </div>
              <ChevronRight
                size={16}
                className="flex-shrink-0"
                style={{ color: "var(--royal-blue)" }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;
