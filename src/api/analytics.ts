import { api } from "./client";

export type AnalyticsView = "school" | "teaching" | "form" | "department";

export interface Measures {
  entries: number;
  average: number;
  passRate: number;
  highest: number;
  lowest: number;
}

export interface StudentRow {
  studentId: string;
  name: string;
  className: string;
  subjects: number;
  total: number;
  average: number;
  belowCredit: number;
}

export interface AnalyticsReport {
  term: string;
  academicYear: string;
  summary: Measures & { students: number; studentsWithScores: number };
  gradeDistribution: { grade: string; count: number }[];
  subjects: (Measures & { subject: string })[];
  classes: (Measures & {
    className: string;
    students: number;
    withScores: number;
  })[];
  classSubjects: (Measures & {
    className: string;
    subject: string;
    students: number;
  })[];
  topStudents: StudentRow[];
  needsSupport: StudentRow[];
  attendance: {
    records: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    rate: number;
    byClass: { className: string; records: number; rate: number }[];
  };
}

export interface AnalyticsQuery {
  view?: AnalyticsView;
  term?: string;
  academicYear?: string;
  className?: string;
}

export const VIEW_LABELS: Record<AnalyticsView, string> = {
  school: "Whole School",
  teaching: "My Subjects",
  form: "My Form Class",
  department: "My Department",
};

export const analyticsApi = {
  async get(query: AnalyticsQuery) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => v && params.append(k, v));
    const qs = params.toString();
    return api.get<{
      success: boolean;
      view?: AnalyticsView;
      views: AnalyticsView[];
      report: AnalyticsReport | null;
    }>(`/api/analytics${qs ? `?${qs}` : ""}`);
  },
};
