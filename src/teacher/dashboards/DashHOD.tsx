// src/teacher/dashboards/DashHOD.jsx
import React from "react";
import {
  Award,
  Users,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { DEPT_TEACHERS } from "../data/teacherData";
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

const HODContent = () => {
  const { user } = useAuth();
  const overloaded = DEPT_TEACHERS.filter((t) => t.load >= 90).length;
  const avgLoad = Math.round(
    DEPT_TEACHERS.reduce((s, t) => s + t.load, 0) / DEPT_TEACHERS.length,
  );
  const totalClasses = DEPT_TEACHERS.reduce((s, t) => s + t.classes, 0);

  return (
    <>
      <StatRow
        stats={[
          {
            icon: Users,
            label: "Dept Teachers",
            value: DEPT_TEACHERS.length,
            sub: `${user?.department} Dept`,
            color: "#7c3aed",
          },
          {
            icon: BookOpen,
            label: "Total Classes",
            value: totalClasses,
            sub: "across dept",
            color: "var(--royal-blue)",
          },
          {
            icon: TrendingUp,
            label: "Avg Load",
            value: `${avgLoad}%`,
            sub: "teaching load",
            color: avgLoad >= 85 ? "var(--accent-red)" : "var(--success-dark)",
          },
          {
            icon: AlertCircle,
            label: "Overloaded",
            value: overloaded,
            sub: overloaded > 0 ? "need relief" : "all balanced",
            color: overloaded > 0 ? "var(--accent-red)" : "var(--success-dark)",
          },
        ]}
      />

      <QuickActions
        actions={[
          {
            label: "HOD Panel",
            icon: Award,
            path: "/teacher/hod",
            color: "#7c3aed",
          },
          {
            label: "Score Entry",
            icon: BookOpen,
            path: "/teacher/scores",
            color: "var(--royal-blue)",
          },
          {
            label: "Analytics",
            icon: TrendingUp,
            path: "/teacher/analytics",
            color: "var(--info)",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title={`${user?.department} Department Teachers`}
          icon={Award}
          accentColor="#7c3aed"
          linkTo="/teacher/hod"
        >
          <div className="space-y-3">
            {DEPT_TEACHERS.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
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
                  <p className="text-xs text-gray-400">
                    {t.subject} · {t.classes} classes
                  </p>
                </div>
                <div className="w-24 flex-shrink-0">
                  <LoadBar pct={t.load} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-5">
          {/* Dept summary */}
          <SectionCard
            title="Department Summary"
            icon={TrendingUp}
            accentColor="#7c3aed"
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
          </SectionCard>
          <NotificationsStrip />
        </div>
      </div>
    </>
  );
};

export const DashHOD = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="Head of Department"
        subtitle={`Leading the ${user?.department} Department`}
        accentColor="#7c3aed"
      />
      <HODContent />
      <TrackSchedule />
    </div>
  );
};

export const DashHODSubject = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="HOD + Subject Teacher"
        subtitle={`${user?.department} Department · Teaching ${user?.subject}`}
        accentColor="#7c3aed"
      />
      <HODContent />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="My Teaching Classes"
          icon={BookOpen}
          accentColor="var(--royal-blue)"
          linkTo="/teacher/classes"
        >
          <p className="text-xs text-gray-500 mb-3">
            Your subject:{" "}
            <strong style={{ color: "var(--royal-blue)" }}>
              {user?.subject}
            </strong>
          </p>
          <div className="space-y-2">
            {[
              { name: "Form 1A", track: "A", students: 42 },
              { name: "Form 1B", track: "A", students: 40 },
              { name: "Form 2B", track: "B", students: 38 },
              { name: "Form 3B", track: "B", students: 36 },
            ].map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between p-2 rounded-lg"
                style={{ backgroundColor: "var(--light-gray)" }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--dark-gray)" }}
                >
                  {c.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {c.students} students
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-semibold"
                    style={{
                      backgroundColor: c.track === "A" ? "#fefce8" : "#f0fdf4",
                      color:
                        c.track === "A" ? "#854d0e" : "var(--success-dark)",
                    }}
                  >
                    Track {c.track}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <NotificationsStrip />
      </div>
      <TrackSchedule />
    </div>
  );
};

export const DashHODSubjectForm = () => {
  const { user } = useAuth();
  const a1s = 3;
  const avgAtt = 94;
  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="HOD + Subject Teacher + Form Teacher"
        subtitle={`${user?.department} HOD · ${user?.subject} · Form Class: ${user?.formClass || "Form 3B"}`}
        accentColor="#5b21b6"
      />
      <HODContent />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title={`Form Class — ${user?.formClass || "Form 3B"}`}
          icon={Users}
          accentColor="var(--info)"
          linkTo="/teacher/formclass"
        >
          <MiniStats
            items={[
              { label: "Students", value: 36, color: "var(--royal-blue)" },
              { label: "A1s", value: a1s, color: "var(--success-dark)" },
              {
                label: "Avg Att",
                value: `${avgAtt}%`,
                color: "var(--warning)",
              },
              { label: "Avg Score", value: "78%", color: "var(--info)" },
            ]}
          />
        </SectionCard>
        <NotificationsStrip />
      </div>
      <TrackSchedule />
    </div>
  );
};

export default DashHOD;
