const EXTERNAL_DATA_URL = "https://tatugacamp.com/activity";
import { GetServerSidePropsContext } from "next";
import { sanityClient } from "../sanity/lib/client";
function generateSiteMap(posts: any) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://tatugacamp.com</loc>
     </url>
      <url>
    <loc>https://www.tatugaschool.com</loc>
        <lastmod>2025-02-19</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
    <loc>https://tatugaschool.com</loc>
    <lastmod>2025-02-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://app.tatugaschool.com/auth/sign-in</loc>
    <lastmod>2025-02-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://student.tatugaschool.com/welcome</loc>
    <lastmod>2025-02-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
     <url>
     <loc>https://tatugacamp.com/classroom</loc>
    </url>
    <url>
    <loc>https://tatugacamp.com/school</loc>
    </url>
     <url>
       <loc>https://tatugacamp.com/about-us</loc>
     </url>
     ${posts
       .map(({ slug }: { slug: any }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/${slug.current}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({
  context,
}: {
  context: GetServerSidePropsContext;
}) {
  const query = `*[_type == "post"]{
    slug
  }`;
  // We make an API call to gather the URLs for our site
  const posts = await sanityClient.fetch(query);

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts);

  context.res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  context.res.write(sitemap);
  context.res.end();

  return {
    props: {},
  };
}

export default SiteMap;
