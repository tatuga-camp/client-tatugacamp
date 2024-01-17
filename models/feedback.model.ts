export type Feedback = {
  id: string;
  createAt: Date;
  updateAt: Date;
  body: string;
  picture?: string | null;
  tag: string;
  userId?: string | null;
};
