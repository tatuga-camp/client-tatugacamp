export type Attendance = {
  id: string;
  createAt: string;
  updateAt: string;
  date: string;
  endDate: string | null;
  absent: boolean;
  present: boolean;
  holiday: boolean;
  sick: boolean;
  late: boolean;
  warn: boolean;
  note: string | null;
  groupId: string;
  userId: string;
  studentId: string;
  classroomId: string;
};

export type HeadAttendance = {
  id: string;
  createAt: string;
  updateAt: string;
  groupId: string;
  note: string;
};

export type QrCodeAttendance = {
  id: string;
  createAt: string;
  updateAt: string;
  date: string;
  endDate: string;
  expireAt: string;
  isLimitOneBrowser: boolean;
  classroomId: string;
  headAttendanceId: string;
};
