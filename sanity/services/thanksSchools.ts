import { sanityClient } from "../lib/client";
import { ThanksSchool } from "../sanity-models";
export type ResponseGetAllThanksSchoolsSanityService = ThanksSchool[];
export async function GetAllThanksSchoolsSanityService(): Promise<ResponseGetAllThanksSchoolsSanityService> {
  try {
    const querythanksSchools = `*[_type == "thanksSchools"]{
        mainImage{
            asset->{
                    url,
                    metadata
                  }
            },
        title,
      }`;

    const thanksSchools = await sanityClient.fetch(querythanksSchools);
    return thanksSchools;
  } catch (error) {
    console.log(error);
    throw Error;
  }
}
