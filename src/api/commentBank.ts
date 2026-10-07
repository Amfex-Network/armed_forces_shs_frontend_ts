import { api } from "./client";
import { createResource, type HasId } from "./crud";

export type BankCategory = "subjectTeacher" | "formTeacher" | "headmaster";
export type BankLevel = "excellent" | "good" | "average" | "needsImprovement";

export interface BankComment extends HasId {
  category: BankCategory;
  performance: BankLevel;
  text: string;
  tags: string[];
  favourite: boolean;
}

export const commentBankApi = {
  ...createResource<BankComment>("/api/comment-templates"),
  bulkCreate(items: Omit<BankComment, "id" | "_id">[]) {
    return api.post<{ success: boolean; count: number }>(
      "/api/comment-templates/bulk",
      { items },
    );
  },
};
