import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription, SubscriptionStats, CATEGORY_COLORS } from '@/types/subscription';

interface SubscriptionStore {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  
  // Actions
  loadSubscriptions: () => Promise<void>;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  getStats: () => SubscriptionStats;
  getUpcomingRenewals: (days?: number) => Subscription[];
  searchSubscriptions: (query: string) => Subscription[];
  filterByCategory: (category: string) => Subscription[];
}

const STORAGE_KEY = 'subscriptions';

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  loading: false,
  error: null,

  loadSubscriptions: async () => {
    set({ loading: true, error: null });
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const subscriptions = stored ? JSON.parse(stored) : [];
      set({ subscriptions, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar suscripciones', loading: false });
    }
  },

  addSubscription: async (subscriptionData) => {
    set({ loading: true, error: null });
    try {
      const newSubscription: Subscription = {
        ...subscriptionData,
        id: Date.now().toString(),
        color: CATEGORY_COLORS[subscriptionData.category] || CATEGORY_COLORS.Otros,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { subscriptions } = get();
      const updatedSubscriptions = [...subscriptions, newSubscription];
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubscriptions));
      set({ subscriptions: updatedSubscriptions, loading: false });
    } catch (error) {
      set({ error: 'Error al agregar suscripción', loading: false });
    }
  },

  updateSubscription: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { subscriptions } = get();
      const updatedSubscriptions = subscriptions.map(sub =>
        sub.id === id
          ? { ...sub, ...updates, updatedAt: new Date().toISOString() }
          : sub
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubscriptions));
      set({ subscriptions: updatedSubscriptions, loading: false });
    } catch (error) {
      set({ error: 'Error al actualizar suscripción', loading: false });
    }
  },

  deleteSubscription: async (id) => {
    set({ loading: true, error: null });
    try {
      const { subscriptions } = get();
      const updatedSubscriptions = subscriptions.filter(sub => sub.id !== id);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubscriptions));
      set({ subscriptions: updatedSubscriptions, loading: false });
    } catch (error) {
      set({ error: 'Error al eliminar suscripción', loading: false });
    }
  },

  getStats: () => {
    const { subscriptions } = get();
    
    const totalMonthly = subscriptions.reduce((sum, sub) => {
      return sum + (sub.frequency === 'monthly' ? sub.cost : sub.cost / 12);
    }, 0);

    const totalAnnual = subscriptions.reduce((sum, sub) => {
      return sum + (sub.frequency === 'annual' ? sub.cost : sub.cost * 12);
    }, 0);

    const categoryBreakdown = subscriptions.reduce((acc, sub) => {
      const monthlyCost = sub.frequency === 'monthly' ? sub.cost : sub.cost / 12;
      acc[sub.category] = (acc[sub.category] || 0) + monthlyCost;
      return acc;
    }, {} as { [key: string]: number });

    const upcomingRenewals = get().getUpcomingRenewals(7);

    return {
      totalMonthly,
      totalAnnual,
      activeSubscriptions: subscriptions.length,
      upcomingRenewals,
      categoryBreakdown,
    };
  },

  getUpcomingRenewals: (days = 7) => {
    const { subscriptions } = get();
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return subscriptions.filter(sub => {
      const renewalDate = new Date(sub.renewalDate);
      return renewalDate >= now && renewalDate <= futureDate;
    }).sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());
  },

  searchSubscriptions: (query) => {
    const { subscriptions } = get();
    const lowercaseQuery = query.toLowerCase();
    
    return subscriptions.filter(sub =>
      sub.name.toLowerCase().includes(lowercaseQuery) ||
      sub.category.toLowerCase().includes(lowercaseQuery) ||
      (sub.notes && sub.notes.toLowerCase().includes(lowercaseQuery))
    );
  },

  filterByCategory: (category) => {
    const { subscriptions } = get();
    return subscriptions.filter(sub => sub.category === category);
  },
}));