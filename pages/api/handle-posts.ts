import { NextApiRequest, NextApiResponse } from "next";
import { GetAllPostsSanityService } from "../../sanity/services";

export default async function handlePosts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const index = req.body.index;
  let posts;
  if (index === 0) {
    posts = await GetAllPostsSanityService();
  }
  res.status(200).json({ posts } || null);
}
