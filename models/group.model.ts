export type Group = {
  id: string;
  createAt: string;
  updateAt: string;
  title: string;
  classroomId: string;
  userId: string;
};

export type MiniGroup = {
  id: string;
  createAt: string;
  updateAt: string;
  title: string;
  points: number;
  groupId: string;
};

export type MiniGroupOnStudent = {
  id: string;
  createAt: string;
  updateAt: string;
  groupId: string;
  miniGroupId: string;
  studentId: string;
};
