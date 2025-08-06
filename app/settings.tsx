import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SymbolView } from 'expo-symbols';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { SettingItem } from '@/components/settings/SettingItem';
import { StatsSummary } from '@/components/settings/StatsSummary';
import { CurrencySelector } from '@/components/settings/CurrencySelector';
import { useSettings } from '@/hooks/useSettings';
import { commonStyles } from '@/styles/common';
import { theme } from '@/styles/theme';

export default function SettingsScreen() {
  const { subscriptions } = useSubscriptionStore();
  const {
    isLoading,
    selectedCurrency,
    bottomSheetModalRef,
    handleCurrencySettings,
    handleCurrencySelect,
    handleClearAllData,
    handleNotificationSettings,
    handleAbout,
  } = useSettings();

  return (
    <BottomSheetModalProvider>
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
              title={isLoading ? "Configurando..." : "Recordatorios de Renovación"}
              subtitle="Configurar alertas para próximos pagos"
              onPress={handleNotificationSettings}
              disabled={isLoading}
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

        {/* Currency */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Moneda</Text>
          <View style={commonStyles.card}>
            <SettingItem
              icon={<SymbolView name="dollarsign" type="hierarchical" />}
              title="Seleccionar Moneda"
              subtitle={`${selectedCurrency.name} (${selectedCurrency.symbol})`}
              onPress={handleCurrencySettings}
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
            <SettingItem
              icon={<SymbolView name="questionmark.circle" type="hierarchical" />}
              title="Ayuda y Soporte"
              subtitle="Guías y contacto de soporte"
              onPress={() => { }}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Never Forgett v1.0.1
          </Text>
          <Text style={styles.footerSubtext}>
            Desarrollado con ❤️ para ayudarte a gestionar tus suscripciones
          </Text>
        </View>
      </ScrollView>

      <CurrencySelector
        bottomSheetModalRef={bottomSheetModalRef}
        onSelect={handleCurrencySelect}
        selectedCurrency={selectedCurrency}
      />
    </SafeAreaView>
  </BottomSheetModalProvider>
  );
}

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  footer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  footerText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  footerSubtext: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});