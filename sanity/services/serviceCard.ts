import { sanityClient } from "../lib/client";
import { ServiceCard } from "../sanity-models";

export type ResponseGetAllserviceCardSanityService = ServiceCard[];
export async function GetAllserviceCardSanityService(): Promise<ResponseGetAllserviceCardSanityService> {
  try {
    const queryServiceCard = `*[_type == "serviceCard"]{
        mainImage{
            asset->{
                    url,
                    metadata
                  }
            },
        description,
        button,
        title,
      }`;
    const serviceCard = await sanityClient.fetch(queryServiceCard);
    return serviceCard;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
