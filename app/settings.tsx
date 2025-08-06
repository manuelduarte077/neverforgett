import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { SettingItem } from '@/components/settings/SettingItem';
import { StatsSummary } from '@/components/settings/StatsSummary';
import { useSettings } from '@/hooks/useSettings';
import { commonStyles } from '@/styles/common';
import { theme } from '@/styles/theme';

export default function SettingsScreen() {
  const { subscriptions } = useSubscriptionStore();
  const {
    isExporting,
    isImporting,
    isLoading,
    handleExportData,
    handleImportData,
    handleClearAllData,
    handleNotificationSettings,
    handleAbout,
  } = useSettings();

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <ScrollView style={commonStyles.scrollView}>
        <View style={commonStyles.header}>
          <Text style={commonStyles.title}>Configuración</Text>
          <Text style={commonStyles.subtitle}>
            Personaliza tu experiencia
          </Text>
        </View>

        {/* App Stats */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Resumen</Text>
          <StatsSummary subscriptions={subscriptions} />
        </View>

        {/* Notifications */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Notificaciones</Text>
          <View style={commonStyles.card}>
            <SettingItem
              icon={isLoading ? 
                <ActivityIndicator size="small" color={theme.colors.primary} /> : 
                <SymbolView name="bell" type="hierarchical" />}
              title={isLoading ? "Configurando..." : "Recordatorios"}
              subtitle="Configurar notificaciones de renovación"
              onPress={handleNotificationSettings}
              disabled={isLoading}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Gestión de Datos</Text>
          <View style={commonStyles.card}>
            <SettingItem
              icon={isExporting ? 
                <ActivityIndicator size="small" color={theme.colors.primary} /> : 
                <SymbolView name="arrow.down.circle" type="hierarchical" />}
              title={isExporting ? "Exportando..." : "Exportar Datos"}
              subtitle="Guardar tus suscripciones en un archivo"
              onPress={handleExportData}
              disabled={isExporting}
            />
            <SettingItem
              icon={isImporting ? 
                <ActivityIndicator size="small" color={theme.colors.primary} /> : 
                <SymbolView name="arrow.up.circle" type="hierarchical" />}
              title={isImporting ? "Importando..." : "Importar Datos"}
              subtitle="Cargar suscripciones desde un archivo"
              onPress={handleImportData}
              disabled={isImporting}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Zona de Peligro</Text>
          <View style={commonStyles.card}>
            <SettingItem
              icon={<SymbolView name="trash" type="hierarchical" />}
              title="Borrar Todos los Datos"
              subtitle="Eliminar todas las suscripciones permanentemente"
              onPress={handleClearAllData}
              color={theme.colors.danger}
            />
          </View>
        </View>

        {/* About */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Información</Text>
          <View style={commonStyles.card}>
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

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  footer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  footerText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  footerSubtext: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});