// src/teacher/dashboards/DashSubjectFormTeacher.jsx
import React from "react";
import {
  Users,
  ClipboardList,
  FileText,
  Star,
  CheckSquare,
  MessageSquare,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import {
  CLASSES_DATA,
  FORM_CLASS_STUDENTS,
  getGradeColor,
} from "../data/teacherData";
import {
  WelcomeBanner,
  StatRow,
  SectionCard,
  MiniStats,
  MyClassesStrip,
  NotificationsStrip,
  TrackSchedule,
  QuickActions,
} from "./DashboardShell";
import { Avatar, LoadBar } from "../components/TeacherUI";
import { useAuth } from "../../context/AuthContext";

const DashSubjectFormTeacher = () => {
  const { user } = useAuth();
  const total = CLASSES_DATA.reduce((s, c) => s + c.students, 0);
  const pendingCA = CLASSES_DATA.filter((c) => !c.caSubmitted).length;
  const a1s = FORM_CLASS_STUDENTS.filter((s) => s.grade === "A1").length;
  const avgAtt = Math.round(
    FORM_CLASS_STUDENTS.reduce((s, st) => s + st.attendance, 0) /
      FORM_CLASS_STUDENTS.length,
  );
  const atRisk = FORM_CLASS_STUDENTS.filter(
    (s) => s.attendance < 85 || ["D7", "E8", "F9"].includes(s.grade),
  );
  const avgScore = Math.round(
    FORM_CLASS_STUDENTS.reduce((s, st) => s + st.total, 0) /
      FORM_CLASS_STUDENTS.length,
  );

  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="Subject Teacher + Form Teacher"
        subtitle={`Form Class: ${user?.formClass || "Form 3 Science B"}`}
        accentColor="var(--info)"
      />

      <StatRow
        stats={[
          {
            icon: Users,
            label: "Total Students",
            value: total,
            sub: `${CLASSES_DATA.length} classes`,
            color: "var(--royal-blue)",
          },
          {
            icon: Star,
            label: "Form Class Size",
            value: FORM_CLASS_STUDENTS.length,
            sub: user?.formClass || "",
            color: "var(--info)",
          },
          {
            icon: ClipboardList,
            label: "Pending CA",
            value: pendingCA,
            sub: "classes awaiting",
            color: pendingCA > 0 ? "var(--accent-red)" : "var(--success-dark)",
          },
          {
            icon: FileText,
            label: "A1 Grades (Form)",
            value: a1s,
            sub: `Avg: ${avgScore}%`,
            color: "var(--success-dark)",
          },
        ]}
      />

      <QuickActions
        actions={[
          {
            label: "My Classes",
            icon: BookOpen,
            path: "/teacher/classes",
            color: "var(--royal-blue)",
          },
          {
            label: "Score Entry",
            icon: ClipboardList,
            path: "/teacher/scores",
            color: "var(--accent-red)",
          },
          {
            label: "Attendance",
            icon: CheckSquare,
            path: "/teacher/attendance",
            color: "var(--success-dark)",
          },
          {
            label: "Comments",
            icon: MessageSquare,
            path: "/teacher/comments",
            color: "var(--warning)",
          },
          {
            label: "Form Class",
            icon: Users,
            path: "/teacher/formclass",
            color: "var(--info)",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Class Panel */}
        <SectionCard
          title={`Form Class — ${user?.formClass || "Form 3 Science B"}`}
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
                label: "Avg Attend",
                value: `${avgAtt}%`,
                color: "var(--warning)",
              },
            ]}
          />

          {atRisk.length > 0 && (
            <div
              className="mt-4 rounded-lg p-3 border"
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

          {/* Top 3 students */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">
              Top Performers
            </p>
            {FORM_CLASS_STUDENTS.sort((a, b) => b.total - a.total)
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

        {/* Classes + notifications */}
        <div className="space-y-5">
          <MyClassesStrip />
          <NotificationsStrip />
        </div>
      </div>

      <TrackSchedule />
    </div>
  );
};

export default DashSubjectFormTeacher;
