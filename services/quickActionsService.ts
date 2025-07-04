import * as QuickActions from 'expo-quick-actions';
import { router } from 'expo-router';

// Define the types of quick actions available in the app
export type QuickActionType = 'add-subscription' | 'view-subscriptions' | 'view-analytics';

// Define the shape of a quick action item based on the library's Action type
export interface QuickActionItem {
  id: string;
  title: string;
  subtitle?: string | null;
  icon?: string | null; // iOS system icon name
  params?: Record<string, number | string | boolean | null | undefined> | null;
}

// Map of quick action types to their configurations
const quickActionItems: Record<QuickActionType, QuickActionItem> = {
  'add-subscription': {
    id: 'add-subscription',
    title: 'Agregar Suscripción',
    subtitle: 'Añadir nueva suscripción',
    icon: 'plus', // iOS system icon name
    params: { href: '/add' },
  },
  'view-subscriptions': {
    id: 'view-subscriptions',
    title: 'Ver Suscripciones',
    subtitle: 'Lista de suscripciones',
    icon: 'creditcard', // iOS system icon name
    params: { href: '/(tabs)/subscriptions' },
  },
  'view-analytics': {
    id: 'view-analytics',
    title: 'Estadísticas',
    subtitle: 'Ver estadísticas',
    icon: 'chart.bar', // iOS system icon name
    params: { href: '/(tabs)/analytics' },
  },
};

/**
 * Initialize quick actions for the app
 */
export const initQuickActions = async (): Promise<(() => void) | undefined> => {
  try {
    // Check if quick actions are supported on this device
    const isSupported = await QuickActions.isSupported();
    if (!isSupported) {
      console.log('Quick actions are not supported on this device');
      return;
    }

    // Set up the available quick actions
    await QuickActions.setItems([
      quickActionItems['add-subscription'],
      quickActionItems['view-subscriptions'],
      quickActionItems['view-analytics'],
    ]);

    // Check if the app was launched via a quick action
    const initialAction = QuickActions.initial;
    if (initialAction) {
      handleQuickAction(initialAction);
    }

    // Set up listener for quick actions while app is running
    const subscription = QuickActions.addListener(handleQuickAction);

    // Return cleanup function
    return () => {
      // Clean up the subscription
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  } catch (error) {
    console.error('Failed to initialize quick actions:', error);
    return;
  }
};

/**
 * Handle a quick action when triggered
 */
export const handleQuickAction = (action: QuickActions.Action | null) => {
  if (!action) return;

  // If params contains href, use it for navigation
  if (action.params?.href && typeof action.params.href === 'string') {
    // Use type assertion to handle router.push type constraints
    const href = action.params.href as any;
    router.push(href);
    return;
  }

  // Fallback to id-based routing if no href is provided
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
