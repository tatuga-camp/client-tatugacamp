export type Score = {
  id: string;
  points: number;
  studentId: string;
  scoreId: string;
};

export type ScoreTitle = {
  id: string;
  createAt: string;
  updateAt: string;
  picture: string; // Assuming the picture will always be a string (emoji or URL)
  title: string;
  display: boolean;
  classroomId: string;
  score: number;
};
