import { useState, useRef } from 'react';
import { Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { NotificationService } from '@/services/NotificationService';
import { Currency } from '@/types/currency';
import { toast } from '@/services/ToastService';

export const useSettings = () => {
  const { subscriptions } = useSubscriptionStore();
  const { selectedCurrency, setCurrency } = useCurrencyStore();
  const [isLoading, setIsLoading] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleCurrencySettings = () => {
    bottomSheetModalRef.current?.present();
  };

  const handleCurrencySelect = async (currency: Currency) => {
    try {
      await setCurrency(currency);
      toast.success(
        `La moneda se ha cambiado a ${currency.name} (${currency.symbol})`,
        'Moneda Actualizada'
      );
    } catch (error) {
      toast.error('No se pudo guardar la configuración de moneda.');
    }
  };



  const handleNotificationSettings = async () => {
    try {
      const hasPermission = await NotificationService.requestPermissions();
      
      if (hasPermission) {
        toast.showActions(
          'Configuración de Notificaciones',
          'Configura cuándo quieres recibir recordatorios de renovación',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: '1 día antes', onPress: () => configureNotifications(1) },
            { text: '3 días antes', onPress: () => configureNotifications(3) },
            { text: '7 días antes', onPress: () => configureNotifications(7) }
          ]
        );
      } else {
        toast.showActions(
          'Permisos Denegados',
          'No se han concedido permisos para enviar notificaciones. Por favor, actívalos en la configuración de tu dispositivo para recibir recordatorios.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Ir a Configuración', 
              onPress: async () => {
                await Linking.openSettings();
              }
            }
          ]
        );
      }
    } catch (error) {
      toast.error('Ha ocurrido un error al configurar las notificaciones.');
    }
  };

  const configureNotifications = async (days: number) => {
    try {
      setIsLoading(true);
      
      await AsyncStorage.setItem('notificationDays', days.toString());
      
      const { subscriptions } = useSubscriptionStore.getState();
      let scheduledCount = 0;
      
      for (const subscription of subscriptions) {
        const reminderData = {
          enabled: true,
          daysInAdvance: days,
          time: new Date()
        };
        
        const store = useSubscriptionStore.getState();
        const success = await store.setSubscriptionReminder(subscription.id, reminderData);
        
        if (success) {
          scheduledCount++;
        }
      }
      
      toast.success(
        `Se han programado recordatorios ${days} día(s) antes de cada renovación para ${scheduledCount} suscripciones.`,
        'Notificaciones Configuradas'
      );
    } catch (error) {
      toast.error('No se pudieron configurar las notificaciones.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAbout = () => {
    toast.info(
      'Never Forgett v1.0.2\n\nUna aplicación para gestionar tus suscripciones personales y hacer seguimiento de tus gastos.',
      'Acerca de la App'
    );
  };

  return {
    isLoading,
    selectedCurrency,
    bottomSheetModalRef,
    handleCurrencySettings,
    handleCurrencySelect,
    handleNotificationSettings,
    handleAbout,
  };
}; 