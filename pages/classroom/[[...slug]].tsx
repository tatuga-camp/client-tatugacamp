import { GetServerSideProps } from "next";
import Gone from "../410";

// Netlify's redirect engine cannot emit 410 (only 200/301/302/404),
// so the 410 status for retired classroom pages is served from here.
// The exact /classroom path 301s to tatugaschool.com at the Netlify edge;
// the redirect below covers local dev where netlify.toml is not applied.
export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug;
  if (!slug || slug.length === 0) {
    return {
      redirect: {
        destination: "https://tatugaschool.com/",
        permanent: true,
      },
    };
  }
  context.res.statusCode = 410;
  return { props: {} };
};

export default Gone;
