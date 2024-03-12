import { sanityClient } from "../lib/client";
import { AboutUsInformation } from "../sanity-models";

type ResponseGetAboutUsInformationSanityService = AboutUsInformation[];

export async function GetAboutUsInformationSanityService(): Promise<ResponseGetAboutUsInformationSanityService> {
  try {
    const query = `*[_type == "about-us-information"]{
        mainImage{
            asset->{
                    url,
                    metadata
                  }
            },
        title,
        subtitle,
        description,
        link,
      }`;
    const aboutus = await sanityClient.fetch(query);
    return aboutus;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
