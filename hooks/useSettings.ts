import { useState } from 'react';
import { Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { NotificationService } from '@/services/NotificationService';
import { DataExportService } from '@/services/dataExportService';

export const useSettings = () => {
  const { subscriptions, addSubscription } = useSubscriptionStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      await DataExportService.exportData(subscriptions);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudieron exportar los datos.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async () => {
    try {
      setIsImporting(true);
      const importedData = await DataExportService.importData();
      
      if (!importedData) return;

      Alert.alert(
        'Confirmar Importación',
        `Se importarán ${importedData.length} suscripciones. ¿Deseas continuar?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Importar', 
            onPress: async () => {
              try {
                for (const subscriptionData of importedData) {
                  await addSubscription(subscriptionData);
                }
                
                Alert.alert(
                  'Importación Exitosa',
                  `Se han importado ${importedData.length} suscripciones correctamente.`,
                  [{ text: 'OK' }]
                );
              } catch (error) {
                Alert.alert('Error', 'No se pudieron importar algunas suscripciones.');
              }
            } 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudieron importar los datos.');
    } finally {
      setIsImporting(false);
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
      'Subscription Manager v1.0\n\nUna aplicación para gestionar tus suscripciones personales y hacer seguimiento de tus gastos.',
      [{ text: 'OK' }]
    );
  };

  return {
    isExporting,
    isImporting,
    isLoading,
    handleExportData,
    handleImportData,
    handleClearAllData,
    handleNotificationSettings,
    handleAbout,
  };
}; 