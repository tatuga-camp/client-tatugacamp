export type ServiceCard = {
  mainImage: {
    asset: {
      url: string;
      metadata: {
        lqip: string;
      };
    };
  };
  description: string;
  button: string;
  title: string;
};
