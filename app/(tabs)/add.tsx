import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { CATEGORY_COLORS, SUBSCRIPTION_CATEGORIES } from '@/types/subscription';
import { SymbolView } from 'expo-symbols';


export default function AddSubscriptionScreen() {
  const { addSubscription, loading } = useSubscriptionStore();

  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    frequency: 'monthly' as 'monthly' | 'annual',
    renewalDate: new Date(),
    category: '',
    notes: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.cost.trim()) {
      newErrors.cost = 'El costo es requerido';
    } else if (isNaN(parseFloat(formData.cost)) || parseFloat(formData.cost) <= 0) {
      newErrors.cost = 'El costo debe ser un número válido';
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await addSubscription({
        name: formData.name.trim(),
        cost: parseFloat(formData.cost),
        frequency: formData.frequency,
        renewalDate: formData.renewalDate.toISOString(),
        category: formData.category,
        notes: formData.notes.trim(),
        color: CATEGORY_COLORS[formData.category] || CATEGORY_COLORS.Otros,
      });

      // Reset form
      setFormData({
        name: '',
        cost: '',
        frequency: 'monthly',
        renewalDate: new Date(),
        category: '',
        notes: '',
      });

      Alert.alert(
        'Suscripción Agregada',
        'La suscripción se ha agregado correctamente',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la suscripción');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Always close the picker first
    setShowDatePicker(false);

    // Update the date if one was selected
    if (selectedDate) {
      setFormData({ ...formData, renewalDate: selectedDate });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Nueva Suscripción</Text>
          <Text style={styles.subtitle}>
            Agrega una nueva suscripción para hacer seguimiento
          </Text>
        </View>

        <View style={styles.form}>
          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nombre del Servicio</Text>
            <View style={[styles.inputContainer, errors.name && styles.inputError]}>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="ej. Netflix, Spotify..."
                placeholderTextColor="#8E8E93"
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Cost Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Costo</Text>
            <View style={[styles.inputContainer, errors.cost && styles.inputError]}>
              <SymbolView name="dollarsign" style={{
                width: 20,
                height: 20,
                margin: 5,
              }} type="hierarchical" />
              <TextInput
                style={[styles.input, styles.inputWithIcon]}
                value={formData.cost}
                onChangeText={(text) => setFormData({ ...formData, cost: text })}
                placeholder="0.00"
                placeholderTextColor="#8E8E93"
                keyboardType="numeric"
              />
            </View>
            {errors.cost && <Text style={styles.errorText}>{errors.cost}</Text>}
          </View>

          {/* Frequency Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Frecuencia</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowFrequencyPicker(!showFrequencyPicker)}
            >
              <Text style={styles.pickerText}>
                {formData.frequency === 'monthly' ? 'Mensual' : 'Anual'}
              </Text>
              <SymbolView name="chevron.down" style={{
                width: 20,
                height: 20,
                margin: 5,
              }} type="hierarchical" />
            </TouchableOpacity>

            {showFrequencyPicker && (
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    setFormData({ ...formData, frequency: 'monthly' });
                    setShowFrequencyPicker(false);
                  }}
                >
                  <Text style={styles.optionText}>Mensual</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    setFormData({ ...formData, frequency: 'annual' });
                    setShowFrequencyPicker(false);
                  }}
                >
                  <Text style={styles.optionText}>Anual</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Renewal Date Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Fecha de Renovación</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <SymbolView name="calendar" style={{
                width: 20,
                height: 20,
                margin: 5,
              }} type="hierarchical" />
              <Text style={[styles.pickerText, styles.pickerTextWithIcon]}>
                {formatDate(formData.renewalDate)}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={formData.renewalDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* Category Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Categoría</Text>
            <TouchableOpacity
              style={[styles.pickerContainer, errors.category && styles.inputError]}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              <SymbolView name="tag" style={{
                width: 20,
                height: 20,
                margin: 5,
              }} type="hierarchical" />
              <Text style={[styles.pickerText, styles.pickerTextWithIcon, !formData.category && styles.placeholderText]}>
                {formData.category || 'Seleccionar categoría'}
              </Text>
              <SymbolView name="chevron.down" style={{
                width: 20,
                height: 20,
                margin: 5,
              }} type="hierarchical" />
            </TouchableOpacity>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

            {showCategoryPicker && (
              <View style={styles.optionsContainer}>
                {SUBSCRIPTION_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={styles.option}
                    onPress={() => {
                      setFormData({ ...formData, category });
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text style={styles.optionText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Notes Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Notas (Opcional)</Text>
            <View style={styles.inputContainer}>
              <SymbolView name="text.document" style={{
                width: 35,
                height: 35,
                margin: 5,
              }} type="hierarchical" />
              <TextInput
                style={[styles.input, styles.inputWithIcon, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Notas adicionales..."
                placeholderTextColor="#8E8E93"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Agregando...' : 'Agregar Suscripción'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
  form: {
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1C1C1E',
  },
  inputWithIcon: {
    marginLeft: 12,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pickerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1C1C1E',
    flex: 1,
  },
  pickerTextWithIcon: {
    marginLeft: 12,
  },
  placeholderText: {
    color: '#8E8E93',
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1C1C1E',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 32,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});