export type Assignment = {
  id: string;
  createAt: string;
  updateAt: string;
  title: string;
  picture: string | null;
  deadline: string;
  maxScore: number;
  percentage: number | null;
  isDelete: boolean;
  classroomId: string;
  userId: string;
};
