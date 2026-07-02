export type Trainer = {
  name: string;
  title: string;
  nationality: string;
  description: string;
  feedback: string;
  mainImage: {
    asset: {
      url: string;
      metadata: {
        lqip: string;
      };
    };
  };
};
