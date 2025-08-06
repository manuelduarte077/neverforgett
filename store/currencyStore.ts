import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CURRENCIES, Currency } from '@/components/settings/CurrencySelector';

interface CurrencyState {
  selectedCurrency: Currency;
  isLoading: boolean;
  setCurrency: (currency: Currency) => Promise<void>;
  loadSavedCurrency: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  selectedCurrency: CURRENCIES[0]!,
  isLoading: false,

  setCurrency: async (currency: Currency) => {
    try {
      set({ isLoading: true });
      await AsyncStorage.setItem('selectedCurrency', currency.code);
      set({ selectedCurrency: currency });
    } catch (error) {
      console.error('Error saving currency:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadSavedCurrency: async () => {
    try {
      set({ isLoading: true });
      const savedCurrencyCode = await AsyncStorage.getItem('selectedCurrency');
      if (savedCurrencyCode) {
        const currency = CURRENCIES.find(c => c.code === savedCurrencyCode);
        if (currency) {
          set({ selectedCurrency: currency });
        }
      }
    } catch (error) {
      console.error('Error loading saved currency:', error);
    } finally {
      set({ isLoading: false });
    }
  },
})); 