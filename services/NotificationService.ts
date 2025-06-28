import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Subscription } from '@/types/subscription';

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  // Solicitar permisos para notificaciones
  static async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Si no tenemos permisos, solicitarlos
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Si no se concedieron permisos, no podemos mostrar notificaciones
    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('subscription-reminders', {
        name: 'Recordatorios de Suscripciones',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  }

  // Programar una notificación para una suscripción
  static async scheduleSubscriptionReminder(subscription: Subscription) {
    if (!subscription.reminder || !subscription.reminder.enabled) {
      return null;
    }

    // Verificar permisos
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      return null;
    }

    try {
      // Calcular la fecha de renovación
      const renewalDate = new Date(subscription.renewalDate);
      
      // Calcular la fecha de notificación (X días antes)
      const notificationDate = new Date(renewalDate);
      notificationDate.setDate(notificationDate.getDate() - subscription.reminder.daysInAdvance);
      
      // Establecer la hora de la notificación
      const reminderTime = new Date(subscription.reminder.time);
      notificationDate.setHours(reminderTime.getHours());
      notificationDate.setMinutes(reminderTime.getMinutes());
      notificationDate.setSeconds(0);
      
      // Si la fecha ya pasó, no programar
      if (notificationDate <= new Date()) {
        return null;
      }

      // Cancelar notificaciones existentes para esta suscripción
      await this.cancelSubscriptionReminders(subscription.id);

      // Programar la nueva notificación
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Recordatorio: ${subscription.name}`,
          body: `Tu suscripción a ${subscription.name} se renovará en ${subscription.reminder.daysInAdvance} día(s).`,
          data: { subscriptionId: subscription.id },
        },
        trigger: {
          seconds: Math.floor((notificationDate.getTime() - Date.now()) / 1000),
          channelId: 'subscription-reminders',
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error al programar notificación:', error);
      return null;
    }
  }

  // Cancelar todas las notificaciones para una suscripción
  static async cancelSubscriptionReminders(subscriptionId: string) {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of scheduledNotifications) {
        if (notification.content.data?.subscriptionId === subscriptionId) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
    } catch (error) {
      console.error('Error al cancelar notificaciones:', error);
    }
  }

  // Cancelar todas las notificaciones
  static async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error al cancelar todas las notificaciones:', error);
    }
  }
}
