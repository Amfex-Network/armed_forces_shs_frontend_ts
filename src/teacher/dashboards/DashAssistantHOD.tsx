// src/teacher/dashboards/DashAssistantHOD.jsx
import React from "react";
import {
  Shield,
  Users,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
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

const PENDING_TASKS = [
  {
    task: "Review CA score submissions for Form 1 classes",
    due: "Friday",
    done: false,
  },
  {
    task: "Compile dept performance report for HOD",
    due: "Next Monday",
    done: false,
  },
  {
    task: "Confirm exam timetable with Exam Coordinator",
    due: "Done",
    done: true,
  },
  {
    task: "Organise dept meeting for next term planning",
    due: "End of term",
    done: false,
  },
];

const AssistantHODContent = () => {
  const { user } = useAuth();
  const avgLoad = Math.round(
    DEPT_TEACHERS.reduce((s, t) => s + t.load, 0) / DEPT_TEACHERS.length,
  );
  const totalClasses = DEPT_TEACHERS.reduce((s, t) => s + t.classes, 0);
  const pending = PENDING_TASKS.filter((t) => !t.done).length;

  return (
    <>
      <StatRow
        stats={[
          {
            icon: Users,
            label: "Dept Teachers",
            value: DEPT_TEACHERS.length,
            sub: `${user?.department} Dept`,
            color: "#6d28d9",
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
            label: "Avg Dept Load",
            value: `${avgLoad}%`,
            sub: "teaching load",
            color: avgLoad >= 85 ? "var(--accent-red)" : "var(--success-dark)",
          },
          {
            icon: AlertCircle,
            label: "Pending Tasks",
            value: pending,
            sub: "action required",
            color: pending > 0 ? "var(--warning)" : "var(--success-dark)",
          },
        ]}
      />

      <QuickActions
        actions={[
          {
            label: "Asst HOD",
            icon: Shield,
            path: "/teacher/assistant-hod",
            color: "#6d28d9",
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
          title="Department Teachers"
          icon={Users}
          accentColor="#6d28d9"
          linkTo="/teacher/assistant-hod"
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
                  <p className="text-xs text-gray-400">{t.subject}</p>
                </div>
                <div className="w-20 flex-shrink-0">
                  <LoadBar pct={t.load} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Pending Tasks"
          icon={CheckCircle2}
          accentColor="var(--warning)"
        >
          <div className="space-y-2.5">
            {PENDING_TASKS.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                {item.done ? (
                  <CheckCircle2
                    size={14}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "var(--success-dark)" }}
                  />
                ) : (
                  <AlertCircle
                    size={14}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "var(--warning)" }}
                  />
                )}
                <div className="flex-1">
                  <p
                    className={`text-xs ${item.done ? "line-through text-gray-400" : ""}`}
                    style={{
                      color: item.done ? undefined : "var(--dark-gray)",
                    }}
                  >
                    {item.task}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Due: {item.due}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
};

export const DashAssistantHOD = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="Assistant HOD"
        subtitle={`Supporting the ${user?.department} Department HOD`}
        accentColor="#6d28d9"
      />
      <AssistantHODContent />
      <NotificationsStrip />
      <TrackSchedule />
    </div>
  );
};

export const DashAssistantHODSubject = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="Assistant HOD + Subject Teacher"
        subtitle={`${user?.department} Dept · Teaching ${user?.subject}`}
        accentColor="#6d28d9"
      />
      <AssistantHODContent />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="My Teaching Classes"
          icon={BookOpen}
          accentColor="var(--royal-blue)"
          linkTo="/teacher/classes"
        >
          <p className="text-xs text-gray-500 mb-3">
            Teaching:{" "}
            <strong style={{ color: "var(--royal-blue)" }}>
              {user?.subject}
            </strong>
          </p>
          {[
            { name: "Form 1A", track: "A", students: 42 },
            { name: "Form 1B", track: "A", students: 40 },
            { name: "Form 2B", track: "B", students: 38 },
          ].map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between p-2 rounded-lg mb-2"
              style={{ backgroundColor: "var(--light-gray)" }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: "var(--dark-gray)" }}
              >
                {c.name}
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded font-semibold"
                style={{
                  backgroundColor: c.track === "A" ? "#fefce8" : "#f0fdf4",
                  color: c.track === "A" ? "#854d0e" : "var(--success-dark)",
                }}
              >
                Track {c.track}
              </span>
            </div>
          ))}
        </SectionCard>
        <NotificationsStrip />
      </div>
      <TrackSchedule />
    </div>
  );
};

export default DashAssistantHOD;
