import { sanityClient } from "../lib/client";
import { Activity } from "../sanity-models";

type ResponseGetActivitySanityService = Activity[];
type RequestGetActivitySanityService = {
  cardActivityId: string;
};
export async function GetActivitySanityService(
  input: RequestGetActivitySanityService
): Promise<ResponseGetActivitySanityService> {
  try {
    const query = `*[slug.current == "${input.cardActivityId}"]{
        ...,
        mainImage{
                     asset->{
                             url,
                             metadata
                           }
                     },
    }`;
    const activity = await sanityClient.fetch(query);
    return activity;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
