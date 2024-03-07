import { TypedObject } from "sanity";

export type Activity = {
  title: string;
  video?: string;
  game?: string;
  slug: {
    current: string;
  };
  author: {
    _ref: string;
    _type: string;
  };
  description: string;
  materialDetail: TypedObject[];
  LongDescription: string;
  body: TypedObject[];
  _id: string;
  categories: {
    _ref: string;
    _type: string;
    _key: string;
  };
  time: string;
  _updatedAt: string;
  likes: number;
  _rev: string;
  mainImage: {
    asset: {
      url: string;
      metadata: {
        lqip: string;
      };
    };
  };
  material: string;
  age: string;
  ReflectionTipsStrategies: TypedObject[];
  people: string;
};
