import { View, Text, StyleSheet } from 'react-native';
import { SymbolView, SFSymbol } from 'expo-symbols';
import { theme } from '@/styles/theme';

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
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['3xl'],
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
  insightsList: {
    marginTop: theme.spacing.xl,
  },
  insightItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...theme.shadows.sm,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginBottom: 6,
  },
  insightDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  insightMetric: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  insightMetricValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  insightMetricLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});
