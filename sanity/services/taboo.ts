import { sanityClient } from "../lib/client";
import { CategoryTaboo, Taboo } from "../sanity-models";

type ResponseGetAllTabooByCategorySanityService = Taboo[];
export async function GetAllTabooByCategorySanityService({
  category,
}: {
  category: CategoryTaboo;
}): Promise<ResponseGetAllTabooByCategorySanityService> {
  try {
    const queryTaboo = `*[_type=="taboo" && references(*[_type=="categoryTaboo" && title == "${category}"]._id)]{
        firstTaboo,
        secondTaboo,
        thirdTaboo,
        vocabulary,
        mainImage{
          asset->{
                  url,
                  metadata
                }
          },
        category ->{
        title
        },
      }`;
    const taboo = await sanityClient.fetch(queryTaboo);
    return taboo;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
