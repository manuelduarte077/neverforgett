import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { NotificationService } from '@/services/NotificationService';

export default function SettingsScreen() {
  const { subscriptions, loadSubscriptions, addSubscription } = useSubscriptionStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const { subscriptions } = useSubscriptionStore.getState();
      
      if (subscriptions.length === 0) {
        Alert.alert('Sin datos', 'No hay suscripciones para exportar.');
        setIsExporting(false);
        return;
      }
      
      // Crear un archivo temporal con los datos
      const dataToExport = JSON.stringify(subscriptions, null, 2);
      const fileUri = `${FileSystem.documentDirectory}subscriptions_export_${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(fileUri, dataToExport);
      
      // Verificar si se puede compartir
      const canShare = await Sharing.isAvailableAsync();
      
      if (canShare) {
        // Compartir el archivo
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Exportar Suscripciones',
          UTI: 'public.json'
        });
      } else {
        Alert.alert(
          'Error',
          'La función de compartir no está disponible en este dispositivo.'
        );
      }
      
      setIsExporting(false);
    } catch (error) {
      console.error('Error al exportar datos:', error);
      Alert.alert('Error', 'No se pudieron exportar los datos.');
      setIsExporting(false);
    }
  };

  const handleImportData = async () => {
    try {
      setIsImporting(true);
      
      // Seleccionar archivo JSON
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true
      });
      
      if (result.canceled) {
        setIsImporting(false);
        return;
      }
      
      // Leer el contenido del archivo
      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      
      try {
        // Parsear el JSON
        const importedData = JSON.parse(fileContent);
        
        // Validar que sea un array
        if (!Array.isArray(importedData)) {
          throw new Error('El formato del archivo no es válido');
        }
        
        // Confirmar la importación
        Alert.alert(
          'Confirmar Importación',
          `Se importarán ${importedData.length} suscripciones. ¿Deseas continuar?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Importar', 
              onPress: async () => {
                try {
                  // Importar cada suscripción
                  for (const sub of importedData) {
                    // Omitir id, createdAt y updatedAt para que se generen nuevos
                    const { id, createdAt, updatedAt, ...subscriptionData } = sub;
                    
                    // Si hay un recordatorio, convertir la hora de string a Date
                    if (subscriptionData.reminder && subscriptionData.reminder.time) {
                      subscriptionData.reminder = {
                        ...subscriptionData.reminder,
                        time: new Date(subscriptionData.reminder.time)
                      };
                    }
                    
                    await addSubscription(subscriptionData);
                  }
                  
                  Alert.alert(
                    'Importación Exitosa',
                    `Se han importado ${importedData.length} suscripciones correctamente.`,
                    [{ text: 'OK' }]
                  );
                } catch (error) {
                  console.error('Error al importar suscripciones:', error);
                  Alert.alert('Error', 'No se pudieron importar algunas suscripciones.');
                }
              } 
            }
          ]
        );
      } catch (error) {
        console.error('Error al parsear JSON:', error);
        Alert.alert('Error', 'El archivo seleccionado no tiene un formato JSON válido.');
      }
      
      setIsImporting(false);
    } catch (error) {
      console.error('Error al importar datos:', error);
      Alert.alert('Error', 'No se pudieron importar los datos.');
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
              // Obtener el store y limpiar las suscripciones
              const store = useSubscriptionStore.getState();
              
              // Guardar un array vacío en AsyncStorage
              await AsyncStorage.setItem('subscriptions', JSON.stringify([]));
              
              // Actualizar el estado del store
              store.loadSubscriptions();
              
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
      Alert.alert(
        'Error',
        'Ha ocurrido un error al configurar las notificaciones.',
        [{ text: 'OK' }]
      );
    }
  };
  
  const configureNotifications = async (days: number) => {
    try {
      setIsLoading(true);
      
      // Guardar la preferencia del usuario
      await AsyncStorage.setItem('notificationDays', days.toString());
      
      // Obtener todas las suscripciones
      const { subscriptions } = useSubscriptionStore.getState();
      
      // Programar notificaciones para todas las suscripciones
      let scheduledCount = 0;
      
      for (const subscription of subscriptions) {
        // Crear un recordatorio con los días especificados
        const reminderTime = new Date();
        const reminderData = {
          enabled: true,
          daysInAdvance: days,
          time: reminderTime
        };
        
        // Actualizar la suscripción con el nuevo recordatorio
        const store = useSubscriptionStore.getState();
        const success = await store.setSubscriptionReminder(subscription.id, reminderData);
        
        if (success) {
          scheduledCount++;
        }
      }
      
      setIsLoading(false);
      
      Alert.alert(
        'Notificaciones Configuradas',
        `Se han programado recordatorios ${days} día(s) antes de cada renovación para ${scheduledCount} suscripciones.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'No se pudieron configurar las notificaciones.');
    }
  };

  const handleAbout = () => {
    Alert.alert(
      'Acerca de la App',
      'Subscription Manager v1.0\n\nUna aplicación para gestionar tus suscripciones personales y hacer seguimiento de tus gastos.',
      [{ text: 'OK' }]
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    color = '#1C1C1E',
    showChevron = true,
    disabled = false
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress: () => void;
    color?: string;
    showChevron?: boolean;
    disabled?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.settingItem, disabled && styles.settingItemDisabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color }]}>{title}</Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
      {showChevron && (
        <SymbolView name="chevron.right" type="hierarchical" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Configuración</Text>
          <Text style={styles.subtitle}>
            Personaliza tu experiencia
          </Text>
        </View>

        {/* App Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{subscriptions.length}</Text>
              <Text style={styles.statLabel}>Suscripciones</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {subscriptions.reduce((total, sub) => {
                  const monthlyCost = sub.frequency === 'monthly' ? sub.cost : sub.cost / 12;
                  return total + monthlyCost;
                }, 0).toFixed(0)}$
              </Text>
              <Text style={styles.statLabel}>Gasto Mensual</Text>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          <View style={styles.settingsList}>
            <SettingItem
              icon={isLoading ? 
                <ActivityIndicator size="small" color="#007AFF" /> : 
                <SymbolView name="bell" type="hierarchical" />}
              title={isLoading ? "Configurando..." : "Recordatorios"}
              subtitle="Configurar notificaciones de renovación"
              onPress={handleNotificationSettings}
              disabled={isLoading}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión de Datos</Text>
          <View style={styles.settingsList}>
            <SettingItem
              icon={isExporting ? 
                <ActivityIndicator size="small" color="#007AFF" /> : 
                <SymbolView name="arrow.down.circle" type="hierarchical" />}
              title={isExporting ? "Exportando..." : "Exportar Datos"}
              subtitle="Guardar tus suscripciones en un archivo"
              onPress={handleExportData}
              disabled={isExporting}
            />
            <SettingItem
              icon={isImporting ? 
                <ActivityIndicator size="small" color="#007AFF" /> : 
                <SymbolView name="arrow.up.circle" type="hierarchical" />}
              title={isImporting ? "Importando..." : "Importar Datos"}
              subtitle="Cargar suscripciones desde un archivo"
              onPress={handleImportData}
              disabled={isImporting}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zona de Peligro</Text>
          <View style={styles.settingsList}>
            <SettingItem
              icon={<SymbolView name="trash" type="hierarchical" />}
              title="Borrar Todos los Datos"
              subtitle="Eliminar todas las suscripciones permanentemente"
              onPress={handleClearAllData}
              color="#FF3B30"
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          <View style={styles.settingsList}>
            <SettingItem
              icon={<SymbolView name="info" type="hierarchical" />}
              title="Acerca de la App"
              subtitle="Versión e información del desarrollador"
              onPress={handleAbout}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Subscription Manager v1.0
          </Text>
          <Text style={styles.footerSubtext}>
            Desarrollado con ❤️ para ayudarte a gestionar tus suscripciones
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 12,
    paddingHorizontal: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E7',
    marginHorizontal: 20,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  footerSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#C7C7CC',
    textAlign: 'center',
  },
});