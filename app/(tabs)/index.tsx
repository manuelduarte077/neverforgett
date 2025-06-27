import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, CreditCard, Bell, DollarSign } from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { StatsCard } from '@/components/StatsCard';
import { SubscriptionCard } from '@/components/SubscriptionCard';

export default function DashboardScreen() {
  const { 
    subscriptions, 
    loading, 
    loadSubscriptions, 
    getStats, 
    getUpcomingRenewals 
  } = useSubscriptionStore();

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const stats = getStats();
  const upcomingRenewals = getUpcomingRenewals(7);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const onRefresh = () => {
    loadSubscriptions();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>
            Resumen de tus suscripciones
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatsCard
              title="Gasto Mensual"
              value={formatCurrency(stats.totalMonthly)}
              subtitle="Total por mes"
              color="#34C759"
              icon={<DollarSign size={20} color="#34C759" />}
            />
            <View style={styles.statsSpacer} />
            <StatsCard
              title="Gasto Anual"
              value={formatCurrency(stats.totalAnnual)}
              subtitle="Total por año"
              color="#007AFF"
              icon={<TrendingUp size={20} color="#007AFF" />}
            />
          </View>

          <View style={styles.statsRow}>
            <StatsCard
              title="Suscripciones"
              value={stats.activeSubscriptions.toString()}
              subtitle="Activas"
              color="#FF9500"
              icon={<CreditCard size={20} color="#FF9500" />}
            />
            <View style={styles.statsSpacer} />
            <StatsCard
              title="Próximos Pagos"
              value={upcomingRenewals.length.toString()}
              subtitle="En 7 días"
              color="#FF3B30"
              icon={<Bell size={20} color="#FF3B30" />}
            />
          </View>
        </View>

        {upcomingRenewals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próximos Pagos</Text>
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suscripciones Recientes</Text>
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
            <CreditCard size={64} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>No hay suscripciones</Text>
            <Text style={styles.emptySubtitle}>
              Agrega tu primera suscripción para comenzar a hacer seguimiento de tus gastos
            </Text>
          </View>
        )}
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
  statsGrid: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statsSpacer: {
    width: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
  },
  subscriptionsList: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});