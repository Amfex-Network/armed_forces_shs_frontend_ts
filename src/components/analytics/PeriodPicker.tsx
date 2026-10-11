import React from "react";
import { useSettings } from "../../context/SettingsContext";

const withCurrent = (list: string[], current: string) =>
  list.includes(current) ? list : [current, ...list];

export const PeriodPicker = ({
  term,
  academicYear,
  onTerm,
  onYear,
}: {
  term: string;
  academicYear: string;
  onTerm: (v: string) => void;
  onYear: (v: string) => void;
}) => {
  const { settings } = useSettings();
  const select = "px-3 py-2 text-sm rounded-xl border-2 bg-white";
  return (
    <>
      <label className="text-xs text-gray-500">
        <span className="block mb-1">Academic year</span>
        <select
          value={academicYear}
          onChange={(e) => onYear(e.target.value)}
          className={select}
          style={{ borderColor: "var(--medium-gray)" }}
        >
          {withCurrent(settings.academicYears || [], academicYear).map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </label>
      <label className="text-xs text-gray-500">
        <span className="block mb-1">Term</span>
        <select
          value={term}
          onChange={(e) => onTerm(e.target.value)}
          className={select}
          style={{ borderColor: "var(--medium-gray)" }}
        >
          {withCurrent(settings.terms || [], term).map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
    </>
  );
};
