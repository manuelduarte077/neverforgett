import { useCurrencyStore } from '@/store/currencyStore';

export const useCurrency = () => {
  const { selectedCurrency } = useCurrencyStore();

  const formatCurrency = (amount: number, locale = 'es-ES') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: selectedCurrency.code,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatCurrencyCompact = (amount: number, locale = 'es-ES') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: selectedCurrency.code,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencySymbol = (amount: number) => {
    return `${selectedCurrency.symbol}${amount.toFixed(2)}`;
  };

  return {
    formatCurrency,
    formatCurrencyCompact,
    formatCurrencySymbol,
    selectedCurrency,
  };
}; 