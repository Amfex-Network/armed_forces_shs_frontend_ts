import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Users, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useActiveChild } from "../ParentDashboardLayout";

const InfoRow = ({
  icon: Icon,
  label,
  value,
  color = "var(--royal-blue)",
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  value?: string;
  color?: string;
}) => (
  <div
    className="flex items-start gap-3 py-3 border-b"
    style={{ borderColor: "var(--medium-gray)" }}
  >
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: color + "15" }}
    >
      <Icon size={14} style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
      <p
        className="text-sm font-semibold mt-0.5"
        style={{ color: "var(--dark-gray)" }}
      >
        {value || "—"}
      </p>
    </div>
  </div>
);

const ParentProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { children, setActiveChildId } = useActiveChild();

  const viewChild = (id: string) => {
    setActiveChildId(id);
    navigate("/parent/results");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black" style={{ color: "var(--dark-gray)" }}>
          My Profile
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Parent / Guardian Account</p>
      </div>

      {/* Profile card */}
      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="h-24 relative"
          style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
        >
          <div className="absolute -bottom-8 left-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl uppercase shadow-lg border-4 border-white"
              style={{ backgroundColor: "#7c3aed" }}
            >
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
          </div>
        </div>
        <div className="pt-12 px-6 pb-6">
          <h2 className="text-xl font-black" style={{ color: "var(--dark-gray)" }}>
            {user?.title} {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-sm text-gray-400">Parent / Guardian</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}
            >
              {children.length} child{children.length === 1 ? "" : "ren"}{" "}
              enrolled
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parent info */}
        <div
          className="bg-white rounded-xl border shadow-sm p-5"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <h3
            className="font-black text-sm mb-2"
            style={{ color: "var(--dark-gray)" }}
          >
            Personal Information
          </h3>

          <InfoRow
            icon={User}
            label="Full Name"
            value={`${user?.title || ""} ${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
            color="var(--royal-blue)"
          />
          <InfoRow
            icon={Mail}
            label="Email"
            value={user?.email}
            color="var(--accent-red)"
          />
          <InfoRow
            icon={Phone}
            label="Phone"
            value={(user?.phone as string) || "Not provided"}
            color="var(--success-dark)"
          />
          <InfoRow
            icon={MapPin}
            label="Address"
            value={(user?.address as string) || "Not provided"}
            color="var(--warning)"
          />
        </div>

        {/* Children summary */}
        <div
          className="bg-white rounded-xl border shadow-sm p-5"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <h3
            className="font-black text-sm mb-3 flex items-center gap-2"
            style={{ color: "var(--dark-gray)" }}
          >
            <Users size={14} style={{ color: "#7c3aed" }} /> My Children
          </h3>
          {children.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">
              No children are linked to your account yet. Please contact the
              Admin office.
            </p>
          ) : (
            <div className="space-y-3">
              {children.map((child) => {
                const id = child.id as string;
                return (
                  <button
                    key={id}
                    onClick={() => viewChild(id)}
                    className="w-full text-left p-4 rounded-xl border flex items-center gap-3 hover:shadow-md transition"
                    style={{
                      borderColor: "var(--medium-gray)",
                      backgroundColor: "var(--light-gray)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                      style={{ backgroundColor: "var(--royal-blue)" }}
                    >
                      {child.firstName?.[0]}
                      {child.lastName?.[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-black"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {child.firstName} {child.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {child.studentId} · {child.formClass}
                        {child.course ? ` · ${child.course}` : ""}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="flex-shrink-0"
                      style={{ color: "var(--royal-blue)" }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
