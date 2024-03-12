import { sanityClient } from "../lib/client";
import { WhatWeGotCard } from "../sanity-models";

export type ResponseGetAllWhatWeGotCardsSanityService = WhatWeGotCard[];
export async function GetAllWhatWeGotCardsSanityService(): Promise<ResponseGetAllWhatWeGotCardsSanityService> {
  try {
    const querywhatWeGotCards = `*[_type == "whatWeGotCards"]{
        mainImage{
            asset->{
                    url,
                    metadata
                  }
            },
        description,
    
        title,
      }`;
    const whatWeGotCards = await sanityClient.fetch(querywhatWeGotCards);
    return whatWeGotCards;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
