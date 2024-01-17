import { Image } from "sanity";

export type Post = {
  _id: string;
  _createdAt: string;
  slug: {
    current: string;
  };
  title: string;
  mainImage: {
    asset: {
      _ref: Image;
    };
  };
  description: string;
  video: string;
  game: string;
  price: number;
  likes: number;
};
