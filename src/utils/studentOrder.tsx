import React, { useEffect, useState } from "react";

export type StudentSort = "surname" | "index";

interface Named {
  firstName?: string;
  lastName?: string;
  studentId?: string;
}

// Schools record names surname first ("Owusu Emmanuel Amful").
export const surnameFirst = (s: Named) =>
  `${(s.lastName || "").trim()} ${(s.firstName || "").trim()}`.trim();

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export const sortStudents = <T extends Named>(
  list: T[],
  mode: StudentSort,
): T[] =>
  [...list].sort((a, b) =>
    mode === "index"
      ? collator.compare(a.studentId || "", b.studentId || "")
      : collator.compare(a.lastName || "", b.lastName || "") ||
        collator.compare(a.firstName || "", b.firstName || "") ||
        collator.compare(a.studentId || "", b.studentId || ""),
  );

const KEY = "afshs_student_sort";

// The chosen order is remembered on this device (a display preference only).
export const useStudentSort = (): [StudentSort, (m: StudentSort) => void] => {
  const [mode, setMode] = useState<StudentSort>(() => {
    try {
      return localStorage.getItem(KEY) === "index" ? "index" : "surname";
    } catch {
      return "surname";
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      /* storage unavailable */
    }
  }, [mode]);
  return [mode, setMode];
};

export const SortToggle = ({
  mode,
  onChange,
}: {
  mode: StudentSort;
  onChange: (m: StudentSort) => void;
}) => (
  <div
    className="inline-flex rounded-lg border overflow-hidden text-xs font-semibold"
    style={{ borderColor: "var(--medium-gray)" }}
    role="group"
    aria-label="Order students by"
  >
    {(
      [
        ["surname", "Surname A–Z"],
        ["index", "Index No."],
      ] as [StudentSort, string][]
    ).map(([value, label]) => (
      <button
        key={value}
        type="button"
        onClick={() => onChange(value)}
        aria-pressed={mode === value}
        className="px-2.5 py-1.5"
        style={{
          backgroundColor: mode === value ? "var(--royal-blue)" : "white",
          color: mode === value ? "white" : "var(--dark-gray)",
        }}
      >
        {label}
      </button>
    ))}
  </div>
);
