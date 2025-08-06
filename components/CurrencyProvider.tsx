import React, { useEffect } from 'react';
import { useCurrencyStore } from '@/store/currencyStore';

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const { loadSavedCurrency } = useCurrencyStore();

  useEffect(() => {
    loadSavedCurrency();
  }, [loadSavedCurrency]);

  return <>{children}</>;
}; 