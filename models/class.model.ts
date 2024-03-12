export type StudentClass = {
  id: string;
  createAt: Date;
  updateAt: Date;
  level: string;
  class: string;
  year: Date;
  term: string;
  levelOrder: number;
  classOrder: number;
  isDelete: boolean;
  isAchieve: boolean;
  schoolUserId: string;
};
