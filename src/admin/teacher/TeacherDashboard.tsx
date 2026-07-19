// src/teacher/TeacherDashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
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
  FaShieldAlt,
} from "react-icons/fa";
import { TERM_INFO } from "./data/teacherData";

const TeacherDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHOD = user?.additionalRoles?.includes("HOD");
  const isFormTeacher = user?.additionalRoles?.includes("Form Teacher");

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate("/teacherLogin", { replace: true });
  };

  const mainNav = [
    { icon: <FaTachometerAlt />, label: "Dashboard", path: "/teacher" },
    { icon: <FaBookOpen />, label: "My Classes", path: "/teacher/classes" },
    {
      icon: <FaClipboardList />,
      label: "Score Entry",
      path: "/teacher/scores",
    },
    {
      icon: <FaCheckSquare />,
      label: "Attendance",
      path: "/teacher/attendance",
    },
    { icon: <FaCommentDots />, label: "Comments", path: "/teacher/comments" },
    { icon: <FaFileAlt />, label: "Report Cards", path: "/teacher/reports" },
    { icon: <FaChartBar />, label: "Analytics", path: "/teacher/analytics" },
    ...(isHOD
      ? [
          {
            icon: <FaAward />,
            label: "HOD Panel",
            path: "/teacher/hod",
            badge: "HOD",
          },
        ]
      : []),
    ...(isFormTeacher
      ? [
          {
            icon: <FaUsers />,
            label: "Form Class",
            path: "/teacher/formclass",
            badge: "FT",
          },
        ]
      : []),
  ];

  const otherNav = [
    { icon: <FaUser />, label: "Profile", path: "/teacher/profile" },
    { icon: <FaCog />, label: "Settings", path: "/teacher/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col shadow-2xl border-r-4 border-red-600
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ background: "linear-gradient(180deg, #1e3a8a, #172554)" }}
      >
        {/* Branding */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 flex-shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2 text-white min-w-0">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaShieldAlt className="text-yellow-400 text-lg" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold leading-tight truncate">
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
              className="text-white hover:text-blue-200 p-1 transition"
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
            <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center mb-2 shadow text-white font-bold text-lg uppercase">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <p className="text-white text-sm font-semibold text-center leading-tight">
              {user?.title} {user?.firstName} {user?.lastName}
            </p>
            <p className="text-blue-200 text-xs text-center mt-0.5">
              {user?.subject || "Teacher"}
            </p>
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {["Subject Teacher", ...(user?.additionalRoles || [])].map(
                (r) => (
                  <span
                    key={r}
                    className="text-xs px-1.5 py-0.5 bg-white/10 text-blue-200 rounded"
                  >
                    {r}
                  </span>
                ),
              )}
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {mainNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/teacher"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-white/10 text-white border-l-4 border-red-500 shadow"
                    : "text-blue-200 hover:text-white hover:bg-white/10"
                }`
              }
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1 text-sm truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs px-1.5 py-0.5 bg-white/20 text-white rounded font-bold flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {!collapsed && (
            <p className="text-xs font-bold text-gray-400 px-3 pt-4 pb-1 uppercase tracking-wider">
              Others
            </p>
          )}

          {otherNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-white/10 text-white border-l-4 border-red-500"
                    : "text-blue-200 hover:text-white hover:bg-white/10"
                }`
              }
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </NavLink>
          ))}
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
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-white text-sm px-3 py-2 rounded-lg bg-white/10 hover:bg-red-600 transition-all"
          >
            <FaSignOutAlt />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-gray-600 hover:text-blue-900 p-1"
          >
            <FaBars className="text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-yellow-500" />
            <span className="font-bold text-blue-900 text-sm">
              Teacher Portal
            </span>
          </div>
          <span className="text-xs text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded">
            {TERM_INFO.term}
          </span>
        </div>

        {/* Desktop top bar */}
        <header className="hidden lg:flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <p className="text-xs text-gray-400">
            Teacher Portal /{" "}
            <span className="text-blue-700 font-medium">
              {user?.title} {user?.lastName}
            </span>
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-lg font-medium">
              📅 {TERM_INFO.academicYear} · {TERM_INFO.term} · Track{" "}
              {TERM_INFO.track}
            </span>
            <span className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-1.5 rounded-lg font-medium">
              🔁 Double Track School
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboardLayout;
