export interface Subscription {
  id: string;
  name: string;
  cost: number;
  frequency: 'monthly' | 'annual';
  renewalDate: string;
  category: string;
  notes?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStats {
  totalMonthly: number;
  totalAnnual: number;
  activeSubscriptions: number;
  upcomingRenewals: Subscription[];
  categoryBreakdown: { [key: string]: number };
}

export const SUBSCRIPTION_CATEGORIES = [
  'Entretenimiento',
  'Productividad',
  'Música',
  'Video',
  'Noticias',
  'Fitness',
  'Educación',
  'Utilidades',
  'Otros'
];

export const CATEGORY_COLORS = {
  'Entretenimiento': '#FF6B6B',
  'Productividad': '#4ECDC4',
  'Música': '#45B7D1',
  'Video': '#96CEB4',
  'Noticias': '#FECA57',
  'Fitness': '#FF9FF3',
  'Educación': '#54A0FF',
  'Utilidades': '#5F27CD',
  'Otros': '#C44569'
};