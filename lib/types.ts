export type LoginProduct = {
  icon: any;
  name: string;
};

export type LoginType = {
  title: string;
  description: string;
  details: string;
  entryButtonText?: string;
  id: string;
  instructions: string;
  component: JSX.Element;
  code: string;
  products?: LoginProduct[];
};
