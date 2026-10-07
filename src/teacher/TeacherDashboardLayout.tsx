// src/teacher/TeacherDashboardLayout.jsx
import React, { useState, useEffect } from "react";
import {
  NavLink,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaTachometerAlt,
  FaBookOpen,
  FaClipboardList,
  FaCheckSquare,
  FaCommentDots,
  FaFileAlt,
  FaChartBar,
  FaAward,
  FaUsers,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaCog,
  FaUser,
  FaCalendarCheck,
} from "react-icons/fa";
import { useSettings } from "../context/SettingsContext";
import logo from "../assets/logo.png";
import { isFormTeacher, isHod } from "../utils/teacherRoles";

interface NavItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  path: string;
  end?: boolean;
  badge?: string;
}

// Nav item definitions
const N: Record<string, NavItem> = {
  dashboard: {
    icon: FaTachometerAlt,
    label: "Dashboard",
    path: "/teacher",
    end: true,
  },
  classes: { icon: FaBookOpen, label: "My Classes", path: "/teacher/classes" },
  scores: {
    icon: FaClipboardList,
    label: "Score Entry",
    path: "/teacher/scores",
  },
  attendance: {
    icon: FaCheckSquare,
    label: "Attendance",
    path: "/teacher/attendance",
  },
  comments: {
    icon: FaCommentDots,
    label: "Comments",
    path: "/teacher/comments",
  },
  reports: { icon: FaFileAlt, label: "Report Cards", path: "/teacher/reports" },
  timetable: {
    icon: FaCalendarCheck,
    label: "Timetable",
    path: "/teacher/timetable",
  },
  analytics: {
    icon: FaChartBar,
    label: "Analytics",
    path: "/teacher/analytics",
  },
  formclass: {
    icon: FaUsers,
    label: "My Form Class",
    path: "/teacher/formclass",
  },
  scoreReview: {
    icon: FaClipboardList,
    label: "Score Review",
    path: "/teacher/scoreReview",
  },
  department: {
    icon: FaChartBar,
    label: "Department Review",
    path: "/teacher/department",
  },
};

// Every teacher teaches; HOD and Form Teacher duties add their own section,
// so a teacher with several duties sees all of their tools together.
const buildNav = (role: string) => {
  const sections = [
    {
      section: "Main",
      items: [N.dashboard, N.classes, N.scores, N.attendance],
    },
    {
      section: "Academic",
      items: [N.comments, N.reports, N.scoreReview, N.timetable, N.analytics],
    },
  ];
  if (isFormTeacher(role)) {
    sections.push({ section: "Form Teacher", items: [N.formclass] });
  }
  if (isHod(role)) {
    sections.push({ section: "Head of Department", items: [N.department] });
  }
  return sections;
};

