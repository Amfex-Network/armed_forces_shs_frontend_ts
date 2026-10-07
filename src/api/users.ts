import { api } from "./client";
import type { Role } from "./auth";

export interface ManagedUser {
  id?: string;
  role: Role;
  title?: string;
  firstName: string;
  lastName: string;
  othernames?: string;
  email: string;
  phone?: string;
  status?: string;
  joinDate?: string;
  staffId?: string;
  studentId?: string;
  department?: string;
  teacherRole?: string;
  formClass?: string;
  course?: string;
  assignedClasses?: string[];
  assignedSubjects?: string[];
  formClasses?: string[];
  [key: string]: unknown;
}

interface ApiUser {
  _id: string;
  role: Role;
  title?: string;
  firstname: string;
  lastname: string;
  othernames?: string;
  email: string;
  phone?: string;
  active?: boolean;
  date?: string;
  staffId?: string;
  studentId?: string;
  department?: string;
  teacherRole?: string;
  formClass?: string;
  course?: string;
  assignedClasses?: string[];
  assignedSubjects?: string[];
  formClasses?: string[];
}

function toUi(u: ApiUser): ManagedUser {
  return {
    id: u._id,
    role: u.role,
    title: u.title || "",
    firstName: u.firstname,
    lastName: u.lastname,
    othernames: u.othernames || "",
    email: u.email,
    phone: u.phone || "",
    status: u.active === false ? "Inactive" : "Active",
    joinDate: u.date ? u.date.split("T")[0] : "",
    staffId: u.staffId || "",
    studentId: u.studentId || "",
    department: u.department || "",
    teacherRole: u.teacherRole || "",
    formClass: u.formClass || "",
    course: u.course || "",
    assignedClasses: u.assignedClasses || [],
    assignedSubjects: u.assignedSubjects || [],
    formClasses:
      u.formClasses && u.formClasses.length
        ? u.formClasses
        : u.role === "teacher" && u.formClass
          ? [u.formClass]
          : [],
  };
}

function toApi(u: Partial<ManagedUser>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  const map: Record<string, string> = {
    firstName: "firstname",
    lastName: "lastname",
    othernames: "othernames",
    email: "email",
    phone: "phone",
    role: "role",
    title: "title",
    staffId: "staffId",
    studentId: "studentId",
    department: "department",
    teacherRole: "teacherRole",
    formClass: "formClass",
    course: "course",
  };
  for (const [uiKey, apiKey] of Object.entries(map)) {
    const value = u[uiKey as keyof ManagedUser];
    if (value !== undefined && value !== null) body[apiKey] = value;
  }
  if (Array.isArray(u.assignedClasses))
    body.assignedClasses = u.assignedClasses;
  if (Array.isArray(u.assignedSubjects))
    body.assignedSubjects = u.assignedSubjects;
  if (Array.isArray(u.formClasses)) body.formClasses = u.formClasses;
  for (const key of ["year", "house", "track", "gender"]) {
    if (typeof u[key] === "string" && u[key]) body[key] = u[key];
  }
  if (u.status !== undefined) body.active = u.status === "Active";
  return body;
}

export const usersApi = {
  async list(): Promise<ManagedUser[]> {
    const res = await api.get<{ success: boolean; users: ApiUser[] }>(
      "/api/users",
    );
    return res.users.map(toUi);
  },

  async create(
    user: Partial<ManagedUser>,
  ): Promise<{ user: ManagedUser; tempPassword: string }> {
    const res = await api.post<{
      success: boolean;
      user: ApiUser;
      tempPassword: string;
    }>("/api/users", toApi(user));
    return { user: toUi(res.user), tempPassword: res.tempPassword };
  },

  async update(id: string, user: Partial<ManagedUser>): Promise<ManagedUser> {
    const res = await api.put<{ success: boolean; user: ApiUser }>(
      `/api/users/${id}`,
      toApi(user),
    );
    return toUi(res.user);
  },

  remove(id: string) {
    return api.del<{ success: boolean; message: string }>(`/api/users/${id}`);
  },

  bulkCreate(role: "teacher" | "parent", users: Record<string, unknown>[]) {
    return api.post<{
      success: boolean;
      created: {
        row: number;
        name: string;
        email: string;
        role: string;
        staffId: string;
        children: string;
        tempPassword: string;
        warnings: string[];
      }[];
      skipped: { row: number; email?: string; reason: string }[];
    }>("/api/users/bulk", { role, users });
  },

  async resetPassword(id: string): Promise<string> {
    const res = await api.post<{ success: boolean; tempPassword: string }>(
      `/api/users/${id}/reset-password`,
    );
    return res.tempPassword;
  },
};
