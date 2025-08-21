export type LoginProduct = {
  icon: any;
  name: string;
};

export type RecipeTab = {
  title: string;
  recipeId: string;
};

export type LoginType = {
  cardTitle?: string;
  title: string;
  description: string;
  details: string;
  id: string;
  instructions: string;
  component: JSX.Element;
  code: string;
  tabs?: RecipeTab[];
  tabDescription?: string;
  products?: LoginProduct[];
  entryButton?: {
    text: string;
    disabled?: boolean;
    onClick?: () => void;
  };
  hidden?: true;
  preventClickthrough?: boolean;
};
