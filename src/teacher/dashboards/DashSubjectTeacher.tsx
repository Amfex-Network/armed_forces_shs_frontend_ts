// src/teacher/dashboards/DashSubjectTeacher.jsx
import React from "react";
import {
  Users,
  ClipboardList,
  FileText,
  Activity,
  CheckSquare,
  MessageSquare,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { CLASSES_DATA } from "../data/teacherData";
import {
  WelcomeBanner,
  StatRow,
  MyClassesStrip,
  NotificationsStrip,
  TrackSchedule,
  QuickActions,
} from "./DashboardShell";

const DashSubjectTeacher = () => {
  const total = CLASSES_DATA.reduce((s, c) => s + c.students, 0);
  const pendingCA = CLASSES_DATA.filter((c) => !c.caSubmitted).length;
  const pendingEx = CLASSES_DATA.filter((c) => !c.examSubmitted).length;

  return (
    <div className="space-y-6">
      <WelcomeBanner
        title="Subject Teacher"
        subtitle="Teach · Score · Attend · Comment"
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
            icon: ClipboardList,
            label: "Pending CA",
            value: pendingCA,
            sub: "classes awaiting",
            color: pendingCA > 0 ? "var(--accent-red)" : "var(--success-dark)",
          },
          {
            icon: FileText,
            label: "Pending Exam",
            value: pendingEx,
            sub: "classes awaiting",
            color: pendingEx > 0 ? "#f97316" : "var(--success-dark)",
          },
          {
            icon: Activity,
            label: "Submitted Classes",
            value: CLASSES_DATA.filter((c) => c.caSubmitted && c.examSubmitted)
              .length,
            sub: "fully done",
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
            label: "Analytics",
            icon: BarChart3,
            path: "/teacher/analytics",
            color: "var(--info)",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MyClassesStrip />
        </div>
        <NotificationsStrip />
      </div>

      <TrackSchedule />
    </div>
  );
};

export default DashSubjectTeacher;
