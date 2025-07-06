import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { SymbolView, SFSymbol } from 'expo-symbols';

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
  // New styles for gifted-charts
  barLabel: {
    color: '#1C1C1E',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    marginBottom: 6,
  },
  axisText: {
    color: '#8E8E93',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  tooltip: {
    backgroundColor: '#1C1C1E',
    padding: 8,
    borderRadius: 4,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});
