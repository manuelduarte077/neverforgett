import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Subscription } from '@/types/subscription';

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
  static async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
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

  static async scheduleSubscriptionReminder(subscription: Subscription) {
    if (!subscription.reminder || !subscription.reminder.enabled) {
      return null;
    }
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      return null;
    }

    try {
      const renewalDate = new Date(subscription.renewalDate);
      const notificationDate = new Date(renewalDate);
      
      notificationDate.setDate(notificationDate.getDate() - subscription.reminder.daysInAdvance);
      const reminderTime = new Date(subscription.reminder.time);
      
      notificationDate.setHours(reminderTime.getHours());
      notificationDate.setMinutes(reminderTime.getMinutes());
      notificationDate.setSeconds(0);
      
      if (notificationDate <= new Date()) {
        return null;
      }
      await this.cancelSubscriptionReminders(subscription.id);

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

  static async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error al cancelar todas las notificaciones:', error);
    }
  }
}
