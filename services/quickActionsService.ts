import * as QuickActions from 'expo-quick-actions';
import { router } from 'expo-router';

export type QuickActionType = 'add-subscription' | 'view-subscriptions' | 'view-analytics';

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle?: string | null;
  icon?: string | null;
  params?: Record<string, number | string | boolean | null | undefined> | null;
}

const quickActionItems: Record<QuickActionType, QuickActionItem> = {
  'add-subscription': {
    id: 'add-subscription',
    title: 'Agregar Suscripción',
    subtitle: 'Añadir nueva suscripción',
    icon: 'add',
    params: { href: '/add' },
  },
  'view-subscriptions': {
    id: 'view-subscriptions',
    title: 'Ver Suscripciones',
    subtitle: 'Lista de suscripciones',
    icon: 'symbol:list.bullet',
    params: { href: '/(tabs)/subscriptions' },
  },
  'view-analytics': {
    id: 'view-analytics',
    title: 'Estadísticas',
    subtitle: 'Ver estadísticas',
    icon: 'symbol:chart.bar',
    params: { href: '/(tabs)/analytics' },
  },
};

export const initQuickActions = async (): Promise<(() => void) | undefined> => {
  try {
    const isSupported = await QuickActions.isSupported();
    if (!isSupported) {
      console.log('Quick actions are not supported on this device');
      return;
    }

    await QuickActions.setItems([
      quickActionItems['add-subscription'],
      quickActionItems['view-subscriptions'],
      quickActionItems['view-analytics'],
    ]);

    const initialAction = QuickActions.initial;
    if (initialAction) {
      handleQuickAction(initialAction);
    }

    const subscription = QuickActions.addListener(handleQuickAction);

    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  } catch (error) {
    console.error('Failed to initialize quick actions:', error);
    return;
  }
};

export const handleQuickAction = (action: QuickActions.Action | null) => {
  if (!action) return;

  if (action.params?.href && typeof action.params.href === 'string') {
    const href = action.params.href as any;
    router.push(href);
    return;
  }

  switch (action.id) {
    case 'add-subscription':
      router.push('/add' as any);
      break;
    case 'view-subscriptions':
      router.push('/(tabs)/subscriptions' as any);
      break;
    case 'view-analytics':
      router.push('/(tabs)/analytics' as any);
      break;
    default:
      console.log('Unknown quick action:', action);
  }
};
