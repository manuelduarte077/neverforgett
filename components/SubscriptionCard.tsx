import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Subscription } from '@/types/subscription';

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress?: () => void;
  onMorePress?: () => void;
}

export function SubscriptionCard({ subscription, onPress, onMorePress }: SubscriptionCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getDaysUntilRenewal = () => {
    const renewalDate = new Date(subscription.renewalDate);
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilRenewal = getDaysUntilRenewal();
  const isUpcoming = daysUntilRenewal <= 7 && daysUntilRenewal >= 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.colorBar, { backgroundColor: subscription.color }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.name}>{subscription.name}</Text>
            <Text style={styles.category}>{subscription.category}</Text>
          </View>

          <TouchableOpacity onPress={onMorePress} style={styles.moreButton}>
            <SymbolView name="ellipsis" type="hierarchical" />

          </TouchableOpacity>
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
              colors={isUpcoming ? '#FF9500' : '#8E8E93'}
              type="hierarchical" />
            <Text style={[styles.renewalDate, isUpcoming && styles.upcomingRenewal]}>
              {formatDate(subscription.renewalDate)}
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 2,
  },
  category: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  moreButton: {
    padding: 4,
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
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#34C759',
    marginLeft: 4,
  },
  frequency: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  renewalSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renewalDate: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  upcomingRenewal: {
    color: '#FF9500',
  },
  daysLeft: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: '#FF9500',
    marginLeft: 4,
  },
});