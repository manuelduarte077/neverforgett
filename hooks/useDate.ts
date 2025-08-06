export const useDate = () => {
  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    return dateObj.toLocaleDateString('es-ES', options || defaultOptions);
  };

  const formatDateShort = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDaysUntilRenewal = (renewalDate: string | Date) => {
    const renewal = typeof renewalDate === 'string' ? new Date(renewalDate) : renewalDate;
    const today = new Date();
    const diffTime = renewal.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return {
    formatDate,
    formatDateShort,
    formatTime,
    getDaysUntilRenewal,
  };
}; 