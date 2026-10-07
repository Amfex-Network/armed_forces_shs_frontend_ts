// The four staff roles the school uses. Every teacher teaches subjects;
// HOD and Form Teacher duties are added on top, and a teacher with several
// duties sees all of their tools at once (nothing is chosen at sign-in).
export const TEACHER_ROLES = [
  "Subject Teacher",
  "Subject Teacher + HOD",
  "Subject Teacher + Form Teacher",
  "Subject Teacher + HOD + Form Teacher",
] as const;

// Same rules as the API (backend utils/teacherScope.ts).
export const isHod = (role?: string) =>
  !!role && /\bhod\b/i.test(role) && !/assistant/i.test(role);

export const isFormTeacher = (role?: string) =>
  !!role && /form\s*(teacher|master)/i.test(role);

// Maps older role labels (e.g. "HOD", "Form Teacher + HOD") onto the four.
export const normalizeTeacherRole = (role?: string): string => {
  const hod = isHod(role);
  const form = isFormTeacher(role);
  if (hod && form) return TEACHER_ROLES[3];
  if (hod) return TEACHER_ROLES[1];
  if (form) return TEACHER_ROLES[2];
  return TEACHER_ROLES[0];
};
