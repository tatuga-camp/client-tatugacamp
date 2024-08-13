export type Assignment = {
  id: string;
  createAt: string;
  updateAt: string;
  title: string;
  picture: string | null;
  deadline: string;
  order: number;
  maxScore: number;
  percentage: number | null;
  isDelete: boolean;
  classroomId: string;
  description: string;
  userId: string;
};

export type FileOnAssignment = {
  id: string;
  createAt: string;
  updateAt: string;
  name: string;
  file: string;
  type: string;
  assignmentId: string;
};
