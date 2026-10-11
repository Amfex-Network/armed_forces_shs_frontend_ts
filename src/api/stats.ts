import { api } from "./client";

export interface Overview {
  students: number;
  teachers: number;
  parents: number;
  admins: number;
  reports: number;
  byCourse: { course: string; count: number }[];
  byGrade?: { grade: string; count: number }[];
  totalScores?: number;
  passRate?: number;
  term?: string;
  academicYear?: string;
  byTransition?: { name: string; count: number }[];
  attendanceByYear?: { year: string; present: number; absent: number }[];
  termTrend?: { term: string; avg: number }[];
  recentActivity?: { text: string; status: string; date: string }[];
}

export const statsApi = {
  async overview(): Promise<Overview> {
    const res = await api.get<{ success: boolean; stats: Overview }>(
      "/api/stats/overview",
    );
    return res.stats;
  },
};
