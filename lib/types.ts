export type LoginProduct = {
  icon: any;
  name: string;
};

export type LoginType = {
  title: string;
  details: string;
  id: string;
  component: JSX.Element;
  products: LoginProduct[];
};
