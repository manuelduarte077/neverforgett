import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription, SubscriptionStats, CATEGORY_COLORS } from '@/types/subscription';
import { NotificationService } from '@/services/NotificationService';
import { router } from 'expo-router';
import { STORAGE_KEYS } from '@/constants/app';

interface ReminderData {
  enabled: boolean;
  daysInAdvance: number;
  time: Date;
}

interface SubscriptionStore {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;

  // Actions
  loadSubscriptions: () => Promise<void>;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<void>;
  setSubscriptionReminder: (id: string, reminderData: ReminderData | undefined) => Promise<boolean>;
  deleteSubscription: (id: string) => Promise<void>;
  getStats: () => SubscriptionStats;
  getUpcomingRenewals: (days?: number) => Subscription[];
  searchSubscriptions: (query: string) => Subscription[];
  filterByCategory: (category: string) => Subscription[];
}



export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  loading: false,
  error: null,

  loadSubscriptions: async () => {
    set({ loading: true, error: null });
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
      let subscriptions = stored ? JSON.parse(stored) : [];
      
      // Migrar suscripciones existentes para agregar el campo icon
      const migratedSubscriptions = subscriptions.map((sub: any) => ({
        ...sub,
        icon: sub.icon || 'creditcard'
      }));
      
      // Si hubo cambios, guardar las suscripciones migradas
      if (JSON.stringify(subscriptions) !== JSON.stringify(migratedSubscriptions)) {
        await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(migratedSubscriptions));
        subscriptions = migratedSubscriptions;
      }
      
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
        color: CATEGORY_COLORS[subscriptionData.category] ?? CATEGORY_COLORS.Otros ?? '#C44569',
        icon: subscriptionData.icon || 'creditcard',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { subscriptions } = get();
      const updatedSubscriptions = [...subscriptions, newSubscription];

      await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updatedSubscriptions));
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

      await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updatedSubscriptions));
      set({ subscriptions: updatedSubscriptions, loading: false });
    } catch (error) {
      set({ error: 'Error al actualizar suscripción', loading: false });
    }
  },
  
  setSubscriptionReminder: async (id: string, reminderData?: ReminderData) => {
    set({ loading: true, error: null });
    try {
      const { subscriptions } = get();
      const subscription = subscriptions.find(sub => sub.id === id);
      
      if (!subscription) {
        throw new Error('Suscripción no encontrada');
      }
      
      // Convertir la fecha a string ISO para almacenamiento
      const reminderToSave = reminderData ? {
        ...reminderData,
        time: reminderData.time.toISOString()
      } : undefined;
      
      const updatedSubscriptions = subscriptions.map(sub =>
        sub.id === id
          ? { 
              ...sub, 
              reminder: reminderToSave,
              updatedAt: new Date().toISOString() 
            }
          : sub
      );

      await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updatedSubscriptions));
      set({ subscriptions: updatedSubscriptions as Subscription[], loading: false });
      
      if (reminderToSave && reminderToSave.enabled) {
        const subscription = updatedSubscriptions.find(sub => sub.id === id);
        if (subscription) {
          await NotificationService.scheduleSubscriptionReminder(subscription as Subscription);
        }
      } else {
        await NotificationService.cancelSubscriptionReminders(id);
      }
      
      return true;
    } catch (error) {
      set({ error: 'Error al configurar recordatorio', loading: false });
      return false;
    }
  },

  deleteSubscription: async (id) => {
    set({ loading: true, error: null });
    try {
      const { subscriptions } = get();
      const updatedSubscriptions = subscriptions.filter(sub => sub.id !== id);

      await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updatedSubscriptions));
      set({ subscriptions: updatedSubscriptions, loading: false });
      
      // Si no quedan suscripciones, redirigir al home
      if (updatedSubscriptions.length === 0) {
        router.replace('/(tabs)');
      }
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