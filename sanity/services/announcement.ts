import { sanityClient } from "../lib/client";
import { Announcement } from "../sanity-models";

export type ResponseGetAllAnnouncementSanityService = Announcement;
export async function GetAllAnnouncementSanityService(): Promise<ResponseGetAllAnnouncementSanityService> {
  try {
    const announcementQuery = `*[_type == "announcement"][0]`;
    const announcements = await sanityClient.fetch(announcementQuery);
    return announcements;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
