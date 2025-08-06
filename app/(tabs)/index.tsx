import React, { useEffect } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { StatsCard } from '@/components/StatsCard';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCurrency } from '@/hooks/useCurrency';
import { commonStyles } from '@/styles/common';
import { theme } from '@/styles/theme';

export default function DashboardScreen() {
  const {
    subscriptions,
    loading,
    loadSubscriptions,
    getStats,
    getUpcomingRenewals
  } = useSubscriptionStore();

  const { formatCurrency } = useCurrency();

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const stats = getStats();
  const upcomingRenewals = getUpcomingRenewals(7);

  const onRefresh = () => {
    loadSubscriptions();
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        style={commonStyles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        <View style={commonStyles.header}>
          <View style={commonStyles.row}>
            <View style={{ flex: 1 }}>
              <Text style={commonStyles.title}>Dashboard</Text>
              <Text style={commonStyles.subtitle}>
                Resumen de tus suscripciones
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/settings')}>
              <SymbolView name="gear" type="hierarchical" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatsCard
              title="Gasto Mensual"
              value={formatCurrency(stats.totalMonthly)}
              subtitle="Total por mes"
              color={theme.colors.success}
            />
            <View style={commonStyles.spacer} />
            <StatsCard
              title="Gasto Anual"
              value={formatCurrency(stats.totalAnnual)}
              subtitle="Total por año"
              color={theme.colors.primary}
            />
          </View>

          <View style={styles.statsRow}>
            <StatsCard
              title="Suscripciones"
              value={stats.activeSubscriptions.toString()}
              subtitle="Activas"
              color={theme.colors.warning}
            />
            <View style={commonStyles.spacer} />
            <StatsCard
              title="Próximos Pagos"
              value={upcomingRenewals.length.toString()}
              subtitle="En 7 días"
              color={theme.colors.danger}
            />
          </View>
        </View>

        {upcomingRenewals.length > 0 && (
          <View style={commonStyles.section}>
            <Text style={commonStyles.sectionTitle}>Próximos Pagos</Text>
            <Text style={styles.sectionSubtitle}>
              Renovaciones en los próximos 7 días
            </Text>

            <View style={styles.subscriptionsList}>
              {upcomingRenewals.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                />
              ))}
            </View>
          </View>
        )}

        {subscriptions.length > 0 && (
          <View style={commonStyles.section}>
            <Text style={commonStyles.sectionTitle}>Suscripciones Recientes</Text>
            <Text style={styles.sectionSubtitle}>
              Últimas suscripciones agregadas
            </Text>

            <View style={styles.subscriptionsList}>
              {subscriptions
                .slice(-3)
                .reverse()
                .map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                  />
                ))}
            </View>
          </View>
        )}

        {subscriptions.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <SymbolView name="creditcard" type="hierarchical" />
            <Text style={styles.emptyTitle}>No hay suscripciones</Text>
            <Text style={styles.emptySubtitle}>
              Agrega tu primera suscripción para comenzar a hacer seguimiento de tus gastos
            </Text>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.floatingButton}
        onPress={() => router.push('/add')}>
        <SymbolView name="plus"
          tintColor={theme.colors.surface}
          type="hierarchical" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing['2xl'],
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  sectionSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  subscriptionsList: {
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  floatingButton: {
    backgroundColor: theme.colors.primary,
    width: 55,
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 30,
    elevation: 5,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});