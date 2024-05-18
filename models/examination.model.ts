export type Examination = {
  id: string;
  createAt: string;
  updateAt: string;
  timeStart?: string | null;
  timeEnd?: string | null;
  duration?: number;
  limitAttemps?: number;
  title: string;
  description?: string;
  score?: number;
  classroomId: string;
  userId: string;
};

export type Question = {
  id: string;
  createAt: string;
  updateAt: string;
  score: number;
  description: string;
  userId: string;
  examinationId: string;
  questionType: QuestionType;
};

export type FileOnQuestion = {
  id: string;
  createAt: string;
  updateAt: string;
  type: string;
  url: string;
  size: number;
  userId: string;
  questionId: string;
  examinationId: string;
};

export type Choice = {
  id: string;
  createAt: string;
  updateAt: string;
  description: string;
  isAnswer: boolean;
  fileUrl: string;
  fileType: string;
  userId: string;
  questionId: string;
  examinationId: string;
};

export type StudentOnExamination = {
  id: string;
  createAt: string;
  updateAt: string;
  firstName: string;
  lastName: string;
  number: string;
  picture: string;
  score: number;
  userId: string;
  examinationId: string;
  studentId: string;
};

export type StudentOnQuestion = {
  id: string;
  createAt: string;
  updateAt: string;
  answer: string;
  score: number;
  choiceId: string;
  questionId: string;
  examinationId: string;
  studentOnExaminationId: string;
};

export type FileOnStudentQuestion = {
  id: string;
  createAt: string;
  updateAt: string;
  type: string;
  url: string;
  size: number;
  studentOnExaminationId: string;
  studentOnQuestionId: string;
  examinationId: string;
};

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "SHORT_ANSWER"
  | "ESSAY";
