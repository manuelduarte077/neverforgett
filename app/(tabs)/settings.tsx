import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { SymbolView } from 'expo-symbols';

export default function SettingsScreen() {
  const { subscriptions, loadSubscriptions } = useSubscriptionStore();

  const handleExportData = () => {
    Alert.alert(
      'Exportar Datos',
      'Esta función te permitiría exportar tus datos de suscripciones a un archivo JSON.',
      [{ text: 'OK' }]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Importar Datos',
      'Esta función te permitiría importar datos de suscripciones desde un archivo.',
      [{ text: 'OK' }]
    );
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
          onPress: () => {
            Alert.alert('Función no implementada', 'Esta funcionalidad se implementaría en una versión completa.');
          }
        },
      ]
    );
  };

  const handleNotificationSettings = () => {
    Alert.alert(
      'Configuración de Notificaciones',
      'Aquí podrías configurar cuándo y cómo recibir recordatorios de renovación.',
      [{ text: 'OK' }]
    );
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
    showChevron = true
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress: () => void;
    color?: string;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
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
              icon={<SymbolView name="bell" type="hierarchical" />}
              title="Recordatorios"
              subtitle="Configurar notificaciones de renovación"
              onPress={handleNotificationSettings}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión de Datos</Text>
          <View style={styles.settingsList}>
            <SettingItem
              icon={<SymbolView name="arrow.down.circle" type="hierarchical" />}
              title="Exportar Datos"
              subtitle="Guardar tus suscripciones en un archivo"
              onPress={handleExportData}
            />
            <SettingItem
              icon={<SymbolView name="arrow.up.circle" type="hierarchical" />}
              title="Importar Datos"
              subtitle="Cargar suscripciones desde un archivo"
              onPress={handleImportData}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
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