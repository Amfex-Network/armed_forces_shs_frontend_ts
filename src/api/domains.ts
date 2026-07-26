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
export const classesApi = createResource<SchoolClass>("/api/classes");
