// src/admin/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

import {
  FaTachometerAlt,
  FaUsers,
  FaPaperPlane,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUserFriends,
  FaCalendarAlt,
  FaLayerGroup,
  FaFileAlt,
  FaClipboardList,
  FaBullhorn,
  FaInfoCircle,
  FaHistory,
  FaCog,
  FaUser,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaShieldAlt,
  FaBook,
  FaCommentDots,
  FaChartBar,
  FaCalendar,
  FaDollarSign,
  FaEraser,
} from "react-icons/fa";
import { MdDashboard, MdSchool } from "react-icons/md";

// Sidebar nav sections
const NAV_SECTIONS = [
  {
    section: "Main",
    items: [
      {
        icon: FaTachometerAlt,
        label: "Dashboard",
        path: "/dashboard",
        end: true,
      },
      {
        icon: FaUsers,
        label: "User Management",
        path: "/dashboard/userManagement",
      },
    ],
  },
  {
    section: "People",
    items: [
      {
        icon: FaChalkboardTeacher,
        label: "Teachers",
        path: "/dashboard/teacher",
      },
      { icon: FaUserGraduate, label: "Students", path: "/dashboard/students" },
      { icon: FaUserFriends, label: "Parents", path: "/dashboard/parents" },
    ],
  },
  {
    section: "Academic Setup",
    items: [
      {
        icon: FaLayerGroup,
        label: "Structure - Part 1",
        path: "/dashboard/academicStructure1",
      },
      {
        icon: FaLayerGroup,
        label: "Structure - Part 2",
        path: "/dashboard/academicStructure2",
      },
      {
        icon: FaBook,
        label: "Grading Config",
        path: "/dashboard/gradingConfig",
      },
      {
        icon: FaCommentDots,
        label: "Comment Bank",
        path: "/dashboard/commentBank",
      },
    ],
  },
  {
    section: "Reports",
    items: [
      {
        icon: FaFileAlt,
        label: "Report Template",
        path: "/dashboard/reportTemplate",
      },
      {
        icon: FaClipboardList,
        label: "Additional Info",
        path: "/dashboard/additionalInfo",
      },
      {
        icon: FaEraser,
        label: "Score Correction",
        path: "/dashboard/scoreCorrection",
      },

      {
        icon: FaClipboardList,
        label: "Publish Reports",
        path: "/dashboard/publishReports",
      },
    ],
  },
  {
    section: "Communication",
    items: [
      {
        icon: FaBullhorn,
        label: "Bulk Communication",
        path: "/dashboard/bulkCommunication",
      },
    ],
  },
  {
    section: "Analytics & Finance",
    items: [
      { icon: FaChartBar, label: "Analytics", path: "/dashboard/analytics" },
      {
        icon: FaCalendar,
        label: "School Calendar",
        path: "/dashboard/calendar",
      },
    ],
  },
  {
    section: "System",
    items: [
      { icon: FaHistory, label: "Audit Logs", path: "/dashboard/auditLogs" },
    ],
  },
];

const OTHER_NAV = [
  { icon: FaUser, label: "Profile", path: "/dashboard/profile" },
  { icon: FaCog, label: "Settings", path: "/dashboard/settings" },
];

