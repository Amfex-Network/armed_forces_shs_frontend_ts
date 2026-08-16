import { api } from "./client";

export interface ResultSubject {
  name: string;
  ca: number;
  exam: number;
  total: number;
  grade: string;
  remarks: string;
}

export interface ReportResult {
  student: {
    id: string;
    studentId?: string;
    firstName?: string;
    lastName?: string;
    formClass?: string;
    course?: string;
  };
  term: string;
  academicYear: string;
  formClass?: string;
  published?: boolean;
  position: number;
  outOf: number;
  totalScore: number;
  totalMax: number;
  aggregate: number;
  subjects: ResultSubject[];
  attendance: {
    present: number;
    absent: number;
    late: number;
    totalDays: number;
    rate: number;
  };
  comments?: {
    formTeacher: string;
    head: string;
    conduct: string;
    interest: string;
    attitude: string;
  };
}

export interface ResultsQuery {
  student?: string;
  term?: string;
  academicYear?: string;
}

function toQuery(q?: ResultsQuery): string {
  if (!q) return "";
  const params = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v) params.append(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const resultsApi = {
  async get(query?: ResultsQuery): Promise<ReportResult> {
    const res = await api.get<{ success: boolean; result: ReportResult }>(
      `/api/results${toQuery(query)}`,
    );
    return res.result;
  },
};
