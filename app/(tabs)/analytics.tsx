import { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { StatsCard } from '@/components/StatsCard';
import { CATEGORY_COLORS } from '@/types/subscription';
import { SymbolView } from 'expo-symbols';
import { BarChartComponent } from '@/components/BarChartComponent';
import { InsightsComponent } from '@/components/InsightsComponent';
import { SFSymbol } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const { subscriptions, loadSubscriptions, getStats } = useSubscriptionStore();

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

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

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(28, 28, 30, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    propsForLabels: {
      fontFamily: 'Inter-Regular',
      fontSize: 10,
    },
  };

  if (subscriptions.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.title}>Estadísticas</Text>
          <Text style={styles.subtitle}>
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />  
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Estadísticas</Text>
          <Text style={styles.subtitle}>
            Análisis detallado de tus gastos en suscripciones
          </Text>
        </View>

        {/* Enhanced Overview Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatsCard
              title="Promedio Mensual"
              value={formatCurrency(averageCost)}
              subtitle="Por suscripción"
              color="#34C759"
            />
            <View style={styles.statsSpacer} />
            <StatsCard
              title="Categoría Principal"
              value={mostExpensiveCategory ? mostExpensiveCategory[0] : 'N/A'}
              subtitle={mostExpensiveCategory ? formatCurrency(mostExpensiveCategory[1]) : ''}
              color="#FF9500"
            />
          </View>

          <View style={styles.statsRow}>
            <StatsCard
              title="Gasto Anual"
              value={formatCurrency(stats.totalAnnual)}
              subtitle="Proyección total"
              color="#007AFF"
            />
            <View style={styles.statsSpacer} />
            <StatsCard
              title="Ahorro Potencial"
              value={formatCurrency(stats.totalMonthly * 0.15)}
              subtitle="15% optimización"
              color="#5856D6"
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
              description: `Basado en tus suscripciones actuales, gastarás ${formatCurrency(stats.totalAnnual)} este año`,
              metricValue: formatCurrency(stats.totalAnnual / 12),
              metricLabel: "promedio mensual",
              iconName: "chart.line.uptrend.xyaxis" as SFSymbol,
              iconBackground: "#E8F5E8"
            },
            ...(mostExpensiveCategory ? [{
              title: "Categoría Dominante",
              description: `${mostExpensiveCategory[0]} representa el ${Math.round((mostExpensiveCategory[1] / stats.totalMonthly) * 100)}% de tu presupuesto mensual`,
              metricValue: formatCurrency(mostExpensiveCategory[1]),
              metricLabel: "gasto mensual",
              iconName: "chart.pie" as SFSymbol,
              iconBackground: "#FFF4E6"
            }] : []),
            {
              title: "Optimización Sugerida",
              description: `Podrías ahorrar hasta ${formatCurrency(stats.totalMonthly * 0.15)} al mes revisando suscripciones poco utilizadas`,
              metricValue: formatCurrency(stats.totalMonthly * 0.15 * 12),
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
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
    lineHeight: 22,
  },
  statsGrid: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statsSpacer: {
    width: 12,
  },
  // These styles are still needed for the TrendChart section
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
});