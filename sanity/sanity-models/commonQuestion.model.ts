import { TypedObject } from "sanity";

export type CommonQuestion = {
  questionThai: string;
  questionEnglish: string;
  answerThai: TypedObject[];
  answerEnglish: TypedObject[];
};
