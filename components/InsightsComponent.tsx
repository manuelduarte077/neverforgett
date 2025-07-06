import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SymbolView, SFSymbol } from 'expo-symbols';

interface InsightItem {
  title: string;
  description: string;
  metricValue: string;
  metricLabel: string;
  iconName: SFSymbol;
  iconBackground: string;
}

interface InsightsComponentProps {
  title: string;
  subtitle?: string;
  insights: InsightItem[];
}

export const InsightsComponent = ({ title, subtitle, insights }: InsightsComponentProps) => {
  return (
    <View style={styles.insightsSection}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.sectionIcon}>
          <SymbolView name="chart.line.uptrend.xyaxis" type="hierarchical" />
        </View>
      </View>

      <View style={styles.insightsList}>
        {insights.map((insight, index) => (
          <View key={index} style={styles.insightItem}>
            <View style={[styles.insightIcon, { backgroundColor: insight.iconBackground }]}>
              <SymbolView 
                name={insight.iconName} 
                style={{
                  width: 20,
                  height: 20,
                  margin: 5,
                }} 
                type="hierarchical" 
              />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
              <View style={styles.insightMetric}>
                <Text style={styles.insightMetricValue}>{insight.metricValue}</Text>
                <Text style={styles.insightMetricLabel}>{insight.metricLabel}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  insightsSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
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
});
