import { TypedObject } from "sanity";

export type HomepagePost = {
  mainImage: {
    asset: {
      url: string;
      metadata: {
        lqip: string;
      };
    };
  };
  description: TypedObject[];
  button: string;
  title: TypedObject[];
  link: string;
  tag: string;
};
