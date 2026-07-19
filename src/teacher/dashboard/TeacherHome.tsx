// src/teacher/dashboard/TeacherHome.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";

import DashSubjectTeacher from "../dashboards/DashSubjectTeacher";
import DashSubjectFormTeacher from "../dashboards/DashSubjectFormTeacher";
import { DashHODSubject, DashHODSubjectForm } from "../dashboards/DashHOD";
import { DashExamCoord } from "../dashboards/DashExamCoord";

const DASHBOARDS = {
  "Subject Teacher": DashSubjectTeacher,
  "Subject Teacher + Form Teacher": DashSubjectFormTeacher,
  "Subject Teacher + HOD": DashHODSubject,
  "Subject Teacher + Form Teacher + HOD": DashHODSubjectForm,
  Examiner: DashExamCoord,
};

const TeacherHome = () => {
  const { activeRole } = useAuth();
  const Dashboard = DASHBOARDS[activeRole] || DashSubjectTeacher;
  return <Dashboard />;
};

export default TeacherHome;
