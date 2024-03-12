import { sanityClient } from "../lib/client";
import { Member } from "../sanity-models";

type ResponseGetMembersSanityService = Member[];

export async function GetMembersSanityService(): Promise<ResponseGetMembersSanityService> {
  try {
    const query = `*[_type == "members"]{
        mainImage{
            asset->{
                    url,
                    metadata
                  }
            },
        secondImage{
            asset->{
                    url,
                    metadata
                  }
            },
        name,
          position,
          quote,
      }`;
    const members = await sanityClient.fetch(query);
    return members;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
