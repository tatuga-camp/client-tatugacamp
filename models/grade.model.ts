export type Grade = {
  id: string;
  createAt: string;
  updateAt: string;
  userId: string;
  classroomId: string;
};

export type GradeRange = {
  createAt?: string;
  updateAt?: string;
  id?: string;
  title: string;
  gradeId?: string;
  max: number;
  min: number;
};
