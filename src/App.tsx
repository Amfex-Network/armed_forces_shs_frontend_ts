// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StudentProvider } from "./context/StudentContext";
import { SettingsProvider } from "./context/SettingsContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import Hero from "./components/Hero";
import Features from "./pages/features/Features";
import Contact from "./pages/contact/Contact";
import About from "./pages/about/About";
import AdminLogin from "./layout/AdminLogin";
import AdminLogout from "./layout/AdminLogout";
import LogoutPage from "./layout/LogoutPage";
import TeacherLogin from "./layout/TeacherLogin";
import StudentLogin from "./layout/StudentLogin";
import ParentLogin from "./layout/ParentLogin";
import ForgotPassword from "./auth/ForgotPassword";
import ChangePasswordPage from "./auth/ChangePasswordPage";
import DashboardLayout from "./admin/DashboardLayout";
import Dashboard from "./admin/dashboard/Dashboard";
import UserManagement from "./admin/user-management/UserManagement";
import SchoolStructure from "./admin/academic-setup/SchoolStructure";
import GradingConfig from "./admin/academic-setup/GradingConfig";
import CommentBank from "./admin/academic-setup/CommentBank";
import BulkCommunication from "./admin/bulkCommunication/BulkCommunication";
import Students from "./admin/students/Students";
import Parents from "./admin/parents/Parents";
import Teacher from "./admin/teacher/Teacher";
import Profile from "./admin/profile/Profile";
import Settings from "./admin/settings/Settings";
import AcademicStructure1 from "./admin/academic-structure1/AcademicStructure1";
import AcademicStructure2 from "./admin/academic-structure2/AcademicStructure2";
import ReportTemplateWrapper from "./admin/reportTemplate/ReportTemplateWrapper";
import ScoreCorrection from "./admin/score-correction/ScoreCorrection";
import PublishReports from "./admin/publish-reports/PublishReports";
import AdditionalInfo from "./admin/additional-info/AdditionalInfo";
import AuditLogs from "./admin/audit-logs/AuditLogs";
import TeacherDashboardLayout from "./teacher/TeacherDashboardLayout";
import TeacherHome from "./teacher/dashboard/TeacherHome";
import TeacherClasses from "./teacher/classes/TeacherClasses";
import TeacherScores from "./teacher/scores/TeacherScores";
import TeacherAttendance from "./teacher/attendance/TeacherAttendance";
import TeacherComments from "./teacher/comments/TeacherComments";
import TeacherAnalytics from "./teacher/analytics/TeacherAnalytics";
import TeacherFormClass from "./teacher/formclass/TeacherFormClass";
import ScopedPanel from "./teacher/components/ScopedPanel";
import TeacherReports from "./teacher/reports/TeacherReports";
import ScoreReview from "./teacher/score-review/ScoreReview";
import TeacherTimetable from "./teacher/timetable/TeacherTimetable";
import TeacherProfile from "./teacher/profile/TeacherProfile";

// Student Portal
import StudentDashboardLayout from "./student/StudentDashboardLayout";
import StudentHome from "./student/dashboard/StudentHome";
import StudentResults from "./student/results/StudentResults";
import StudentReportCard from "./student/reportcard/StudentReportCard";
import StudentAttendance from "./student/attendance/StudentAttendance";
import StudentTimetable from "./student/timetable/StudentTimetable";
import StudentProfile from "./student/profile/StudentProfile";
import StudentSettings from "./student/setting/StudentSettings";

// Parent Portal
import ParentDashboardLayout from "./parent/ParentDashboardLayout";
import ParentHome from "./parent/dashboard/ParentHome";
import ParentResults from "./parent/results/ParentResults";
import ParentReportCard from "./parent/reportcard/ParentReportCard";
import ParentAttendance from "./parent/attendance/ParentAttendance";
import ParentProfile from "./parent/profile/ParentProfile";
import ParentSettings from "./parent/settings/ParentSettings";

