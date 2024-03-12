import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";
export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  apiVersion: "2021-08-31",
};
export const sanityClient = createClient(config);
export const urlForImage = (source: any) =>
  createImageUrlBuilder(config).image(source);
