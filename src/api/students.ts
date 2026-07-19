import { api } from "./client";

export interface Student {
  _id?: string;
  studentId: string;
  firstName: string;
  lastName: string;
  gender?: string;
  dob?: string;
  course?: string;
  year?: string;
  formClass?: string;
  yearGroup?: string;
  house?: string;
  status?: string;
  attendance?: number;
  avgScore?: number;
  parentId?: string | null;
  address?: string;
  email?: string;
  enrollDate?: string;
}

export const studentsApi = {
  list: () =>
    api.get<{ success: boolean; count: number; students: Student[] }>(
      "/api/students",
    ),
  get: (id: string) =>
    api.get<{ success: boolean; student: Student }>(`/api/students/${id}`),
  create: (payload: Partial<Student>) =>
    api.post<{ success: boolean; student: Student }>("/api/students", payload),
  update: (id: string, payload: Partial<Student>) =>
    api.put<{ success: boolean; student: Student }>(
      `/api/students/${id}`,
      payload,
    ),
  remove: (id: string) =>
    api.del<{ success: boolean; message: string }>(`/api/students/${id}`),
};
