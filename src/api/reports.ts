import { api } from "./client";

export interface SubjectScore {
  subject: string;
  classScore?: number;
  examScore?: number;
  total?: number;
  grade?: string;
  remark?: string;
}

export interface Report {
  _id?: string;
  student: string | { _id: string; firstName: string; lastName: string };
  academicYear: string;
  term: string;
  formClass?: string;
  subjects?: SubjectScore[];
  totalScore?: number;
  averageScore?: number;
  position?: number;
  attendance?: number;
  teacherRemark?: string;
  headRemark?: string;
  status?: "draft" | "submitted" | "published";
}

export interface ReportQuery {
  student?: string;
  term?: string;
  academicYear?: string;
  status?: string;
}

function toQuery(q?: ReportQuery): string {
  if (!q) return "";
  const params = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v) params.append(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const reportsApi = {
  list: (q?: ReportQuery) =>
    api.get<{ success: boolean; count: number; reports: Report[] }>(
      `/api/reports${toQuery(q)}`,
    ),
  get: (id: string) =>
    api.get<{ success: boolean; report: Report }>(`/api/reports/${id}`),
  create: (payload: Partial<Report>) =>
    api.post<{ success: boolean; report: Report }>("/api/reports", payload),
  update: (id: string, payload: Partial<Report>) =>
    api.put<{ success: boolean; report: Report }>(
      `/api/reports/${id}`,
      payload,
    ),
  remove: (id: string) =>
    api.del<{ success: boolean; message: string }>(`/api/reports/${id}`),
};