// Admin extras
import AdminAnalytics from "./admin/analytics/AdminAnalytics";
import SchoolCalendar from "./admin/calendar/SchoolCalendar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => (
  <AuthProvider>
    <SettingsProvider>
      <StudentProvider>
        <ToastContainer />
        <Routes>
          {/* Public */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Hero />} />
            <Route path="features" element={<Features />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Login pages */}
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/adminLogout" element={<AdminLogout />} />
          <Route
            path="/teacherLogout"
            element={<LogoutPage role="teacher" />}
          />
          <Route
            path="/studentLogout"
            element={<LogoutPage role="student" />}
          />
          <Route path="/parentLogout" element={<LogoutPage role="parent" />} />
          <Route path="/teacherLogin" element={<TeacherLogin />} />
          <Route path="/studentLogin" element={<StudentLogin />} />
          <Route path="/parentLogin" element={<ParentLogin />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/changePassword" element={<ChangePasswordPage />} />

          {/* Admin */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="userManagement" element={<UserManagement />} />
            <Route path="schoolStructure" element={<SchoolStructure />} />
            <Route path="gradingConfig" element={<GradingConfig />} />
            <Route path="commentBank" element={<CommentBank />} />
            <Route path="teacher" element={<Teacher />} />
            <Route path="students" element={<Students />} />
            <Route path="parents" element={<Parents />} />
            <Route path="bulkCommunication" element={<BulkCommunication />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="academicStructure1" element={<AcademicStructure1 />} />
            <Route path="academicStructure2" element={<AcademicStructure2 />} />
            <Route path="reportTemplate" element={<ReportTemplateWrapper />} />
            <Route path="scoreCorrection" element={<ScoreCorrection />} />
            <Route path="publishReports" element={<PublishReports />} />
            <Route path="additionalInfo" element={<AdditionalInfo />} />
            <Route path="auditLogs" element={<AuditLogs />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="calendar" element={<SchoolCalendar />} />
          </Route>

          {/* Teacher portal */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherHome />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="scores" element={<TeacherScores />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="comments" element={<TeacherComments />} />
            <Route path="reports" element={<TeacherReports />} />
            <Route path="timetable" element={<TeacherTimetable />} />
            <Route path="analytics" element={<TeacherAnalytics />} />
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path="hod"
              element={<ScopedPanel title="Head of Department" />}
            />
            <Route path="formclass" element={<TeacherFormClass />} />
            <Route path="scoreReview" element={<ScoreReview />} />
            <Route
              path="assistant-hod"
              element={<ScopedPanel title="Assistant HOD" />}
            />
            <Route
              path="yeargroup"
              element={<ScopedPanel title="Year Group Head" />}
            />
            <Route
              path="examcoord"
              element={<ScopedPanel title="Exam Coordinator" />}
            />
            <Route
              path="house"
              element={<ScopedPanel title="House Master" />}
            />
            <Route
              path="counsellor"
              element={<ScopedPanel title="Counsellor" />}
            />
            <Route
              path="waec"
              element={<ScopedPanel title="WAEC Coordinator" />}
            />
            <Route
              path="workshop"
              element={<ScopedPanel title="Workshop Instructor" />}
            />
            <Route
              path="sports"
              element={<ScopedPanel title="Sports Master" />}
            />
          </Route>

          {/* Student portal */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentHome />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="reportcard" element={<StudentReportCard />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="timetable" element={<StudentTimetable />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="setting" element={<StudentSettings />} />
          </Route>

          {/* Parent portal */}
          <Route
            path="/parent"
            element={
              <ProtectedRoute allowedRole="parent">
                <ParentDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ParentHome />} />
            <Route path="results" element={<ParentResults />} />
            <Route path="reportcard" element={<ParentReportCard />} />
            <Route path="attendance" element={<ParentAttendance />} />
            <Route path="profile" element={<ParentProfile />} />
            {/* <Route path="settings" element={<ParentSettings />} /> */}
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </StudentProvider>
    </SettingsProvider>
  </AuthProvider>
);

export default App;
