import { api } from "./client";

export interface GradeBand {
  grade: string;
  minScore: number;
  label: string;
  points: number;
}

export interface AppSettings {
  schoolName: string;
  shortName?: string;
  motto?: string;
  schoolType?: string;
  waecCode?: string;
  region?: string;
  district?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  currentAcademicYear: string;
  currentTerm: string;
  academicYears: string[];
  terms: string[];
  gradingScale: GradeBand[];
  positionBasis?: PositionBasis;
  portalAccess?: { teacher: boolean; student: boolean; parent: boolean };
  selfUpdate?: { student: boolean; parent: boolean };
  reportTemplate?: Partial<ReportTemplate>;
}

export type PositionBasis = "total" | "average" | "aggregate";

export interface ReportTemplate {
  title: string;
  headTitle: string;
  showPosition: boolean;
  showAggregate: boolean;
  showAverage: boolean;
  showAttendance: boolean;
  showConduct: boolean;
  showFormTeacherRemarks: boolean;
  showHeadRemarks: boolean;
  showSignatures: boolean;
  nextTermBegins: string;
  footerNote: string;
}

export const REPORT_TEMPLATE_DEFAULTS: ReportTemplate = {
  title: "Terminal Report",
  headTitle: "Head of School",
  showPosition: true,
  showAggregate: true,
  showAverage: true,
  showAttendance: true,
  showConduct: true,
  showFormTeacherRemarks: true,
  showHeadRemarks: true,
  showSignatures: true,
  nextTermBegins: "",
  footerNote: "",
};

export const reportOptions = (s: AppSettings): ReportTemplate => ({
  ...REPORT_TEMPLATE_DEFAULTS,
  ...(s.reportTemplate || {}),
});

export const settingsApi = {
  async get(): Promise<AppSettings> {
    const res = await api.get<{ success: boolean; settings: AppSettings }>(
      "/api/settings",
    );
    return res.settings;
  },
  async update(payload: Partial<AppSettings>): Promise<AppSettings> {
    const res = await api.put<{ success: boolean; settings: AppSettings }>(
      "/api/settings",
      payload,
    );
    return res.settings;
  },
};
