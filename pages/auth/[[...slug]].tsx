import { GetServerSideProps } from "next";

// Auth moved to Tatuga School. The Netlify edge 301s /auth and /auth/*
// (see netlify.toml); this page covers local dev and any request that
// reaches the Next.js server directly.
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "https://tatugaschool.com/",
      permanent: true,
    },
  };
};

export default function AuthRedirect() {
  return null;
}
