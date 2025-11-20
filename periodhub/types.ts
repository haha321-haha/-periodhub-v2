export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: 'PRO' | 'NEW' | 'HOT' | 'BETA';
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
  href: string;
  type: 'zone' | 'card';
}

export interface NavItem {
  label: string;
  href: string;
  children?: Tool[]; // For dropdowns
}