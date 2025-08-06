import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { SymbolView, SFSymbol } from 'expo-symbols';
import { theme } from '@/styles/theme';

interface BarChartComponentProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      colors: Array<() => string>;
    }>;
  };
  title: string;
  subtitle?: string;
}

export const BarChartComponent = ({ data, title, subtitle }: BarChartComponentProps) => {
  const screenWidth = Dimensions.get('window').width - 80;
  
  // Convert data format from react-native-chart-kit to react-native-gifted-charts
  const barData = data.labels.map((label, index) => ({
    value: data.datasets[0].data[index],
    label: label,
    frontColor: data.datasets[0].colors[index](),
    topLabelComponent: () => (
      <Text style={styles.barLabel}>
        {data.datasets[0].data[index]}
      </Text>
    ),
  }));

  return (
    <View style={styles.chartSection}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.sectionIcon}>
          <SymbolView name={"chart.bar.yaxis" as SFSymbol} type="hierarchical" />
        </View>
      </View>

      <View style={styles.chartContainer}>
        <BarChart
          data={barData}
          width={screenWidth}
          height={220}
          barWidth={30}
          spacing={20}
          noOfSections={5}
          barBorderRadius={4}
          hideRules
          xAxisThickness={1}
          yAxisThickness={1}
          xAxisColor="#DDDDDD"
          yAxisColor="#DDDDDD"
          showYAxisIndices
          yAxisIndicesColor="#DDDDDD"
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          renderTooltip={(item: {value: number}) => (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>{item.value}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartSection: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing['3xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['2xl'],
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
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
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.md,
    alignItems: 'center',
  },
  barLabel: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.regular,
    marginBottom: 6,
  },
  axisText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.regular,
  },
  tooltip: {
    backgroundColor: theme.colors.text.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.xs,
  },
  tooltipText: {
    color: theme.colors.surface,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
  },
});
