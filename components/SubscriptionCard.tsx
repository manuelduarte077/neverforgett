import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { Subscription } from '@/types/subscription';
import { theme } from '@/styles/theme';
import { useCurrency } from '@/hooks/useCurrency';

interface SubscriptionCardProps {
  subscription: Subscription;
  onMorePress?: () => void;
  showEditButton?: boolean;
}

export const SubscriptionCard = ({ subscription, onMorePress, showEditButton = true }: SubscriptionCardProps) => {
  const { formatCurrencyCompact } = useCurrency();
  
  const getDaysUntilRenewal = () => {
    const today = new Date();
    const renewalDate = new Date(subscription.renewalDate);
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRenewalStatus = () => {
    const daysUntilRenewal = getDaysUntilRenewal();
    
    if (daysUntilRenewal < 0) {
      return { text: 'Vencida', color: theme.colors.danger };
    } else if (daysUntilRenewal <= 7) {
      return { text: `${daysUntilRenewal} días`, color: theme.colors.warning };
    } else {
      return { text: `${daysUntilRenewal} días`, color: theme.colors.success };
    }
  };

  const formatRenewalDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const monthlyCost = subscription.frequency === 'monthly' 
    ? subscription.cost 
    : subscription.cost / 12;

  const renewalStatus = getRenewalStatus();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.serviceInfo}>
          <View style={styles.serviceHeader}>
            <SymbolView
              name={subscription.icon || 'creditcard'}
              type="hierarchical"
              style={styles.serviceIcon}
              tintColor={theme.colors.text.primary}
              fallback={<Text style={styles.serviceIcon}>💳</Text>}
            />
            <Text style={styles.serviceName}>{subscription.name}</Text>
          </View>
          <Text style={styles.category}>{subscription.category}</Text>
        </View>
        
        <View style={styles.costInfo}>
          <Text style={styles.cost}>{formatCurrencyCompact(monthlyCost)}</Text>
          <Text style={styles.frequency}>
            {subscription.frequency === 'monthly' ? '/mes' : '/año'}
          </Text>
        </View>
      </View>

              <View style={styles.cardFooter}>
          <View style={styles.renewalInfo}>
            <Text style={styles.renewalDate}>
              {formatRenewalDate(subscription.renewalDate)}
            </Text>
          </View>

          {showEditButton && (
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: renewalStatus.color }]}>
                <Text style={styles.statusText}>{renewalStatus.text}</Text>
              </View>
            </View>
          )}

          <View style={styles.actionButtons}>
          {showEditButton ? (
            <>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => router.push(`/edit-subscription/${subscription.id}`)}
              >
                <SymbolView name="pencil" type="hierarchical" />
              </TouchableOpacity>
              {onMorePress && (
                <TouchableOpacity style={styles.actionButton} onPress={onMorePress}>
                  <SymbolView name="ellipsis" type="hierarchical" />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <View style={[styles.statusBadge, { backgroundColor: renewalStatus.color }]}>
                <Text style={styles.statusText}>{renewalStatus.text}</Text>
              </View>
              {onMorePress && (
                <TouchableOpacity style={styles.actionButton} onPress={onMorePress}>
                  <SymbolView name="ellipsis" type="hierarchical" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      {subscription.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notes}>{subscription.notes}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  serviceIcon: {
    width: 20,
    height: 20,
    marginRight: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  serviceName: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  category: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  costInfo: {
    alignItems: 'flex-end',
  },
  cost: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
  },
  frequency: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  renewalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renewalDate: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.surface,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  notesContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  notes: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
});