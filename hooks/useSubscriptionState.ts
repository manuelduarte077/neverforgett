import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useEffect, useState } from 'react';

export const useSubscriptionState = () => {
  const { subscriptions, loading, loadSubscriptions } = useSubscriptionStore();
  const [hasSubscriptions, setHasSubscriptions] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  useEffect(() => {
    setHasSubscriptions(subscriptions.length > 0);
  }, [subscriptions]);

  return {
    hasSubscriptions,
    loading,
    subscriptions,
  };
};
