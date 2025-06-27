import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { StatsCard } from '@/components/StatsCard';
import { CATEGORY_COLORS } from '@/types/subscription';
import { SymbolView } from 'expo-symbols';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const { subscriptions, loadSubscriptions, getStats } = useSubscriptionStore();

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

  // Prepare data for pie chart
  const pieChartData = Object.entries(stats.categoryBreakdown).map(([category, amount]) => ({
    name: category,
    population: amount,
    color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Otros,
    legendFontColor: '#1C1C1E',
    legendFontSize: 12,
  }));

  // Prepare data for bar chart - Monthly costs by category
  const barChartData = {
    labels: Object.keys(stats.categoryBreakdown).map(cat =>
      cat.length > 8 ? cat.substring(0, 8) + '...' : cat
    ),
    datasets: [
      {
        data: Object.values(stats.categoryBreakdown),
        colors: Object.keys(stats.categoryBreakdown).map(cat =>
          () => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Otros
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
              icon={<SymbolView name="target" type="hierarchical" />}
            />
            <View style={styles.statsSpacer} />
            <StatsCard
              title="Categoría Principal"
              value={mostExpensiveCategory ? mostExpensiveCategory[0] : 'N/A'}
              subtitle={mostExpensiveCategory ? formatCurrency(mostExpensiveCategory[1]) : ''}
              color="#FF9500"
              icon={<SymbolView name="chart.pie" type="hierarchical" />}
            />
          </View>

          <View style={styles.statsRow}>
            <StatsCard
              title="Gasto Anual"
              value={formatCurrency(stats.totalAnnual)}
              subtitle="Proyección total"
              color="#007AFF"
              icon={<SymbolView name="calendar" type="hierarchical" />}
            />
            <View style={styles.statsSpacer} />
            <StatsCard
              title="Ahorro Potencial"
              value={formatCurrency(stats.totalMonthly * 0.15)}
              subtitle="15% optimización"
              color="#5856D6"
              icon={<SymbolView name="dollarsign" type="hierarchical" />}
            />
          </View>
        </View>

        {/* Enhanced Category Distribution */}
        {pieChartData.length > 0 && (
          <View style={styles.chartSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Distribución por Categorías</Text>
                <Text style={styles.sectionSubtitle}>
                  Gasto mensual por categoría
                </Text>
              </View>
              <View style={styles.sectionIcon}>
                <SymbolView name="chart.pie" type="hierarchical" />
              </View>
            </View>

            <View style={styles.chartContainer}>
              <PieChart
                data={pieChartData}
                width={screenWidth - 80}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 0]}
                absolute
              />

              {/* Enhanced Legend */}
              <View style={styles.legendContainer}>
                {pieChartData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.name}</Text>
                    <Text style={styles.legendValue}>{formatCurrency(item.population)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Enhanced Monthly Spending by Category */}
        {barChartData.labels.length > 0 && (
          <View style={styles.chartSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Comparativa por Categoría</Text>
                <Text style={styles.sectionSubtitle}>
                  Análisis comparativo de gastos mensuales
                </Text>
              </View>
              <View style={styles.sectionIcon}>
                <SymbolView name="chart.bar.yaxis" type="hierarchical" />
              </View>
            </View>

            <View style={styles.chartContainer}>
              <BarChart
                data={barChartData}
                width={screenWidth - 80}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  decimalPlaces: 0,
                }}
                verticalLabelRotation={0}
                showValuesOnTopOfBars
                withCustomBarColorFromData
                flatColor
                fromZero yAxisLabel={''} yAxisSuffix={''} />
            </View>
          </View>
        )}

        {/* Enhanced Insights */}
        <View style={styles.insightsSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Insights Inteligentes</Text>
              <Text style={styles.sectionSubtitle}>
                Análisis automático de tus patrones de gasto
              </Text>
            </View>
            <View style={styles.sectionIcon}>
              <SymbolView name="chart.line.uptrend.xyaxis" type="hierarchical" />
            </View>
          </View>

          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#E8F5E8' }]}>
                <SymbolView name="chart.line.uptrend.xyaxis" style={{
                  width: 20,
                  height: 20,
                  margin: 5,
                }} type="hierarchical" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Proyección Anual</Text>
                <Text style={styles.insightDescription}>
                  Basado en tus suscripciones actuales, gastarás {formatCurrency(stats.totalAnnual)} este año
                </Text>
                <View style={styles.insightMetric}>
                  <Text style={styles.insightMetricValue}>{formatCurrency(stats.totalAnnual / 12)}</Text>
                  <Text style={styles.insightMetricLabel}>promedio mensual</Text>
                </View>
              </View>
            </View>

            {mostExpensiveCategory && (
              <View style={styles.insightItem}>
                <View style={[styles.insightIcon, { backgroundColor: '#FFF4E6' }]}>
                  <SymbolView name="chart.pie" style={{
                    width: 20,
                    height: 20,
                    margin: 5,
                  }} type="hierarchical" />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Categoría Dominante</Text>
                  <Text style={styles.insightDescription}>
                    {mostExpensiveCategory[0]} representa el {Math.round((mostExpensiveCategory[1] / stats.totalMonthly) * 100)}% de tu presupuesto mensual
                  </Text>
                  <View style={styles.insightMetric}>
                    <Text style={styles.insightMetricValue}>{formatCurrency(mostExpensiveCategory[1])}</Text>
                    <Text style={styles.insightMetricLabel}>gasto mensual</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#E6F3FF' }]}>
                <SymbolView name="target" type="hierarchical" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Optimización Sugerida</Text>
                <Text style={styles.insightDescription}>
                  Podrías ahorrar hasta {formatCurrency(stats.totalMonthly * 0.15)} al mes revisando suscripciones poco utilizadas
                </Text>
                <View style={styles.insightMetric}>
                  <Text style={styles.insightMetricValue}>{formatCurrency(stats.totalMonthly * 0.15 * 12)}</Text>
                  <Text style={styles.insightMetricLabel}>ahorro anual potencial</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
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
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  legendContainer: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1C1C1E',
  },
  legendValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#007AFF',
  },
  insightsSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  insightsList: {
    marginTop: 20,
  },
  insightItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 6,
  },
  insightDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  insightMetric: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  insightMetricValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#007AFF',
    marginRight: 8,
  },
  insightMetricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
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