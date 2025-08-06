import { useState, useEffect, useRef } from 'react';
import { Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { NotificationService } from '@/services/NotificationService';
import { CURRENCIES, Currency } from '@/components/settings/CurrencySelector';

export const useSettings = () => {
  const { subscriptions } = useSubscriptionStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]!);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    loadSavedCurrency();
  }, []);

  const loadSavedCurrency = async () => {
    try {
      const savedCurrencyCode = await AsyncStorage.getItem('selectedCurrency');
      if (savedCurrencyCode) {
        const currency = CURRENCIES.find(c => c.code === savedCurrencyCode);
        if (currency) {
          setSelectedCurrency(currency);
        }
      }
    } catch (error) {
      console.log('Error loading saved currency:', error);
    }
  };

  const handleCurrencySettings = () => {
    bottomSheetModalRef.current?.present();
  };

  const handleCurrencySelect = async (currency: Currency) => {
    try {
      setSelectedCurrency(currency);
      await AsyncStorage.setItem('selectedCurrency', currency.code);
      Alert.alert(
        'Moneda Actualizada',
        `La moneda se ha cambiado a ${currency.name} (${currency.symbol})`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la configuración de moneda.');
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Borrar Todos los Datos',
      '¿Estás seguro de que deseas eliminar todas las suscripciones? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar Todo',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('subscriptions', JSON.stringify([]));
              useSubscriptionStore.getState().loadSubscriptions();
              Alert.alert('Datos eliminados', 'Todas las suscripciones han sido eliminadas correctamente.');
            } catch (error) {
              Alert.alert('Error', 'No se pudieron eliminar los datos.');
            }
          }
        },
      ]
    );
  };

  const handleNotificationSettings = async () => {
    try {
      const hasPermission = await NotificationService.requestPermissions();
      
      if (hasPermission) {
        Alert.alert(
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
        Alert.alert(
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
      Alert.alert('Error', 'Ha ocurrido un error al configurar las notificaciones.');
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
      
      Alert.alert(
        'Notificaciones Configuradas',
        `Se han programado recordatorios ${days} día(s) antes de cada renovación para ${scheduledCount} suscripciones.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudieron configurar las notificaciones.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAbout = () => {
    Alert.alert(
      'Acerca de la App',
      'Never Forgett v1.0.1\n\nUna aplicación para gestionar tus suscripciones personales y hacer seguimiento de tus gastos.',
      [{ text: 'OK' }]
    );
  };

  return {
    isLoading,
    selectedCurrency,
    bottomSheetModalRef,
    handleCurrencySettings,
    handleCurrencySelect,
    handleClearAllData,
    handleNotificationSettings,
    handleAbout,
  };
}; 