import { sanityClient } from "../lib/client";
import { Trainer } from "../sanity-models";

type ResponseGetTrainersSanityService = Trainer[];

export async function GetTrainersSanityService(): Promise<ResponseGetTrainersSanityService> {
  try {
    const query = `*[_type == "trainer"] | order(_createdAt asc){
        mainImage{
            asset->{
                    url,
                    metadata
                  }
            },
        name,
        title,
        nationality,
        description,
        feedback,
      }`;
    const trainers = await sanityClient.fetch(query);
    return trainers;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
