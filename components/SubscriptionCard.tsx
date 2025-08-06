import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { Subscription } from '@/types/subscription';
import { useCurrency } from '@/hooks/useCurrency';
import { useDate } from '@/hooks/useDate';
import { theme } from '@/styles/theme';

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress?: () => void;
  onMorePress?: () => void;
  onReminderPress?: () => void;
}

export function SubscriptionCard({ subscription, onPress, onMorePress, onReminderPress }: SubscriptionCardProps) {
  const { formatCurrency } = useCurrency();
  const { formatDateShort, getDaysUntilRenewal } = useDate();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/subscription/${subscription.id}`);
    }
  };

  const daysUntilRenewal = getDaysUntilRenewal(subscription.renewalDate);
  const isUpcoming = daysUntilRenewal <= 7 && daysUntilRenewal >= 0;

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={[styles.colorBar, { backgroundColor: subscription.color }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.name}>{subscription.name}</Text>
            <Text style={styles.category}>{subscription.category}</Text>
          </View>

          <View style={styles.actionButtons}>
            {subscription.reminder?.enabled && (
              <TouchableOpacity onPress={onReminderPress} style={styles.reminderButton}>
                <SymbolView name="bell.fill" type="hierarchical" colors={theme.colors.primary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onMorePress} style={styles.moreButton}>
              <SymbolView name="ellipsis" type="hierarchical" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.costSection}>
            <SymbolView name="dollarsign" type="hierarchical" />
            <Text style={styles.cost}>
              {formatCurrency(subscription.cost)}
            </Text>
            <Text style={styles.frequency}>
              /{subscription.frequency === 'monthly' ? 'mes' : 'año'}
            </Text>
          </View>

          <View style={styles.renewalSection}>
            <SymbolView name="calendar"
              colors={isUpcoming ? theme.colors.warning : theme.colors.text.secondary}
              type="hierarchical" />
            <Text style={[styles.renewalDate, isUpcoming && styles.upcomingRenewal]}>
              {formatDateShort(subscription.renewalDate)}
            </Text>
            {isUpcoming && (
              <Text style={styles.daysLeft}>
                ({daysUntilRenewal} días)
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  titleSection: {
    flex: 1,
  },
  name: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  category: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  moreButton: {
    padding: theme.spacing.xs,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cost: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.success,
    marginLeft: theme.spacing.xs,
  },
  frequency: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  renewalSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renewalDate: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  upcomingRenewal: {
    color: theme.colors.warning,
  },
  daysLeft: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.warning,
    marginLeft: theme.spacing.xs,
  },
});