// src/admin/academic-structure1/SchoolProfileSetup.jsx
import React, { useState, useRef } from "react";
import {
  Save,
  Camera,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Hash,
} from "lucide-react";
import { SCHOOL_INFO } from "../data/adminData";

const REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Bono",
  "Ahafo",
  "Bono East",
  "Oti",
  "North East",
  "Savannah",
  "Western North",
];

const SchoolProfileSetup = () => {
  const [profile, setProfile] = useState({
    name: SCHOOL_INFO.name,
    shortName: SCHOOL_INFO.shortName,
    motto: SCHOOL_INFO.motto,
    type: SCHOOL_INFO.type,
    waecCode: SCHOOL_INFO.waecCode,
    gesCode: "GH-ASH-00042",
    founded: "1998",
    ownership: "Ghana Armed Forces",
    accreditation: "Ghana Education Service (GES)",
    region: "Ashanti",
    district: "Kumasi Metropolitan",
    address: SCHOOL_INFO.address,
    postal: "P.O. Box 1234, Kumasi",
    phone: SCHOOL_INFO.phone,
    email: SCHOOL_INFO.email,
    website: SCHOOL_INFO.website,
  });
  const [logo, setLogo] = useState(null);
  const [toast, setToast] = useState(null);
  const fileRef = useRef();
  const set = (k, v) => setProfile((p) => ({ ...p, [k]: v }));
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const FInput = ({
    label,
    field,
    placeholder,
    type = "text",
    options,
    required,
    icon: Icon,
    span2 = false,
  }) => (
    <div className={span2 ? "sm:col-span-2" : ""}>
      {label && (
        <label
          className="text-xs font-bold uppercase tracking-wider block mb-1.5"
          style={{ color: "var(--dark-gray)" }}
        >
          {label}
          {required && <span style={{ color: "var(--accent-red)" }}> *</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}
        {options ? (
          <select
            value={profile[field] || ""}
            onChange={(e) => set(field, e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none bg-white"
            style={{
              borderColor: "var(--medium-gray)",
              color: "var(--dark-gray)",
              paddingLeft: Icon ? "2rem" : "0.75rem",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--medium-gray)")}
          >
            <option value="">-- Select --</option>
            {options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={profile[field] || ""}
            onChange={(e) => set(field, e.target.value)}
            placeholder={placeholder}
            className="w-full py-2.5 text-sm rounded-xl border-2 outline-none"
            style={{
              borderColor: "var(--medium-gray)",
              color: "var(--dark-gray)",
              paddingLeft: Icon ? "2rem" : "0.75rem",
              paddingRight: "0.75rem",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--royal-blue)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--medium-gray)")}
          />
        )}
      </div>
    </div>
  );

  const Section = ({ title, children }) => (
    <div
      className="bg-white rounded-2xl border shadow-sm overflow-hidden"
      style={{ borderColor: "var(--medium-gray)" }}
    >
      <div
        className="px-5 py-3 border-b text-xs font-black uppercase tracking-widest"
        style={{
          borderColor: "var(--medium-gray)",
          backgroundColor: "var(--light-gray)",
          color: "var(--royal-blue)",
        }}
      >
        {title}
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {toast && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2"
          style={{ backgroundColor: "var(--success-dark)" }}
        >
          <CheckCircle2 size={14} /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2
            className="font-black text-base"
            style={{ color: "var(--dark-gray)" }}
          >
            School Profile Setup
          </h2>
          <p className="text-xs text-gray-400">
            School identity, contacts and leadership
          </p>
        </div>
        <button
          type="button"
          onClick={() => showToast("School profile saved")}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white"
          style={{ backgroundColor: "var(--royal-blue)" }}
        >
          <Save size={14} /> Save Profile
        </button>
      </div>

      {/* Logo banner */}
      <div
        className="bg-white rounded-2xl border overflow-hidden shadow-sm"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div
          className="h-20 relative"
          style={{
            background:
              "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
          }}
        />
        <div className="relative px-5 pb-5">
          <div className="flex items-end gap-4 -mt-8">
            <div className="relative flex-shrink-0">
              <div
                className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-white font-black text-lg"
                style={{ backgroundColor: "var(--accent-red)" }}
              >
                {logo ? (
                  <img
                    src={logo}
                    alt="logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.shortName
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white shadow"
                style={{ backgroundColor: "var(--royal-blue)" }}
              >
                <Camera size={10} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const r = new FileReader();
                    r.onloadend = () => setLogo(r.result);
                    r.readAsDataURL(f);
                  }
                }}
              />
            </div>
            <div className="pb-1">
              <h2
                className="font-black text-base"
                style={{ color: "var(--dark-gray)" }}
              >
                {profile.name}
              </h2>
              <p className="text-xs text-gray-400 italic">{profile.motto}</p>
            </div>
          </div>
        </div>
      </div>

      <Section title="School Identity">
        <FInput
          label="Full School Name"
          field="name"
          placeholder="Full name"
          required
          icon={Building2}
          span2
        />
        <FInput
          label="Short Name"
          field="shortName"
          placeholder="e.g. AFSHTS"
          required
        />
        <FInput label="Motto" field="motto" placeholder="School motto" span2 />
        <FInput
          label="School Type"
          field="type"
          placeholder="e.g. Senior High Technical School"
        />
        <FInput
          label="WAEC Centre Code"
          field="waecCode"
          placeholder="e.g. GH0042"
          icon={Hash}
        />
        <FInput
          label="GES Code"
          field="gesCode"
          placeholder="e.g. GH-ASH-00042"
          icon={Hash}
        />
        <FInput label="Founded" field="founded" placeholder="e.g. 1998" />
        <FInput
          label="Ownership / Authority"
          field="ownership"
          placeholder="e.g. Ghana Armed Forces"
        />
      </Section>

      <Section title="Location & Contact">
        <FInput
          label="Physical Address"
          field="address"
          placeholder="School physical address"
          icon={MapPin}
          span2
        />
        <FInput
          label="Postal Address"
          field="postal"
          placeholder="P.O. Box..."
          span2
        />
        <FInput label="Region" field="region" options={REGIONS} />
        <FInput
          label="District"
          field="district"
          placeholder="e.g. Kumasi Metropolitan"
        />
        <FInput
          label="Phone"
          field="phone"
          placeholder="+233..."
          icon={Phone}
        />
        <FInput
          label="Email"
          field="email"
          placeholder="info@school.edu.gh"
          icon={Mail}
          type="email"
        />
        <FInput
          label="Website"
          field="website"
          placeholder="www.school.edu.gh"
          icon={Globe}
        />
      </Section>
    </div>
  );
};
export default SchoolProfileSetup;
