import React, { useEffect, useState } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Hash,
} from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import type { AppSettings } from "../../api/settings";

const REGIONS = [
  "",
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

const Field = ({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  placeholder,
}: any) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      )}
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${Icon ? "pl-9" : "pl-3"} pr-3 py-2.5 text-sm rounded-xl border-2 outline-none bg-white`}
          style={{ borderColor: "var(--medium-gray)", color: "var(--dark-gray)" }}
        >
          {options.map((o: string) => (
            <option key={o} value={o}>
              {o || "- Select -"}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${Icon ? "pl-9" : "pl-3"} pr-3 py-2.5 text-sm rounded-xl border-2 outline-none`}
          style={{ borderColor: "var(--medium-gray)", color: "var(--dark-gray)" }}
        />
      )}
    </div>
  </div>
);

const SchoolProfileSetup = () => {
  const { settings, loading, save } = useSettings();
  const [form, setForm] = useState<Partial<AppSettings>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null,
  );

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setForm({
      schoolName: settings.schoolName,
      shortName: settings.shortName,
      motto: settings.motto,
      schoolType: settings.schoolType,
      waecCode: settings.waecCode,
      region: settings.region,
      district: settings.district,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      website: settings.website,
    });
  }, [settings]);

  const set = (k: keyof AppSettings, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    try {
      setSaving(true);
      await save(form);
      showToast("School profile saved");
    } catch (e: any) {
      showToast(e?.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center text-sm text-gray-400">Loading…</div>
    );

  return (
    <div className="space-y-5">
      {toast && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2"
          style={{
            backgroundColor:
              toast.type === "error"
                ? "var(--accent-red)"
                : "var(--success-dark)",
          }}
        >
          {toast.type === "error" ? (
            <AlertCircle size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--dark-gray)" }}>
            School Profile
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Basic identity and contact details used across the system
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-sm disabled:opacity-50"
          style={{ backgroundColor: "var(--royal-blue)" }}
        >
          <Save size={15} /> {saving ? "Saving…" : "Save Profile"}
        </button>
      </div>

      <div
        className="bg-white rounded-xl border shadow-sm p-5 space-y-5"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            icon={Building2}
            label="School Name"
            value={form.schoolName || ""}
            onChange={(v: string) => set("schoolName", v)}
          />
          <Field
            label="Short Name"
            value={form.shortName || ""}
            onChange={(v: string) => set("shortName", v)}
            placeholder="e.g. AFSHTS"
          />
          <Field
            label="Motto"
            value={form.motto || ""}
            onChange={(v: string) => set("motto", v)}
            placeholder="School motto"
          />
          <Field
            label="School Type"
            value={form.schoolType || ""}
            onChange={(v: string) => set("schoolType", v)}
            placeholder="e.g. Senior High Technical"
          />
          <Field
            icon={Hash}
            label="WAEC Centre Code"
            value={form.waecCode || ""}
            onChange={(v: string) => set("waecCode", v)}
          />
          <Field
            label="Region"
            value={form.region || ""}
            onChange={(v: string) => set("region", v)}
            options={REGIONS}
          />
          <Field
            icon={MapPin}
            label="District"
            value={form.district || ""}
            onChange={(v: string) => set("district", v)}
          />
          <Field
            icon={MapPin}
            label="Address"
            value={form.address || ""}
            onChange={(v: string) => set("address", v)}
          />
          <Field
            icon={Phone}
            label="Phone"
            value={form.phone || ""}
            onChange={(v: string) => set("phone", v)}
          />
          <Field
            icon={Mail}
            label="Email"
            value={form.email || ""}
            onChange={(v: string) => set("email", v)}
          />
          <Field
            icon={Globe}
            label="Website"
            value={form.website || ""}
            onChange={(v: string) => set("website", v)}
          />
        </div>
      </div>
    </div>
  );
};

export default SchoolProfileSetup;
