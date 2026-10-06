import { useEffect, useState } from "react";
import { classesApi, subjectsApi, departmentsApi } from "../api/domains";

export interface SchoolLists {
  classes: string[];
  subjects: string[];
  departments: string[];
  loaded: boolean;
}

const byName = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true });

// Live class, subject and department names, so forms offer real choices
// instead of free text that may not match anything in the database.
export const useSchoolLists = (): SchoolLists => {
  const [lists, setLists] = useState<SchoolLists>({
    classes: [],
    subjects: [],
    departments: [],
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
        loaded: true,
      });
    });
    return () => {
      alive = false;
    };
  }, []);

  return lists;
};