// DashboardLayout
const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
    navigate("/adminLogout", { replace: true });
  };

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--light-gray)" }}
    >
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col
          shadow-2xl border-r-4 transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          background: `linear-gradient(180deg, var(--royal-blue), var(--royal-blue-dark))`,
          borderRightColor: "var(--accent-red)",
        }}
      >
        {/* Branding */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 flex-shrink-0">
          {!collapsed && (
            <div
              className="flex items-center gap-2 text-white min-w-0 cursor-pointer"
              onClick={() => (window.location.href = "/")}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <img src={logo} alt="AFTS" className="w-7 h-7 object-contain" />
              </div>
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
            {/* Desktop only - collapse/expand */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex text-white hover:text-blue-200 p-1 transition"
            >
              <FaBars />
            </button>
            {/* Mobile only - close sidebar */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-white hover:text-blue-200 p-1 transition"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Admin profile */}
        {!collapsed && (
          <div className="flex flex-col items-center py-4 px-4 border-b border-white/20 flex-shrink-0">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow text-white font-black text-xl uppercase border-2 border-white/20"
              style={{ backgroundColor: "var(--accent-red)" }}
            >
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "AD"}
            </div>
            <p className="text-white text-sm font-bold text-center leading-tight">
              {user?.name || "System Administrator"}
            </p>
            <p className="text-blue-200 text-xs text-center mt-0.5 truncate max-w-full px-2">
              {user?.email || "admin@afts.edu.gh"}
            </p>
            <div
              className="mt-2 px-2 py-1 rounded-lg"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <p className="text-xs font-bold text-yellow-300">Administrator</p>
            </div>
          </div>
        )}

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {NAV_SECTIONS.map((section, sIdx) => (
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
                      ${
                        isActive
                          ? "bg-white/15 text-white border-l-4 shadow-sm"
                          : "text-blue-200 hover:text-white hover:bg-white/10"
                      }`
                    }
                    style={({ isActive }) =>
                      isActive ? { borderLeftColor: "var(--accent-red)" } : {}
                    }
                  >
                    <Icon className="text-base flex-shrink-0" />
                    {!collapsed && (
                      <span className="text-sm truncate">{item.label}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}

          {/* Others */}
          {!collapsed && (
            <p
              className="text-xs font-black px-3 pt-3 pb-1 uppercase tracking-widest"
              style={{ color: "rgba(147,197,253,0.5)" }}
            >
              Others
            </p>
          )}
          {OTHER_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-0.5
                  ${
                    isActive
                      ? "bg-white/15 text-white border-l-4 shadow-sm"
                      : "text-blue-200 hover:text-white hover:bg-white/10"
                  }`
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
        {/* Mobile top bar */}
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
            <img src={logo} alt="AFTS" className="w-6 h-6 object-contain" />
            <span
              className="font-black text-sm"
              style={{ color: "var(--royal-blue)" }}
            >
              Admin Portal
            </span>
          </div>
          <div className="w-8" />
        </div>

        {/* Desktop top bar */}
        <header
          className="hidden lg:flex items-center justify-between px-6 py-3 bg-white border-b flex-shrink-0"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--dark-gray)", opacity: 0.7 }}
          >
            ARMED FORCES SHTS · Admin Portal /{" "}
            <span
              style={{
                color: "var(--royal-blue)",
                fontWeight: 700,
                opacity: 1,
              }}
            >
              {user?.name || "Administrator"}
            </span>
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span
              className="px-3 py-1.5 rounded-lg font-semibold"
              style={{ backgroundColor: "#eef2ff", color: "var(--royal-blue)" }}
            >
              2024/2025 · Semester 1
            </span>
            <span
              className="px-3 py-1.5 rounded-lg font-semibold"
              style={{
                backgroundColor: "#f0fdf4",
                color: "var(--success-dark)",
              }}
            >
              Transitional System
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            style={{ animation: "slideUp .2s ease" }}
          >
            {/* Header */}
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
                Armed Forces SHTS Admin Portal
              </p>
            </div>
            <div
              className="h-1"
              style={{ backgroundColor: "var(--accent-red)" }}
            />

            {/* User info */}
            <div className="px-6 pt-5 pb-2">
              <div
                className="flex items-center gap-3 p-3 rounded-xl mb-4"
                style={{ backgroundColor: "var(--light-gray)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                  style={{ backgroundColor: "var(--royal-blue)" }}
                >
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "AD"}
                </div>
                <div className="min-w-0">
                  <p
                    className="font-bold text-sm truncate"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    {user?.name || "System Administrator"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email || "admin@afts.edu.gh"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-center text-gray-500 mb-5">
                Are you sure you want to sign out? Any unsaved changes will be
                lost.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl border-2 transition"
                  style={{
                    borderColor: "var(--medium-gray)",
                    color: "var(--dark-gray)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--light-gray)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white rounded-xl transition"
                  style={{ backgroundColor: "var(--accent-red)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--accent-red-dark)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--accent-red)")
                  }
                >
                  <FaSignOutAlt size={13} /> Yes, Sign Out
                </button>
              </div>
            </div>
            <p className="text-xs text-center text-gray-300 pb-4 pt-2">
              Your session will be securely ended
            </p>
          </div>
        </div>
      )}

      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default DashboardLayout;
