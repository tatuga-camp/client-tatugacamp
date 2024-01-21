import { sanityClient } from "../lib/client";
import { TatugaSchoolPost } from "../sanity-models";

export type ResponseGetAllTatugaSchoolPostsSanityService = TatugaSchoolPost[];
export async function GetAllTatugaSchoolPostsSanityService(): Promise<ResponseGetAllTatugaSchoolPostsSanityService> {
  try {
    const queryTatugaSchoolPosts = `*[_type == "tatugaSchoolPosts"]{
        mainImage{
            asset->{
                    url,
                    metadata
                  }
            },
        description,
        subTitle,
        title, 
        tag,
      }`;

    const tatugaSchoolPosts = await sanityClient.fetch(queryTatugaSchoolPosts);
    return tatugaSchoolPosts;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
