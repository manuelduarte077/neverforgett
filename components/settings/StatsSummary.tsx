import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';
import { Subscription } from '@/types/subscription';

interface StatsSummaryProps {
  subscriptions: Subscription[];
}

export const StatsSummary = ({ subscriptions }: StatsSummaryProps) => {
  const totalMonthlyCost = subscriptions.reduce((total, sub) => {
    const monthlyCost = sub.frequency === 'monthly' ? sub.cost : sub.cost / 12;
    return total + monthlyCost;
  }, 0);

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{subscriptions.length}</Text>
        <Text style={styles.statLabel}>Suscripciones</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>
          {totalMonthlyCost.toFixed(0)}$
        </Text>
        <Text style={styles.statLabel}>Gasto Mensual</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    marginHorizontal: theme.spacing.xl,
    flexDirection: 'row',
    ...theme.shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['3xl'],
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.xl,
  },
}); 