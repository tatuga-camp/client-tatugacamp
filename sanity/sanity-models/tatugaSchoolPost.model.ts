import { TypedObject } from "sanity";

export type TatugaSchoolPost = {
  mainImage: {
    asset: {
      url: string;
      metadata: {
        lqip: string;
      };
    };
  };
  description: TypedObject[];
  subTitle: string;
  title: string;
  tag: string;
};
