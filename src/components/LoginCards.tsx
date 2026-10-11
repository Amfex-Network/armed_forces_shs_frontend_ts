import { Link } from "react-router-dom";
import { ArrowRightToLine } from "lucide-react";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import SchoolIcon from "@mui/icons-material/School";
import { GiTeacher } from "react-icons/gi";
import { RiParentFill } from "react-icons/ri";

// Each portal has its own sign-in page, so the landing page only links to them.
const PORTALS = [
  {
    label: "Teacher Login",
    to: "/teacherLogin",
    Icon: () => <GiTeacher size={48} />,
    className: "bg-green-500 hover:bg-green-600",
  },
  {
    label: "Student Login",
    to: "/studentLogin",
    Icon: () => <AccessibilityNewIcon sx={{ fontSize: 40, color: "white" }} />,
    className: "bg-blue-500 hover:bg-blue-600",
  },
  {
    label: "Admin Login",
    to: "/adminLogin",
    Icon: () => <SchoolIcon sx={{ fontSize: 40, color: "white" }} />,
    className: "bg-red-500 hover:bg-red-600",
  },
  {
    label: "Parent Login",
    to: "/parentLogin",
    Icon: () => <RiParentFill size={48} color="white" />,
    className: "bg-purple-600 hover:bg-purple-700",
  },
];

const LoginCards = () => {
  return (
    <div className="bg-gray-50 px-4 md:px-8 lg:px-24 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex-1 w-full">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--accent-red-dark)] bg-clip-text text-transparent">
            Streamlined Academic Reporting
          </h1>
          <p className="text-gray-700 text-lg mb-3 max-w-xl">
            Comprehensive terminal report management for schools, teachers,
            students, and parents
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            {[
              { title: "Manage", sub: "5000+ Students" },
              { title: "Real-time", sub: "Analytics" },
              { title: "Secure &", sub: "Reliable" },
            ].map(({ title, sub }) => (
              <div
                key={title}
                className="flex items-start px-6 gap-1 py-4 shadow bg-gray-100 border-[var(--royal-blue)] border-l-4 rounded-xl w-full"
              >
                <div className="flex flex-col items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {title}
                  </h3>
                  <p className="text-gray-800">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full max-w-xl">
          <div className="bg-white rounded-3xl border-2 border-blue-700 shadow-lg p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRightToLine className="text-[var(--royal-blue)]" />
                <h2 className="text-2xl font-bold text-[var(--royal-blue)]">
                  Portal Login
                </h2>
              </div>
              <p className="text-gray-600">Select your role to sign in</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {PORTALS.map(({ label, to, Icon, className }) => (
                <Link
                  key={to}
                  to={to}
                  className={`${className} text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:scale-105 shadow-md`}
                >
                  <Icon />
                  <span className="font-semibold text-lg">{label}</span>
                </Link>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Link
                to="/forgotPassword"
                className="text-[var(--accent-red)] font-medium text-sm"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCards;
