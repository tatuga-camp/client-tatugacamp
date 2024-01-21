import { sanityClient } from "../lib/client";
import { HomepagePost } from "../sanity-models";

export type ResponseGetAllHomepagePostsSanityService = HomepagePost[];
export async function GetAllHomepagePostsSanityService(): Promise<ResponseGetAllHomepagePostsSanityService> {
  try {
    const queryhomepagePosts = `*[_type == "homepagePosts"]{
            mainImage{
                asset->{
                        url,
                        metadata
                      }
                },
            description,
            button,
            title,
            link,
            tag,
          }`;
    const homepagePosts = await sanityClient.fetch(queryhomepagePosts);
    return homepagePosts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
