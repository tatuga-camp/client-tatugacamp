import { sanityClient } from "../lib/client";
import { CommonQuestion } from "../sanity-models";

export type ResponseGetAllCommonQuestiontsSanityService = CommonQuestion[];
export async function GetAllCommonQuestiontsSanityService(): Promise<ResponseGetAllCommonQuestiontsSanityService> {
  try {
    const commentQuery = `*[_type == "commonQuestions"]`;
    const commonQuestions = await sanityClient.fetch(commentQuery);
    return commonQuestions;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
