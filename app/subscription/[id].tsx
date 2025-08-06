import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { ReminderModal } from '@/components/ReminderModal';
import { useCurrency } from '@/hooks/useCurrency';
import { useDate } from '@/hooks/useDate';
import { commonStyles } from '@/styles/common';
import { theme } from '@/styles/theme';

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { subscriptions, updateSubscription, deleteSubscription, setSubscriptionReminder } = useSubscriptionStore();
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDate();
  
  const [subscription, setSubscription] = useState(subscriptions.find(sub => sub.id === id));
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [isUpdatingReminder, setIsUpdatingReminder] = useState(false);

  useEffect(() => {
    const currentSub = subscriptions.find(sub => sub.id === id);
    if (currentSub) {
      setSubscription(currentSub);
    } else {
      // Si no se encuentra la suscripción, volver atrás
      router.back();
    }
  }, [id, subscriptions]);

  if (!subscription) {
    return null; // O un componente de carga
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Suscripción',
      `¿Estás seguro de que deseas eliminar "${subscription.name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteSubscription(subscription.id);
            router.back();
          }
        },
      ]
    );
  };

  const handleSaveReminder = async (reminderData: {
    enabled: boolean;
    daysInAdvance: number;
    time: Date;
  }) => {
    try {
      setIsUpdatingReminder(true);
      const success = await setSubscriptionReminder(subscription.id, reminderData);
      
      if (success) {
        // Verificar si se programó la notificación correctamente
        const updatedSubscription = subscriptions.find(sub => sub.id === id);
        if (updatedSubscription && updatedSubscription.reminder?.enabled) {
          Alert.alert(
            'Recordatorio Configurado',
            `Se ha configurado un recordatorio para ${subscription.name} ${reminderData.daysInAdvance} día(s) antes de la renovación.`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Recordatorio Guardado',
            'La configuración se guardó pero no se pudo programar la notificación. Verifica los permisos.',
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert(
          'Error',
          'No se pudo configurar el recordatorio. Inténtalo de nuevo.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Ocurrió un error al configurar el recordatorio.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsUpdatingReminder(false);
    }
  };

  const getReminderInitialData = () => {
    if (subscription.reminder) {
      return {
        enabled: subscription.reminder.enabled,
        daysInAdvance: subscription.reminder.daysInAdvance,
        time: new Date(subscription.reminder.time),
      };
    }
    return {
      enabled: false,
      daysInAdvance: 3,
      time: new Date(),
    };
  };

  const monthlyCost = subscription.frequency === 'monthly' 
    ? subscription.cost 
    : subscription.cost / 12;

  const annualCost = subscription.frequency === 'monthly' 
    ? subscription.cost * 12 
    : subscription.cost;

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: subscription.name,
          headerBackTitle: 'Atrás',
        }}
      />

      <ScrollView style={commonStyles.scrollView}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{subscription.name}</Text>
            <Text style={styles.category}>{subscription.category}</Text>
          </View>
          
          <View style={styles.costDisplay}>
            <Text style={styles.monthlyCost}>{formatCurrency(monthlyCost)}</Text>
            <Text style={styles.frequency}>por mes</Text>
          </View>
        </View>

        {/* Cost Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles de Costo</Text>
          <View style={styles.costDetails}>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Costo por {subscription.frequency === 'monthly' ? 'mes' : 'año'}</Text>
              <Text style={styles.costValue}>{formatCurrency(subscription.cost)}</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Costo mensual</Text>
              <Text style={styles.costValue}>{formatCurrency(monthlyCost)}</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Costo anual</Text>
              <Text style={styles.costValue}>{formatCurrency(annualCost)}</Text>
            </View>
          </View>
        </View>

        {/* Renewal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Renovación</Text>
          <View style={styles.renewalInfo}>
            <View style={styles.infoRow}>
              <SymbolView name="calendar" type="hierarchical" />
              <Text style={styles.infoLabel}>Próxima renovación</Text>
                             <Text style={styles.infoValue}>{formatDate(subscription.renewalDate)}</Text>
            </View>
            <View style={styles.infoRow}>
              <SymbolView name="repeat" type="hierarchical" />
              <Text style={styles.infoLabel}>Frecuencia</Text>
              <Text style={styles.infoValue}>
                {subscription.frequency === 'monthly' ? 'Mensual' : 'Anual'}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {subscription.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <View style={styles.notesContainer}>
              <Text style={styles.notes}>{subscription.notes}</Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowReminderModal(true)}
            disabled={isUpdatingReminder}
          >
            <SymbolView name="bell" type="hierarchical" />
            <Text style={styles.actionButtonText}>
              {isUpdatingReminder ? 'Configurando...' : 'Configurar Recordatorio'}
            </Text>
            {isUpdatingReminder && <ActivityIndicator size="small" color={theme.colors.primary} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <SymbolView name="trash" type="hierarchical" />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              Eliminar Suscripción
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ReminderModal
        visible={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onSave={handleSaveReminder}
        initialData={getReminderInitialData()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  serviceInfo: {
    marginBottom: theme.spacing.lg,
  },
  serviceName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['3xl'],
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  category: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
  },
  costDisplay: {
    alignItems: 'center',
  },
  monthlyCost: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['4xl'],
    color: theme.colors.primary,
  },
  frequency: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  section: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  costDetails: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  costLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  costValue: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  renewalInfo: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  infoLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  infoValue: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  notesContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  notes: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  actionButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: theme.colors.danger,
  },
  deleteButtonText: {
    color: theme.colors.surface,
  },
});