const TeacherDashboardLayout = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, activeRole } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const navSections = buildNav(activeRole);
  const otherNav = [
    { icon: FaUser, label: "Profile", path: "/teacher/profile" },
    { icon: FaCog, label: "Settings", path: "/teacher/settings" },
  ];

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--light-gray)" }}
    >
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col shadow-2xl border-r-4 transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          background:
            "linear-gradient(180deg, var(--royal-blue), var(--royal-blue-dark))",
          borderRightColor: "var(--accent-red)",
        }}
      >
        {/* Branding */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 flex-shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2 text-white min-w-0">
              <Link to="/">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <img
                    src={logo}
                    alt="AFSHTS"
                    className="w-7 h-7 object-contain"
                  />
                </div>
              </Link>
              <div className="min-w-0">
                <p className="text-sm font-black leading-tight truncate">
                  ARMED FORCES SHTS
                </p>
                <p className="text-xs text-blue-200 italic truncate">
                  Service With Humanity
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex text-white hover:text-blue-200 p-1 transition"
            >
              <FaBars />
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-white hover:text-blue-200 p-1 transition"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Teacher profile */}
        {!collapsed && (
          <div className="flex flex-col items-center py-4 px-4 border-b border-white/20 flex-shrink-0">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow text-white font-black text-lg uppercase border-2 border-white/20"
              style={{ backgroundColor: "var(--accent-red)" }}
            >
              {user?.firstName?.[0] || user?.name?.[0] || "T"}
              {user?.lastName?.[0] || ""}
            </div>
            <p className="text-white text-sm font-bold text-center leading-tight">
              {user?.title} {user?.firstName || user?.name || "Teacher"}{" "}
              {user?.lastName || ""}
            </p>
            <p className="text-blue-200 text-xs text-center mt-0.5">
              {user?.subject}
            </p>
            {user?.department && (
              <p className="text-blue-300/60 text-xs text-center">
                {user?.department} Dept
              </p>
            )}
            <div
              className="mt-2 w-full px-2 py-1.5 rounded-lg text-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <p className="text-xs font-bold text-yellow-300 leading-snug">
                {activeRole}
              </p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="mb-1">
              {!collapsed && (
                <p
                  className="text-xs font-black px-3 pt-3 pb-1 uppercase tracking-widest"
                  style={{ color: "rgba(147,197,253,0.5)" }}
                >
                  {section.section}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-0.5
                      ${isActive ? "bg-white/15 text-white border-l-4 shadow-sm" : "text-blue-200 hover:text-white hover:bg-white/10"}`
                    }
                    style={({ isActive }) =>
                      isActive ? { borderLeftColor: "var(--accent-red)" } : {}
                    }
                  >
                    <Icon className="text-base flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-sm truncate">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded font-bold flex-shrink-0"
                            style={{
                              backgroundColor: "rgba(230,57,70,0.3)",
                              color: "#fca5a5",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}

          {!collapsed && (
            <p
              className="text-xs font-black px-3 pt-3 pb-1 uppercase tracking-widest"
              style={{ color: "rgba(147,197,253,0.5)" }}
            >
              Others
            </p>
          )}
          {otherNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-0.5
                  ${isActive ? "bg-white/15 text-white border-l-4 shadow-sm" : "text-blue-200 hover:text-white hover:bg-white/10"}`
                }
                style={({ isActive }) =>
                  isActive ? { borderLeftColor: "var(--accent-red)" } : {}
                }
              >
                <Icon className="text-base flex-shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/20 flex-shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300 text-xs">System Online</span>
            </div>
          )}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 w-full text-white text-sm px-3 py-2 rounded-lg transition-all"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--accent-red)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
          >
            <FaSignOutAlt />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        <div
          className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm sticky top-0 z-30"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1"
            style={{ color: "var(--dark-gray)" }}
          >
            <FaBars className="text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="AFSHTS" className="w-6 h-6 object-contain" />
            <span
              className="font-black text-sm"
              style={{ color: "var(--royal-blue)" }}
            >
              Teacher Portal
            </span>
          </div>
          <span
            className="text-xs font-semibold px-2 py-1 rounded"
            style={{ backgroundColor: "#eef2ff", color: "var(--royal-blue)" }}
          >
            {settings.currentTerm}
          </span>
        </div>

        <header
          className="hidden lg:flex items-center justify-between px-6 py-3 bg-white border-b flex-shrink-0"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--dark-gray)", opacity: 0.7 }}
          >
            ARMED FORCES SHTS · Teacher Portal /{" "}
            <span
              style={{
                color: "var(--royal-blue)",
                fontWeight: 700,
                opacity: 1,
              }}
            >
              {user?.title} {user?.lastName}
            </span>{" "}
            ·{" "}
            <span style={{ color: "var(--accent-red)", fontWeight: 700 }}>
              {activeRole}
            </span>
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span
              className="px-3 py-1.5 rounded-lg font-semibold"
              style={{ backgroundColor: "#eef2ff", color: "var(--royal-blue)" }}
            >
              {settings.currentAcademicYear} · {settings.currentTerm}
            </span>
            <span
              className="px-3 py-1.5 rounded-lg font-semibold"
              style={{ backgroundColor: "#fffbeb", color: "#92400e" }}
            >
              Transitional System
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            style={{ animation: "slideUp .2s ease" }}
          >
            <div
              className="px-6 py-5 text-center"
              style={{
                background:
                  "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <FaSignOutAlt size={22} className="text-white" />
              </div>
              <p className="text-white font-black text-lg">Sign Out</p>
              <p className="text-blue-200 text-xs mt-1">
                AFSHTS Teacher Portal
              </p>
            </div>
            <div
              className="h-1"
              style={{ backgroundColor: "var(--royal-blue)" }}
            />
            <div className="p-6 space-y-4">
              <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: "var(--light-gray)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                  style={{ backgroundColor: "var(--royal-blue)" }}
                >
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
                <div className="min-w-0">
                  <p
                    className="font-bold text-sm truncate"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {user?.title} {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.staffId} · {activeRole}
                  </p>
                </div>
              </div>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to sign out?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl border-2"
                  style={{
                    borderColor: "var(--medium-gray)",
                    color: "var(--dark-gray)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white rounded-xl"
                  style={{ backgroundColor: "var(--accent-red)" }}
                >
                  <FaSignOutAlt size={13} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default TeacherDashboardLayout;
