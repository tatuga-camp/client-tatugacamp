import { GetServerSideProps } from "next";
import { sanityClient } from "../sanity/lib/client";

const SITE = "https://tatugacamp.com";
const STATIC_PATHS = [
  "",
  "/about-us",
  "/become-a-trainer",
  "/games/taboo",
  "/teacher-tools/timer",
];

function generateSiteMap(activitySlugs: string[], lastmod: string) {
  const staticUrls = STATIC_PATHS.map(
    (p) => `  <url>
    <loc>${SITE}${p}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p === "" ? "1.0" : "0.7"}</priority>
  </url>`,
  ).join("\n");
  const activityUrls = activitySlugs
    .map(
      (slug) => `  <url>
    <loc>${SITE}/activity/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${activityUrls}
</urlset>`;
}

function SiteMap() {}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const posts: { slug: { current: string } }[] = await sanityClient.fetch(
      `*[_type == "post"]{ slug }`,
    );
    const slugs = posts.map((p) => p.slug.current);
    const lastmod = new Date().toISOString().slice(0, 10);
    ctx.res.setHeader("Content-Type", "text/xml");
    ctx.res.write(generateSiteMap(slugs, lastmod));
    ctx.res.end();
    return { props: {} };
  } catch (error) {
    console.log(error);
    return { props: {} };
  }
};

export default SiteMap;
