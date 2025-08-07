import { View, ScrollView, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAddSubscription } from '@/hooks/useAddSubscription';
import { FormField } from '@/components/forms/FormField';
import { PickerField } from '@/components/forms/PickerField';
import { OptionsContainer, Option } from '@/components/forms/OptionsContainer';
import { Button } from '@/components/ui/Button';
import { SUBSCRIPTION_CATEGORIES } from '@/types/subscription';
import { theme } from '@/styles/theme';
import { IconPicker } from '@/components/IconPicker';
import { SymbolView } from 'expo-symbols';

export default function AddSubscriptionScreen() {
  const {
    formData,
    errors,
    loading,
    showDatePicker,
    showCategoryPicker,
    showFrequencyPicker,
    showIconPicker,
    handleSubmit,
    handleDateChange,
    updateFormData,
    formatRenewalDate,
    setShowDatePicker,
    setShowCategoryPicker,
    setShowFrequencyPicker,
    setShowIconPicker,
  } = useAddSubscription();

  return (
    <ScrollView style={styles.scrollView}>
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
          title={loading ? 'Agregando...' : 'Agregar Suscripción'}
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          size="large"
        />
      </View>

      <IconPicker
        selectedIcon={formData.icon}
        onIconSelect={(icon) => updateFormData('icon', icon)}
        visible={showIconPicker}
        onClose={() => setShowIconPicker(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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