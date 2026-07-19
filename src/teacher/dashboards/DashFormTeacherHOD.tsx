// src/teacher/dashboards/DashFormTeacherHOD.jsx
import React from "react";
import {
  Award,
  Users,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Star,
} from "lucide-react";
import {
  DEPT_TEACHERS,
  FORM_CLASS_STUDENTS,
  getGradeColor,
} from "../data/teacherData";
import {
  WelcomeBanner,
  StatRow,
  SectionCard,
  MiniStats,
  NotificationsStrip,
  TrackSchedule,
  QuickActions,
} from "./DashboardShell";
import { Avatar, LoadBar } from "../components/TeacherUI";
import { useAuth } from "../../context/AuthContext";

const DashFormTeacherHOD = () => {
  const { user } = useAuth();

  const a1s = FORM_CLASS_STUDENTS.filter((s) => s.grade === "A1").length;
  const avgAtt = Math.round(
    FORM_CLASS_STUDENTS.reduce((s, st) => s + st.attendance, 0) /
      FORM_CLASS_STUDENTS.length,
  );
  const avgScore = Math.round(
    FORM_CLASS_STUDENTS.reduce((s, st) => s + st.total, 0) /
      FORM_CLASS_STUDENTS.length,
  );
  const atRisk = FORM_CLASS_STUDENTS.filter(
    (s) => s.attendance < 85 || ["D7", "E8", "F9"].includes(s.grade),
  );
  const overloaded = DEPT_TEACHERS.filter((t) => t.load >= 90).length;
  const avgLoad = Math.round(
    DEPT_TEACHERS.reduce((s, t) => s + t.load, 0) / DEPT_TEACHERS.length,
  );
  const totalClasses = DEPT_TEACHERS.reduce((s, t) => s + t.classes, 0);

  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="Form Teacher + HOD"
        subtitle={`Form Class: ${user?.formClass || "Form 3B"} · ${user?.department} Department HOD`}
        accentColor="#0369a1"
      />

      <StatRow
        stats={[
          {
            icon: Users,
            label: "Form Class Size",
            value: FORM_CLASS_STUDENTS.length,
            sub: user?.formClass || "Form 3B",
            color: "var(--info)",
          },
          {
            icon: Star,
            label: "A1 Grades",
            value: a1s,
            sub: `Avg score: ${avgScore}%`,
            color: "var(--success-dark)",
          },
          {
            icon: Award,
            label: "Dept Teachers",
            value: DEPT_TEACHERS.length,
            sub: `${user?.department} Dept`,
            color: "#7c3aed",
          },
          {
            icon: TrendingUp,
            label: "Dept Avg Load",
            value: `${avgLoad}%`,
            sub: overloaded > 0 ? `${overloaded} overloaded` : "Balanced",
            color: overloaded > 0 ? "var(--accent-red)" : "var(--success-dark)",
          },
        ]}
      />

      <QuickActions
        actions={[
          {
            label: "Form Class",
            icon: Users,
            path: "/teacher/formclass",
            color: "var(--info)",
          },
          {
            label: "HOD Panel",
            icon: Award,
            path: "/teacher/hod",
            color: "#7c3aed",
          },
          {
            label: "Attendance",
            icon: BookOpen,
            path: "/teacher/attendance",
            color: "var(--success-dark)",
          },
          {
            label: "Analytics",
            icon: TrendingUp,
            path: "/teacher/analytics",
            color: "var(--royal-blue)",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Class Panel */}
        <SectionCard
          title={`Form Class — ${user?.formClass || "Form 3B"}`}
          icon={Users}
          accentColor="var(--info)"
          linkTo="/teacher/formclass"
        >
          <MiniStats
            items={[
              {
                label: "Students",
                value: FORM_CLASS_STUDENTS.length,
                color: "var(--royal-blue)",
              },
              { label: "A1 Grades", value: a1s, color: "var(--success-dark)" },
              {
                label: "Avg Score",
                value: `${avgScore}%`,
                color: "var(--info)",
              },
              {
                label: "Avg Att",
                value: `${avgAtt}%`,
                color: "var(--warning)",
              },
            ]}
          />

          {atRisk.length > 0 && (
            <div
              className="mt-4 p-3 rounded-xl border"
              style={{
                backgroundColor: "#fff1f2",
                borderColor: "var(--accent-red-light)",
              }}
            >
              <p
                className="text-xs font-bold mb-2 flex items-center gap-1"
                style={{ color: "var(--accent-red)" }}
              >
                <AlertCircle size={12} /> {atRisk.length} student
                {atRisk.length > 1 ? "s" : ""} need attention
              </p>
              <div className="space-y-1.5">
                {atRisk.map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <Avatar name={s.name} size="sm" color="bg-red-500" />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {s.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Attendance: {s.attendance}%
                      </p>
                    </div>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-bold ${getGradeColor(s.grade)}`}
                    >
                      {s.grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top students */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">
              Top Performers
            </p>
            {[...FORM_CLASS_STUDENTS]
              .sort((a, b) => b.total - a.total)
              .slice(0, 3)
              .map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 py-1.5">
                  <span
                    className="text-xs font-black w-4"
                    style={{ color: ["#f59e0b", "#9ca3af", "#cd7c2f"][i] }}
                  >
                    #{i + 1}
                  </span>
                  <Avatar
                    name={s.name}
                    size="sm"
                    color={["bg-yellow-500", "bg-gray-400", "bg-amber-600"][i]}
                  />
                  <span
                    className="text-xs flex-1 truncate"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {s.name}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-bold ${getGradeColor(s.grade)}`}
                  >
                    {s.grade} ({s.total})
                  </span>
                </div>
              ))}
          </div>
        </SectionCard>

        {/* HOD Department Panel */}
        <SectionCard
          title={`${user?.department} Department`}
          icon={Award}
          accentColor="#7c3aed"
          linkTo="/teacher/hod"
        >
          <MiniStats
            items={[
              {
                label: "Teachers",
                value: DEPT_TEACHERS.length,
                color: "#7c3aed",
              },
              {
                label: "Classes",
                value: totalClasses,
                color: "var(--royal-blue)",
              },
              { label: "Students", value: 524, color: "var(--success-dark)" },
              {
                label: "Avg Load",
                value: `${avgLoad}%`,
                color:
                  avgLoad >= 85 ? "var(--accent-red)" : "var(--success-dark)",
              },
            ]}
          />

          <div className="mt-4 space-y-2.5">
            <p className="text-xs font-semibold text-gray-500">
              Department Teachers
            </p>
            {DEPT_TEACHERS.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <Avatar
                  name={t.name}
                  size="sm"
                  color={i === 0 ? "bg-purple-700" : "bg-blue-600"}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-400">{t.subject}</p>
                </div>
                <div className="w-20 flex-shrink-0">
                  <LoadBar pct={t.load} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationsStrip />
      </div>

      <TrackSchedule />
    </div>
  );
};

export default DashFormTeacherHOD;
