import { api } from "./client";

export interface Student {
  id?: string;
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
  [key: string]: unknown;
}

export interface BulkImportResult {
  success: boolean;
  created: number;
  skipped: number;
  total: number;
  classesCreated?: string[];
  errors: { row: number; studentId?: string; reason: string }[];
}

function toUi(s: Student): Student {
  return { ...s, id: s._id };
}

function toApi(u: Partial<Student>): Record<string, unknown> {
  const { id, _id, ...rest } = u;
  void id;
  void _id;
  return rest;
}

export const studentsApi = {
  async list(formClass?: string): Promise<Student[]> {
    const res = await api.get<{ success: boolean; students: Student[] }>(
      formClass
        ? `/api/students?formClass=${encodeURIComponent(formClass)}`
        : "/api/students",
    );
    return res.students.map(toUi);
  },

  async get(id: string): Promise<Student> {
    const res = await api.get<{ success: boolean; student: Student }>(
      `/api/students/${id}`,
    );
    return toUi(res.student);
  },

  async me(): Promise<Student> {
    const res = await api.get<{ success: boolean; student: Student }>(
      "/api/students/me",
    );
    return toUi(res.student);
  },

  async myChildren(): Promise<Student[]> {
    const res = await api.get<{ success: boolean; students: Student[] }>(
      "/api/students/my-children",
    );
    return res.students.map(toUi);
  },

  async create(payload: Partial<Student>): Promise<Student> {
    const res = await api.post<{ success: boolean; student: Student }>(
      "/api/students",
      toApi(payload),
    );
    return toUi(res.student);
  },

  async bulkCreate(
    students: Record<string, unknown>[],
  ): Promise<BulkImportResult> {
    return api.post<BulkImportResult>("/api/students/bulk", { students });
  },

  async update(id: string, payload: Partial<Student>): Promise<Student> {
    const res = await api.put<{ success: boolean; student: Student }>(
      `/api/students/${id}`,
      toApi(payload),
    );
    return toUi(res.student);
  },

  remove(id: string) {
    return api.del<{ success: boolean; message: string }>(
      `/api/students/${id}`,
    );
  },

  createLogins(ids: string[]) {
    return api.post<{
      success: boolean;
      created: {
        studentId: string;
        name: string;
        email: string;
        formClass: string;
        tempPassword: string;
      }[];
      skipped: { studentId: string; name: string; reason: string }[];
    }>("/api/students/create-logins", { ids });
  },

  bulkDelete(ids: string[]) {
    return api.post<{ success: boolean; deleted: number }>(
      "/api/students/bulk-delete",
      { ids },
    );
  },

  bulkUpdate(updates: { id: string; set: Partial<Student> }[]) {
    return api.post<{ success: boolean; updated: number }>(
      "/api/students/bulk-update",
      { updates },
    );
  },
};
