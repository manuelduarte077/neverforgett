import React, { useRef, useCallback } from 'react';
import { View, ScrollView, Platform, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEditSubscription } from '@/hooks/useEditSubscription';
import { FormField } from '@/components/forms/FormField';
import { PickerField } from '@/components/forms/PickerField';
import { OptionsContainer, Option } from '@/components/forms/OptionsContainer';
import { Button } from '@/components/ui/Button';
import { ReminderBottomSheet } from '@/components/ReminderBottomSheet';
import { SUBSCRIPTION_CATEGORIES } from '@/types/subscription';
import { theme } from '@/styles/theme';

export default function EditSubscriptionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  
  const {
    formData,
    errors,
    loading,
    subscription,
    updateFormData,
    handleSubmit,
    handleSaveReminder,
    getReminderInitialData,
  } = useEditSubscription(id as string);

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = React.useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = React.useState(false);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
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
    Alert.alert(
      'Eliminar Suscripción',
      `¿Estás seguro de que deseas eliminar "${subscription?.name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            // Implementar eliminación
            router.back();
          }
        },
      ]
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
            title: 'Editar Suscripción',
            headerBackTitle: 'Atrás',
          }}
        />

        <ScrollView style={styles.scrollView}>
          <View style={styles.form}>
            <FormField
              label="Nombre del Servicio"
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              placeholder="ej. Netflix, Spotify..."
              error={errors.name}
            />

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
}); 