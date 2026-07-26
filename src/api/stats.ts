import { api } from "./client";

export interface Overview {
  students: number;
  teachers: number;
  parents: number;
  admins: number;
  reports: number;
  byCourse: { course: string; count: number }[];
}

export const statsApi = {
  async overview(): Promise<Overview> {
    const res = await api.get<{ success: boolean; stats: Overview }>(
      "/api/stats/overview",
    );
    return res.stats;
  },
};
