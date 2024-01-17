import { Score } from "./score.model";

export type Student = {
  id: string;
  createAt: string;
  updateAt: string;
  firstName: string;
  lastName: string;
  number: string;
  picture: string;
  nationality: string | null;
  password: string;
  resetPassword: boolean;
  isDelete: boolean;
  classroomId: string;
  userId: string;
  studentClassId: string | null;
};

export type StudentWork = {
  id: string;
  createAt: string;
  updateAt: string;
  picture: string | null;
  body: string;
  comment: string | null;
  isSummited: boolean;
  score: number;
  studentOnAssignmentId: string;
};
