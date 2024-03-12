import { Student, User } from ".";

export type Comment = {
  id: string;
  createAt: string;
  updateAt: string;
  body: string;
  studentOnAssignmentId: string;
  user?: User;
  student?: Student;
};
