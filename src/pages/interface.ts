export interface MenuMeta {
  path: string;
  label: string;
  description: string;
  cover: React.ReactNode;
  component: React.ComponentType;
}

export interface MenuGroup {
  path: string;
  label: string;
  icon: React.ReactNode;
  children: MenuMeta[];
}