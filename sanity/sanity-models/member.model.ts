export type Member = {
  quote: string;
  mainImage: {
    asset: {
      url: string;
      metadata: {
        lqip: string;
      };
    };
  };
  secondImage: {
    asset: {
      url: string;
      metadata: {
        lqip: string;
      };
    };
  };
  name: string;
  position: string;
};
