export const useCurrency = () => {
  const formatCurrency = (amount: number, currency = 'USD', locale = 'es-ES') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatCurrencyCompact = (amount: number, currency = 'USD', locale = 'es-ES') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return {
    formatCurrency,
    formatCurrencyCompact,
  };
}; 