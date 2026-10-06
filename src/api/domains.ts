import { api } from "./client";
import { createResource, type HasId } from "./crud";

export interface Department extends HasId {
  name: string;
  code?: string;
  color?: string;
  bg?: string;
  hodId?: string | number | "";
  subjects?: string[];
}

export interface Subject extends HasId {
  name: string;
  code: string;
  type?: "core" | "elective";
  department?: string;
  courses?: string[];
  periodsPerWeek?: number;
  active?: boolean;
}

export interface SchoolClass extends HasId {
  name: string;
  yearGroup?: string;
  course?: string;
  capacity?: number;
  formTeacher?: string;
  enrolled?: number;
}

export const departmentsApi = createResource<Department>("/api/departments");
export const subjectsApi = createResource<Subject>("/api/subjects");
export interface ClassCoverage {
  missing: { name: string; count: number }[];
  unassigned: number;
}

export const classesApi = {
  ...createResource<SchoolClass>("/api/classes"),
  async coverage(): Promise<ClassCoverage> {
    const res = await api.get<{ success: boolean } & ClassCoverage>(
      "/api/classes/coverage",
    );
    return { missing: res.missing, unassigned: res.unassigned };
  },
  syncFromStudents() {
    return api.post<{
      success: boolean;
      created: string[];
      normalized: number;
    }>("/api/classes/sync-from-students");
  },
};
