import { useEffect } from 'react';
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
              <Text style={commonStyles.title}>Never Forgett</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/settings')}>
              <SymbolView name="gear" type="hierarchical"
                style={{ width: 28, height: 28 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {subscriptions.length > 0 && (
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
        )}

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
                  showEditButton={false}
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
                    showEditButton={false}
                  />
                ))}
            </View>
          </View>
        )}

                {subscriptions.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <SymbolView 
                name="creditcard" 
                type="hierarchical" 
                style={{ width: 100, height: 100 }}
              />
            </View>
            <Text style={styles.emptyTitle}>Comienza agregando tus suscripciones</Text>
            <Text style={styles.emptySubtitle}>
              Agrega tu primera suscripción para comenzar a hacer seguimiento de tus gastos mensuales y anuales
            </Text>
            <View style={styles.emptyFeatures}>
              <View style={styles.featureItem}>
                <SymbolView name="chart.bar" type="hierarchical" style={{ width: 20, height: 20, marginRight: 8 }} />
                <Text style={styles.featureText}>Seguimiento de gastos</Text>
              </View>
              <View style={styles.featureItem}>
                <SymbolView name="bell" type="hierarchical" style={{ width: 20, height: 20, marginRight: 8 }} />
                <Text style={styles.featureText}>Recordatorios de renovación</Text>
              </View>
              <View style={styles.featureItem}>
                <SymbolView name="chart.pie" type="hierarchical" style={{ width: 20, height: 20, marginRight: 8 }} />
                <Text style={styles.featureText}>Estadísticas detalladas</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.addFirstButton}
              onPress={() => router.push('/add')}
            >
              <SymbolView name="plus" type="hierarchical" style={{ width: 20, height: 20, marginRight: 8 }} tintColor={theme.colors.surface} />
              <Text style={styles.addFirstButtonText}>Agregar Primera Suscripción</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      {subscriptions.length > 0 && (
        <TouchableOpacity style={styles.floatingButton}
          onPress={() => router.push('/add')}>
          <SymbolView name="plus"
            tintColor={theme.colors.surface}
            type="hierarchical" />
        </TouchableOpacity>
      )}
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
  addFirstButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  addFirstButtonText: {
    color: theme.colors.surface,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.base,
    textAlign: 'center',
  },
  emptyIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary + '10',
    marginBottom: theme.spacing.xl,
  },
  emptyFeatures: {
    marginVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  featureText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
});