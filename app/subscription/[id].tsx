import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { ReminderModal } from '@/components/ReminderModal';

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { subscriptions, updateSubscription, deleteSubscription, setSubscriptionReminder } = useSubscriptionStore();
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
      month: 'long',
      year: 'numeric'
    });
  };

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

  // Preparar datos iniciales para el modal de recordatorio
  const getReminderInitialData = () => {
    if (subscription.reminder) {
      return {
        enabled: subscription.reminder.enabled,
        daysInAdvance: subscription.reminder.daysInAdvance,
        time: new Date(subscription.reminder.time)
      };
    }
    return {
      enabled: false,
      daysInAdvance: 3,
      time: new Date()
    };
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: subscription.name,
          headerBackTitle: 'Atrás',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <View style={[styles.categoryBadge, { backgroundColor: subscription.color }]}>
              <Text style={styles.categoryText}>{subscription.category}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles de Pago</Text>
            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Costo</Text>
                <Text style={styles.detailValue}>{formatCurrency(subscription.cost)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Frecuencia</Text>
                <Text style={styles.detailValue}>
                  {subscription.frequency === 'monthly' ? 'Mensual' : 'Anual'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Próxima Renovación</Text>
                <Text style={styles.detailValue}>{formatDate(subscription.renewalDate)}</Text>
              </View>
            </View>
          </View>

          {subscription.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notas</Text>
              <View style={styles.detailCard}>
                <Text style={styles.notesText}>{subscription.notes}</Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recordatorios</Text>
            <View style={styles.detailCard}>
              {subscription.reminder?.enabled ? (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Estado</Text>
                    <Text style={[styles.detailValue, { color: '#34C759' }]}>Activado</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Anticipación</Text>
                    <Text style={styles.detailValue}>
                      {subscription.reminder.daysInAdvance} día(s) antes
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Hora</Text>
                    <Text style={styles.detailValue}>
                      {new Date(subscription.reminder.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </>
              ) : (
                <Text style={styles.emptyText}>
                  No hay recordatorios configurados para esta suscripción.
                </Text>
              )}
              <TouchableOpacity
                style={[styles.reminderButton, isUpdatingReminder && styles.reminderButtonDisabled]}
                onPress={() => setShowReminderModal(true)}
                disabled={isUpdatingReminder}
              >
                {isUpdatingReminder ? (
                  <>
                    <ActivityIndicator size="small" color="#007AFF" />
                    <Text style={styles.reminderButtonText}>Actualizando...</Text>
                  </>
                ) : (
                  <>
                    <SymbolView name="bell" type="hierarchical" />
                    <Text style={styles.reminderButtonText}>
                      {subscription.reminder?.enabled ? 'Editar Recordatorio' : 'Configurar Recordatorio'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.dangerZone}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <SymbolView name="trash" type="hierarchical" colors="#FFFFFF" />
              <Text style={styles.deleteButtonText}>Eliminar Suscripción</Text>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  categoryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1C1C1E',
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  detailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
  },
  notesText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 22,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    paddingVertical: 16,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  reminderButtonDisabled: {
    opacity: 0.5,
  },
  reminderButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  dangerZone: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
  },
  deleteButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
