import { Image } from "sanity";

export type Taboo = {
  firstTaboo: string;
  secondTaboo: string;
  thirdTaboo: string;
  vocabulary: string;
  mainImage: {
    asset: {
      url: string;
      metadata: {
        lqip: string;
      };
    };
  };
  category: {
    title: CategoryTaboo;
  };
};

export type CategoryTaboo = "animal" | "job" | "country" | "sport";
