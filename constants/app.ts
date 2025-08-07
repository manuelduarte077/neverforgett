// App constants
export const APP_NAME = 'Never Forgett';
export const APP_VERSION = '1.0.2';

// Notification constants
export const NOTIFICATION_DAYS_OPTIONS = [1, 3, 7] as const;
export const DEFAULT_NOTIFICATION_DAYS = 3;

// UI constants
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const SCROLL_THROTTLE = 16;

// Storage keys
export const STORAGE_KEYS = {
  SUBSCRIPTIONS: 'subscriptions',
  CURRENCY: 'currency',
  NOTIFICATION_DAYS: 'notificationDays',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  LOAD_SUBSCRIPTIONS: 'Error al cargar suscripciones',
  ADD_SUBSCRIPTION: 'Error al agregar suscripción',
  UPDATE_SUBSCRIPTION: 'Error al actualizar suscripción',
  DELETE_SUBSCRIPTION: 'Error al eliminar suscripción',
  CONFIGURE_REMINDER: 'Error al configurar recordatorio',
  CURRENCY_SAVE: 'No se pudo guardar la configuración de moneda',
  NOTIFICATIONS_CONFIG: 'Ha ocurrido un error al configurar las notificaciones',
  NOTIFICATIONS_PERMISSION: 'No se han concedido permisos para enviar notificaciones',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SUBSCRIPTION_ADDED: 'La suscripción se ha agregado correctamente',
  SUBSCRIPTION_UPDATED: 'Suscripción actualizada correctamente',
  CURRENCY_UPDATED: 'La moneda se ha cambiado',
  REMINDER_CONFIGURED: 'Se ha configurado un recordatorio',
  NOTIFICATIONS_CONFIGURED: 'Se han programado recordatorios',
} as const;
