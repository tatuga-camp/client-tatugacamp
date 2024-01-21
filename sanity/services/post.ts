import { Image } from "sanity";
import { sanityClient } from "../lib/client";
import { Post } from "../sanity-models";

export type ResponseGetAllPostsSanityService = Post[];

export async function GetAllPostsSanityService(): Promise<ResponseGetAllPostsSanityService> {
  try {
    const query = `*[_type == "post"]{
          _id,
          _createdAt,
          slug,
          title,
          mainImage,
          description,
          video,
          game,
          price,
          likes,
        }`;

    const posts = await sanityClient.fetch(query);

    // Explicit return statement for the successful case
    return posts;
  } catch (error) {
    // Reject the promise in case of an error
    console.error(error);
    throw error;
  }
}
