import { useEffect, useState } from "react";
import {
  classesApi,
  subjectsApi,
  departmentsApi,
  type Department,
} from "../api/domains";

export interface SchoolLists {
  classes: string[];
  subjects: string[];
  departments: string[];
  courses: string[];
  loaded: boolean;
}

const byName = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true });

// Used only until a department lists its courses.
export const DEFAULT_COURSES = [
  "General Science",
  "General Arts",
  "Business",
  "Technical",
];

// Courses are defined per department (Structure - Part 2). The department
// record keeps them in its `subjects` field for backwards compatibility.
export const coursesFromDepartments = (deps: Department[]): string[] => {
  const seen = new Map<string, string>();
  deps.forEach((d) =>
    (d.subjects || []).forEach((c) => {
      const name = String(c || "").trim();
      if (name && !seen.has(name.toLowerCase())) {
        seen.set(name.toLowerCase(), name);
      }
    }),
  );
  const list = [...seen.values()].sort(byName);
  return list.length ? list : DEFAULT_COURSES;
};

// Keeps a stored value selectable even if it is no longer in the list.
export const withCurrent = (options: string[], current?: string) =>
  current && !options.includes(current) ? [current, ...options] : options;

// Live class, subject, department and course names, so forms offer real
// choices instead of free text that may not match the database.
export const useSchoolLists = (): SchoolLists => {
  const [lists, setLists] = useState<SchoolLists>({
    classes: [],
    subjects: [],
    departments: [],
    courses: DEFAULT_COURSES,
    loaded: false,
  });

  useEffect(() => {
    let alive = true;
    Promise.all([
      classesApi.list().catch(() => []),
      subjectsApi.list().catch(() => []),
      departmentsApi.list().catch(() => []),
    ]).then(([cls, subs, deps]) => {
      if (!alive) return;
      setLists({
        classes: cls.map((c) => c.name).sort(byName),
        subjects: subs.map((s) => s.name).sort(byName),
        departments: deps.map((d) => d.name).sort(byName),
        courses: coursesFromDepartments(deps),
        loaded: true,
      });
    });
    return () => {
      alive = false;
    };
  }, []);

  return lists;
};
