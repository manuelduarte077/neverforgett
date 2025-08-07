import React, { useRef, useCallback } from 'react';
import { View, Text, ScrollView, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEditSubscription } from '@/hooks/useEditSubscription';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { FormField } from '@/components/forms/FormField';
import { PickerField } from '@/components/forms/PickerField';
import { OptionsContainer, Option } from '@/components/forms/OptionsContainer';
import { Button } from '@/components/ui/Button';
import { ReminderBottomSheet } from '@/components/ReminderBottomSheet';
import { SUBSCRIPTION_CATEGORIES } from '@/types/subscription';
import { theme } from '@/styles/theme';
import { useCurrency } from '@/hooks/useCurrency';
import { useDate } from '@/hooks/useDate';
import { DatePickerEvent } from '@/types/common';
import { toast } from '@/services/ToastService';
import { IconPicker } from '@/components/IconPicker';
import { SymbolView } from 'expo-symbols';

export default function EditSubscriptionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { deleteSubscription } = useSubscriptionStore();
  const { formatCurrency } = useCurrency();
  const { formatDate } = useDate();
  
  const {
    formData,
    errors,
    loading,
    subscription,
    showIconPicker,
    updateFormData,
    handleSubmit,
    handleSaveReminder,
    getReminderInitialData,
    setShowIconPicker,
  } = useEditSubscription(id as string);

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = React.useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = React.useState(false);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDateChange = (event: DatePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      updateFormData('renewalDate', selectedDate);
    }
  };

  const formatRenewalDate = () => {
    return formData.renewalDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleDelete = () => {
    toast.confirm(
      `¿Estás seguro de que deseas eliminar "${subscription?.name}"? Esta acción no se puede deshacer.`,
      'Eliminar Suscripción',
      async () => {
        if (subscription) {
          await deleteSubscription(subscription.id);
          router.back();
        }
      }
    );
  };

  if (!subscription) {
    return null;
  }

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Stack.Screen
          options={{
            title: subscription?.name || 'Suscripción',
            headerBackTitle: 'Atrás',
          }}
        />

        <ScrollView style={styles.scrollView}>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Información Actual</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Servicio:</Text>
                <Text style={styles.infoValue}>{subscription?.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Costo:</Text>
                <Text style={styles.infoValue}>{formatCurrency(subscription?.cost || 0)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Frecuencia:</Text>
                <Text style={styles.infoValue}>
                  {subscription?.frequency === 'monthly' ? 'Mensual' : 'Anual'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Próxima renovación:</Text>
                <Text style={styles.infoValue}>{formatDate(subscription?.renewalDate || '')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.form}>
            <FormField
              label="Nombre del Servicio"
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              placeholder="ej. Netflix, Spotify..."
              error={errors.name}
            />

            <View style={styles.iconPickerContainer}>
              <Text style={styles.iconPickerLabel}>Icono de la Suscripción</Text>
              <TouchableOpacity
                style={styles.iconPickerButton}
                onPress={() => setShowIconPicker(true)}
              >
                <SymbolView
                  name={formData.icon}
                  type="hierarchical"
                  style={styles.selectedIcon}
                />
                <Text style={styles.iconPickerText}>Seleccionar Icono</Text>
              </TouchableOpacity>
            </View>

            <FormField
              label="Costo"
              value={formData.cost}
              onChangeText={(text) => updateFormData('cost', text)}
              placeholder="0.00"
              error={errors.cost}
              icon="dollarsign"
              keyboardType="numeric"
            />

            <PickerField
              label="Frecuencia"
              value={formData.frequency === 'monthly' ? 'Mensual' : 'Anual'}
              onPress={() => setShowFrequencyPicker(!showFrequencyPicker)}
            />

            {showFrequencyPicker && (
              <OptionsContainer>
                <Option
                  label="Mensual"
                  onPress={() => {
                    updateFormData('frequency', 'monthly');
                    setShowFrequencyPicker(false);
                  }}
                />
                <Option
                  label="Anual"
                  onPress={() => {
                    updateFormData('frequency', 'annual');
                    setShowFrequencyPicker(false);
                  }}
                />
              </OptionsContainer>
            )}

            <PickerField
              label="Fecha de Renovación"
              value={formatRenewalDate()}
              onPress={() => setShowDatePicker(true)}
              icon="calendar"
              showChevron={false}
            />

            {showDatePicker && (
              <DateTimePicker
                value={formData.renewalDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}

            <PickerField
              label="Categoría"
              value={formData.category}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              placeholder="Seleccionar categoría"
              error={errors.category}
              icon="tag"
            />

            {showCategoryPicker && (
              <OptionsContainer>
                {SUBSCRIPTION_CATEGORIES.map((category) => (
                  <Option
                    key={category}
                    label={category}
                    onPress={() => {
                      updateFormData('category', category);
                      setShowCategoryPicker(false);
                    }}
                  />
                ))}
              </OptionsContainer>
            )}

            <FormField
              label="Notas (Opcional)"
              value={formData.notes}
              onChangeText={(text) => updateFormData('notes', text)}
              placeholder="Notas adicionales..."
              icon="text.document"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={loading ? 'Actualizando...' : 'Actualizar Suscripción'}
              onPress={handleSubmit}
              disabled={loading}
              loading={loading}
              size="large"
            />

            <View style={styles.reminderButton}>
              <Button
                title="Configurar Recordatorio"
                onPress={handlePresentModalPress}
                variant="secondary"
                size="large"
              />
            </View>

            <View style={styles.deleteButton}>
              <Button
                title="Eliminar Suscripción"
                onPress={handleDelete}
                variant="danger"
                size="large"
              />
            </View>
          </View>
        </ScrollView>

        <ReminderBottomSheet
          bottomSheetModalRef={bottomSheetModalRef}
          onSave={handleSaveReminder}
          initialData={getReminderInitialData()}
        />

        <IconPicker
          selectedIcon={formData.icon}
          onIconSelect={(icon) => updateFormData('icon', icon)}
          visible={showIconPicker}
          onClose={() => setShowIconPicker(false)}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  infoSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
  },
  infoTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  infoLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  infoValue: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  form: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  buttonContainer: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing['3xl'],
  },
  reminderButton: {
    marginTop: theme.spacing.md,
  },
  deleteButton: {
    marginTop: theme.spacing.md,
  },
  iconPickerContainer: {
    marginBottom: theme.spacing.md,
  },
  iconPickerLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  iconPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedIcon: {
    width: 24,
    height: 24,
    marginRight: theme.spacing.md,
  },
  iconPickerText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
}); 