import Head from "next/head";
import { useRouter } from "next/router";

const SITE = "https://tatugacamp.com";

export default function SEOHead() {
  const router = useRouter();
  const path = router.asPath.split("?")[0].split("#")[0];
  const canonical = `${SITE}${path === "/" ? "" : path}`;
  return (
    <Head>
      <link rel="canonical" href={canonical} />
    </Head>
  );
}
