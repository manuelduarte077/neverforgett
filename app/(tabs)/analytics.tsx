import { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { StatsCard } from '@/components/StatsCard';
import { CATEGORY_COLORS } from '@/types/subscription';
import { SymbolView } from 'expo-symbols';
import { BarChartComponent } from '@/components/BarChartComponent';
import { InsightsComponent } from '@/components/InsightsComponent';
import { SFSymbol } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useCurrency } from '@/hooks/useCurrency';
import { commonStyles } from '@/styles/common';
import { theme } from '@/styles/theme';

export default function AnalyticsScreen() {
  const { subscriptions, loadSubscriptions, getStats } = useSubscriptionStore();
  const { formatCurrencyCompact } = useCurrency();

  const trendData = useMemo(() => {
    if (subscriptions.length === 0) {
      return { data: [0], labels: ['Ene'] };
    }
    
    const months = [];
    const monthlyTotals = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleDateString('es-ES', { month: 'short' });
      months.push(monthName);
      
      const monthTotal = subscriptions.reduce((total, sub) => {
        if (sub.frequency === 'monthly') {
          return total + sub.cost;
        }
        else if (sub.frequency === 'annual') {
          return total + (sub.cost / 12);
        }
        return total;
      }, 0);
      
      monthlyTotals.push(monthTotal);
    }
    
    return { data: monthlyTotals, labels: months };
  }, [subscriptions]);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const stats = getStats();

  // Prepare data for bar chart - Monthly costs by category
  const barChartData = {
    labels: Object.keys(stats.categoryBreakdown).map(cat =>
      cat.length > 8 ? cat.substring(0, 8) + '...' : cat
    ),
    datasets: [
      {
        data: Object.values(stats.categoryBreakdown),
        colors: Object.keys(stats.categoryBreakdown).map(cat =>
          () => CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.Otros ?? '#C44569'
        ),
      },
    ],
  };

  // Calculate average subscription cost
  const averageCost = subscriptions.length > 0
    ? stats.totalMonthly / subscriptions.length
    : 0;

  // Find most expensive category
  const mostExpensiveCategory = Object.entries(stats.categoryBreakdown)
    .sort(([, a], [, b]) => b - a)[0];

  if (subscriptions.length === 0) {
    return (
      <SafeAreaView style={commonStyles.container} edges={['top']}>
        <StatusBar style="dark" />
        <View style={commonStyles.header}>
          <Text style={commonStyles.title}>Estadísticas</Text>
          <Text style={commonStyles.subtitle}>
            Análisis de tus gastos en suscripciones
          </Text>
        </View>

        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <SymbolView name="chart.line.uptrend.xyaxis" type="hierarchical" />
          </View>
          <Text style={styles.emptyTitle}>No hay datos disponibles</Text>
          <Text style={styles.emptySubtitle}>
            Agrega algunas suscripciones para ver tus estadísticas y análisis detallados
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <StatusBar style="dark" />  
      <ScrollView style={commonStyles.scrollView}>
        <View style={commonStyles.header}>
          <Text style={commonStyles.title}>Estadísticas</Text>
          <Text style={commonStyles.subtitle}>
            Análisis detallado de tus gastos en suscripciones
          </Text>
        </View>

        {/* Enhanced Overview Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatsCard
              title="Promedio Mensual"
              value={formatCurrencyCompact(averageCost)}
              subtitle="Por suscripción"
              color={theme.colors.success}
            />
            <View style={commonStyles.spacer} />
            <StatsCard
              title="Categoría Principal"
              value={mostExpensiveCategory ? mostExpensiveCategory[0] : 'N/A'}
              subtitle={mostExpensiveCategory ? formatCurrencyCompact(mostExpensiveCategory[1]) : ''}
              color={theme.colors.warning}
            />
          </View>

          <View style={styles.statsRow}>
            <StatsCard
              title="Gasto Anual"
              value={formatCurrencyCompact(stats.totalAnnual)}
              subtitle="Proyección total"
              color={theme.colors.primary}
            />
            <View style={commonStyles.spacer} />
            <StatsCard
              title="Ahorro Potencial"
              value={formatCurrencyCompact(stats.totalMonthly * 0.15)}
              subtitle="15% optimización"
              color={theme.colors.secondary}
            />
          </View>
        </View>

        {/* Enhanced Monthly Spending by Category */}
        {barChartData.labels.length > 0 && (
          <BarChartComponent
            data={barChartData}
            title="Comparativa por Categoría"
            subtitle="Análisis comparativo de gastos mensuales"
          />
        )}

        {/* Enhanced Insights */}
        <InsightsComponent
          title="Insights Inteligentes"
          subtitle="Análisis automático de tus patrones de gasto"
          insights={[
            {
              title: "Proyección Anual",
              description: `Basado en tus suscripciones actuales, gastarás ${formatCurrencyCompact(stats.totalAnnual)} este año`,
              metricValue: formatCurrencyCompact(stats.totalAnnual / 12),
              metricLabel: "promedio mensual",
              iconName: "chart.line.uptrend.xyaxis" as SFSymbol,
              iconBackground: "#E8F5E8"
            },
            ...(mostExpensiveCategory ? [{
              title: "Categoría Dominante",
              description: `${mostExpensiveCategory[0]} representa el ${Math.round((mostExpensiveCategory[1] / stats.totalMonthly) * 100)}% de tu presupuesto mensual`,
              metricValue: formatCurrencyCompact(mostExpensiveCategory[1]),
              metricLabel: "gasto mensual",
              iconName: "chart.pie" as SFSymbol,
              iconBackground: "#FFF4E6"
            }] : []),
            {
              title: "Optimización Sugerida",
              description: `Podrías ahorrar hasta ${formatCurrencyCompact(stats.totalMonthly * 0.15)} al mes revisando suscripciones poco utilizadas`,
              metricValue: formatCurrencyCompact(stats.totalMonthly * 0.15 * 12),
              metricLabel: "ahorro anual potencial",
              iconName: "target" as SFSymbol,
              iconBackground: "#E6F3FF"
            }
          ]}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing['2xl'],
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing['3xl'],
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['3xl'],
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
});